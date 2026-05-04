// src/app/api/admin/galeri/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { client, readClient } from "../../../../../sanity/lib/client";
import { requireAdmin } from "@/lib/auth";

// GET — ambil semua foto galeri komunitas ini
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await readClient.fetch(
    `*[_type == "galeri" && komunitas->slug.current == $slug] | order(_createdAt desc) {
      _id, caption, blobUrl
    }`,
    { slug }
  );

  return NextResponse.json(items);
}
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// POST — upload foto baru ke Vercel Blob, simpan referensi ke Sanity
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const slug = formData.get("slug") as string;
  const caption = formData.get("caption") as string;
  const file = formData.get("foto") as File;

  if (!slug || !file) {
    return NextResponse.json({ error: "Slug dan foto wajib diisi" }, { status: 400 });
  }

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);

  // Upload ke Vercel Blob
  const filename = `galeri/${slug}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, { access: "public" });

  // Simpan referensi ke Sanity
  const komunitas = await client.fetch(
    `*[_type == "komunitas" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  await client.create({
    _type: "galeri",
    komunitas: { _type: "reference", _ref: komunitas._id },
    caption,
    blobUrl: blob.url,
  });

  // Log aktivitas
  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "galeri.upload",
      detail: file.name,
    },
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}

// DELETE — hapus foto dari Vercel Blob dan Sanity
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { slug, sanityId, blobUrl } = body;

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);

  // Hapus dari Vercel Blob
  await del(blobUrl);

  // Hapus dari Sanity
  await client.delete(sanityId);

  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "galeri.delete",
      detail: blobUrl,
    },
  });

  return NextResponse.json({ deleted: true });
}
