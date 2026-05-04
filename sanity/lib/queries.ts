// sanity/lib/queries.ts

// Semua komunitas (untuk halaman direktori)
export const ALL_KOMUNITAS_QUERY = `
  *[_type == "komunitas"] | order(nama asc) {
    _id,
    nama,
    slug,
    tagline,
    logo,
    warnaPrimer,
    warnaAksen
  }
`;

// Satu komunitas berdasarkan slug
export const KOMUNITAS_BY_SLUG_QUERY = `
  *[_type == "komunitas" && slug.current == $slug][0] {
    _id,
    nama,
    slug,
    tagline,
    deskripsi,
    logo,
    warnaPrimer,
    warnaAksen,
    adminEmails,
    kontak,
    sosmed
  }
`;

// Post terbaru suatu komunitas
export const POSTS_BY_KOMUNITAS_QUERY = `
  *[_type == "post" && komunitas->slug.current == $slug] | order(publishedAt desc) {
    _id,
    judul,
    slug,
    ringkasan,
    publishedAt,
    thumbnail
  }
`;

// Detail satu post
export const POST_DETAIL_QUERY = `
  *[_type == "post" && slug.current == $postSlug && komunitas->slug.current == $slug][0] {
    _id,
    judul,
    slug,
    konten,
    publishedAt,
    thumbnail,
    komunitas->{nama, slug, warnaPrimer}
  }
`;

// Galeri foto suatu komunitas
export const GALERI_BY_KOMUNITAS_QUERY = `
  *[_type == "galeri" && komunitas->slug.current == $slug] | order(_createdAt desc) {
    _id,
    caption,
    foto,
    blobUrl
  }
`;

// Video YouTube suatu komunitas
export const VIDEO_BY_KOMUNITAS_QUERY = `
  *[_type == "video" && komunitas->slug.current == $slug] | order(_createdAt desc) {
    _id,
    judul,
    deskripsi,
    youtubeUrl,
    thumbnailUrl
  }
`;
