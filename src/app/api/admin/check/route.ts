// src/app/api/admin/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { readClient } from "../../../../../sanity/lib/client";
import { KOMUNITAS_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ isAdmin: false }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ isAdmin: false });
  }

  // Ambil data komunitas dari Sanity
  const komunitas = await readClient.fetch(KOMUNITAS_BY_SLUG_QUERY, { slug });
  if (!komunitas) return NextResponse.json({ isAdmin: false });

  // Cek 1: apakah email ada di daftar adminEmails Sanity
  const emailInSanity = komunitas.adminEmails?.includes(session.user.email);

  if (emailInSanity) {
    // Pastikan user & relasi ada di Neon
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      // Upsert relasi admin jika belum ada
      await prisma.komunitasAdmin.upsert({
        where: {
          userId_komunitasSlug: {
            userId: user.id,
            komunitasSlug: slug,
          },
        },
        update: {},
        create: {
          userId: user.id,
          komunitasSlug: slug,
          role: "editor",
        },
      });
    }

    return NextResponse.json({ isAdmin: true, komunitas });
  }

  // Cek 2: apakah ada di Neon (fallback)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { adminOf: { where: { komunitasSlug: slug } } },
  });

  const isAdmin = (user?.adminOf?.length ?? 0) > 0;
  return NextResponse.json({ isAdmin, komunitas: isAdmin ? komunitas : null });
}
