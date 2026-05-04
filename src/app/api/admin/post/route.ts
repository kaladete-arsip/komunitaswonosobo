// src/app/api/admin/post/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../../sanity/lib/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET — ambil semua post komunitas ini
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await client.fetch(
    `*[_type == "post" && komunitas->slug.current == $slug] | order(publishedAt desc) {
      _id, judul, slug, ringkasan, publishedAt
    }`,
    { slug }
  );

  return NextResponse.json(posts);
}

// POST — buat post baru
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, judul, ringkasan, konten, thumbnailUrl } = body;

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

  if (!komunitas) return NextResponse.json({ error: "Komunitas not found" }, { status: 404 });

  const doc = {
    _type: "post",
    judul,
    slug: {
      _type: "slug",
      current: judul.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    },
    ringkasan,
    konten,
    publishedAt: new Date().toISOString(),
    komunitas: { _type: "reference", _ref: komunitas._id },
    ...(thumbnailUrl && { thumbnail: { blobUrl: thumbnailUrl } }),
  };

  const created = await client.create(doc);

  // Log aktivitas
  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "post.create",
      detail: judul,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

// DELETE — hapus post
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { slug, postId } = body;

  try {
    await requireAdmin(slug);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getServerSession(authOptions);
  await client.delete(postId);

  await prisma.activityLog.create({
    data: {
      komunitasSlug: slug,
      userEmail: session?.user?.email ?? "unknown",
      action: "post.delete",
      detail: postId,
    },
  });

  return NextResponse.json({ deleted: true });
}
