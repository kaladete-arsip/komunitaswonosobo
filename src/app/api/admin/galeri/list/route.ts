// src/app/api/admin/galeri/list/route.ts
// GET galeri untuk admin panel
import { NextRequest, NextResponse } from "next/server";
import { readClient } from "../../../../../../sanity/lib/client";
import { requireAdmin } from "@/lib/auth";

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
