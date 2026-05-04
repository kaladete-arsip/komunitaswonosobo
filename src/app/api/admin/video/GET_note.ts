// Tambahkan GET handler ke route video yang sudah ada
// src/app/api/admin/video/route.ts — tambahkan export GET di bawah

// NOTE: File ini melengkapi src/app/api/admin/video/route.ts
// Salin GET handler berikut ke route.ts yang sudah ada

/*
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
*/
