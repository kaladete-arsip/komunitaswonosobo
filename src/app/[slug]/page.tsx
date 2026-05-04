// src/app/[slug]/page.tsx
import { readClient } from "../../../sanity/lib/client";
import {
  KOMUNITAS_BY_SLUG_QUERY,
  POSTS_BY_KOMUNITAS_QUERY,
  GALERI_BY_KOMUNITAS_QUERY,
  VIDEO_BY_KOMUNITAS_QUERY,
} from "../../../sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

export const revalidate = 60;

export default async function KomunitasPage({ params }: { params: { slug: string } }) {
  const [komunitas, posts, galeri, videos] = await Promise.all([
    readClient.fetch(KOMUNITAS_BY_SLUG_QUERY, { slug: params.slug }),
    readClient.fetch(POSTS_BY_KOMUNITAS_QUERY, { slug: params.slug }),
    readClient.fetch(GALERI_BY_KOMUNITAS_QUERY, { slug: params.slug }),
    readClient.fetch(VIDEO_BY_KOMUNITAS_QUERY, { slug: params.slug }),
  ]);

  if (!komunitas) notFound();

  const primer = komunitas.warnaPrimer || "#16a34a";

  return (
    <main>
      {/* Header */}
      <header style={{ background: primer, color: "white", padding: "3rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{
              width: 72, height: 72,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: 700
            }}>
              {komunitas.nama[0]}
            </div>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{komunitas.nama}</h1>
              {komunitas.tagline && (
                <p style={{ opacity: 0.9, marginTop: "0.25rem" }}>{komunitas.tagline}</p>
              )}
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Link
                href={`/${params.slug}/admin`}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: 500
                }}
              >
                Panel Admin →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>

        {/* Deskripsi */}
        {komunitas.deskripsi && (
          <section style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 700 }}>
              {komunitas.deskripsi}
            </p>
          </section>
        )}

        {/* Post / Artikel */}
        {posts.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.25rem", color: primer }}>
              Artikel & Berita
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {posts.map((post: any) => (
                <Link key={post._id} href={`/${params.slug}/post/${post.slug.current}`}>
                  <div className="card" style={{ cursor: "pointer" }}>
                    {post.thumbnail?.blobUrl && (
                      <img
                        src={post.thumbnail.blobUrl}
                        alt={post.judul}
                        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, marginBottom: "0.75rem" }}
                      />
                    )}
                    <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{post.judul}</h3>
                    {post.ringkasan && (
                      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                        {post.ringkasan.slice(0, 100)}...
                      </p>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Video YouTube */}
        {videos.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.25rem", color: primer }}>
              Video
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {videos.map((video: any) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
                return (
                  <div key={video._id} className="card" style={{ padding: "0.75rem" }}>
                    {embedUrl && (
                      <div style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "0.75rem" }}>
                        <iframe
                          src={embedUrl}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 6 }}
                          allowFullScreen
                          title={video.judul}
                        />
                      </div>
                    )}
                    <h3 style={{ fontWeight: 600, fontSize: "0.95rem" }}>{video.judul}</h3>
                    {video.deskripsi && (
                      <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>{video.deskripsi}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Galeri Foto */}
        {galeri.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.25rem", color: primer }}>
              Galeri Foto
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {galeri.map((item: any) => (
                <div key={item._id} style={{ position: "relative" }}>
                  <img
                    src={item.blobUrl}
                    alt={item.caption || "Foto"}
                    style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }}
                  />
                  {item.caption && (
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", textAlign: "center" }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Kontak */}
        {komunitas.kontak && (
          <section className="card" style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem", color: primer }}>
              Kontak
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {komunitas.kontak.email && <p>📧 {komunitas.kontak.email}</p>}
              {komunitas.kontak.telepon && <p>📱 {komunitas.kontak.telepon}</p>}
              {komunitas.kontak.alamat && <p>📍 {komunitas.kontak.alamat}</p>}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
