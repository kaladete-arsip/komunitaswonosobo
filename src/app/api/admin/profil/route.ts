// src/app/api/admin/profil/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../../sanity/lib/client";
import { requireAdmin } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { slug, nama, tagline, deskripsi, warnaPrimer, warnaAksen, kontak, sosmed } = body;

  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);

  // Ambil _id komunitas dari Sanity
  const komunitas = await client.fetch(
    `*[_type == "komunitas" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  if (!komunitas) return NextResponse.json({ error: "Komunitas tidak ditemukan" }, { status: 404 });

  // Build patch object — hanya field yang dikirim
  const patch: Record<string, any> = {};
  if (nama !== undefined) patch.nama = nama;
  if (tagline !== undefined) patch.tagline = tagline;
  if (deskripsi !== undefined) patch.deskripsi = deskripsi;
  if (warnaPrimer !== undefined) patch.warnaPrimer = warnaPrimer;
  if (warnaAksen !== undefined) patch.warnaAksen = warnaAksen;
  if (kontak !== undefined) patch.kontak = kontak;
  if (sosmed !== undefined) patch.sosmed = sosmed;

  const updated = await client.patch(komunitas._id).set(patch).commit();

  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "profil.update",
      detail: Object.keys(patch).join(", "),
    },
  });

  return NextResponse.json(updated);
}