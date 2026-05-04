// src/app/api/admin/video/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client, readClient } from "../../../../../sanity/lib/client";
import { requireAdmin } from "@/lib/auth";

// GET — ambil semua video komunitas ini
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await readClient.fetch(
    `*[_type == "video" && komunitas->slug.current == $slug] | order(_createdAt desc) {
      _id, judul, deskripsi, youtubeUrl
    }`,
    { slug }
  );

  return NextResponse.json(videos);
}
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

// POST — tambah video YouTube
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, judul, deskripsi, youtubeUrl } = body;

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validasi URL YouTube
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
  if (!embedUrl) {
    return NextResponse.json({ error: "URL YouTube tidak valid" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  const komunitas = await client.fetch(
    `*[_type == "komunitas" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  const created = await client.create({
    _type: "video",
    komunitas: { _type: "reference", _ref: komunitas._id },
    judul,
    deskripsi,
    youtubeUrl,
  });

  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "video.add",
      detail: judul,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

// DELETE — hapus video
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { slug, videoId } = body;

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);
  await client.delete(videoId);

  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "video.delete",
      detail: videoId,
    },
  });

  return NextResponse.json({ deleted: true });
}
