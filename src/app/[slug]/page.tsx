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
  const aksen = komunitas.warnaAksen || "#15803d";

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero Header */}
      <header style={{
        background: `linear-gradient(135deg, ${primer} 0%, ${aksen} 100%)`,
        color: "white",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 300, height: 300,
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 200, height: 200,
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }} />

        <div className="container" style={{ position: "relative", padding: "2.5rem 1.5rem 0" }}>
          {/* Top nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", textDecoration: "none" }}>
              ← Semua Komunitas
            </Link>
            <Link
              href={`/${params.slug}/admin`}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                padding: "0.45rem 1rem",
                borderRadius: 20,
                fontSize: "0.8rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              ⚙️ Panel Admin
            </Link>
          </div>

          {/* Profile */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", paddingBottom: "2.5rem" }}>
            <div style={{
              width: 80, height: 80,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.2rem", fontWeight: 800,
              flexShrink: 0,
            }}>
              {komunitas.nama[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                {komunitas.nama}
              </h1>
              {komunitas.tagline && (
                <p style={{ opacity: 0.85, marginTop: "0.4rem", fontSize: "1rem", margin: "0.4rem 0 0" }}>
                  {komunitas.tagline}
                </p>
              )}

              {/* Sosmed links di header */}
              {komunitas.sosmed && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {komunitas.sosmed.instagram && (
                    <a href={komunitas.sosmed.instagram} target="_blank" rel="noopener noreferrer" style={sosmedStyle}>
                      📸 Instagram
                    </a>
                  )}
                  {komunitas.sosmed.facebook && (
                    <a href={komunitas.sosmed.facebook} target="_blank" rel="noopener noreferrer" style={sosmedStyle}>
                      👍 Facebook
                    </a>
                  )}
                  {komunitas.sosmed.youtube && (
                    <a href={komunitas.sosmed.youtube} target="_blank" rel="noopener noreferrer" style={sosmedStyle}>
                      ▶️ YouTube
                    </a>
                  )}
                  {komunitas.sosmed.tiktok && (
                    <a href={komunitas.sosmed.tiktok} target="_blank" rel="noopener noreferrer" style={sosmedStyle}>
                      🎵 TikTok
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container" style={{ padding: "2.5rem 1.5rem", maxWidth: 1100 }}>

        {/* Deskripsi */}
        {komunitas.deskripsi && (
          <section style={{
            background: "white",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "2rem",
            borderLeft: `4px solid ${primer}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#374151", margin: 0 }}>
              {komunitas.deskripsi}
            </p>
          </section>
        )}

        {/* Post / Artikel */}
        {posts.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={sectionTitleStyle(primer)}>📰 Artikel & Berita</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {posts.map((post: any) => (
                <Link key={post._id} href={`/${params.slug}/post/${post.slug.current}`} style={{ textDecoration: "none" }}>
                  <div style={cardStyle}>
                    {post.thumbnail?.blobUrl && (
                      <img
                        src={post.thumbnail.blobUrl}
                        alt={post.judul}
                        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: "0.75rem" }}
                      />
                    )}
                    <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#111827", fontSize: "0.95rem" }}>
                      {post.judul}
                    </h3>
                    {post.ringkasan && (
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem", lineHeight: 1.6 }}>
                        {post.ringkasan.slice(0, 100)}...
                      </p>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      🗓 {new Date(post.publishedAt).toLocaleDateString("id-ID", {
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
            <h2 style={sectionTitleStyle(primer)}>🎥 Video</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {videos.map((video: any) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
                return (
                  <div key={video._id} style={cardStyle}>
                    {embedUrl && (
                      <div style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "0.75rem", borderRadius: 8, overflow: "hidden" }}>
                        <iframe
                          src={embedUrl}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                          allowFullScreen
                          title={video.judul}
                        />
                      </div>
                    )}
                    <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>{video.judul}</h3>
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
            <h2 style={sectionTitleStyle(primer)}>🖼️ Galeri Foto</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {galeri.map((item: any) => (
                <div key={item._id} style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <img
                    src={item.blobUrl}
                    alt={item.caption || "Foto"}
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                  {item.caption && (
                    <div style={{ padding: "0.5rem 0.75rem", background: "white" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0, textAlign: "center" }}>
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Kontak & Sosmed */}
        {(komunitas.kontak || komunitas.sosmed) && (
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>

            {/* Kontak */}
            {komunitas.kontak && (komunitas.kontak.email || komunitas.kontak.telepon || komunitas.kontak.alamat) && (
              <div style={{ ...cardStyle, borderTop: `3px solid ${primer}` }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: primer }}>
                  📬 Kontak
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {komunitas.kontak.email && (
                    <a href={`mailto:${komunitas.kontak.email}`} style={{ color: "#374151", textDecoration: "none", fontSize: "0.9rem" }}>
                      📧 {komunitas.kontak.email}
                    </a>
                  )}
                  {komunitas.kontak.telepon && (
                    <a href={`https://wa.me/${komunitas.kontak.telepon.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#374151", textDecoration: "none", fontSize: "0.9rem" }}>
                      📱 {komunitas.kontak.telepon}
                    </a>
                  )}
                  {komunitas.kontak.alamat && (
                    <p style={{ color: "#374151", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
                      📍 {komunitas.kontak.alamat}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Media Sosial */}
            {komunitas.sosmed && (komunitas.sosmed.instagram || komunitas.sosmed.facebook || komunitas.sosmed.youtube || komunitas.sosmed.tiktok) && (
              <div style={{ ...cardStyle, borderTop: `3px solid ${primer}` }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: primer }}>
                  🌐 Media Sosial
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {komunitas.sosmed.instagram && (
                    <a href={komunitas.sosmed.instagram} target="_blank" rel="noopener noreferrer" style={sosmedCardStyle}>
                      📸 Instagram
                    </a>
                  )}
                  {komunitas.sosmed.facebook && (
                    <a href={komunitas.sosmed.facebook} target="_blank" rel="noopener noreferrer" style={sosmedCardStyle}>
                      👍 Facebook
                    </a>
                  )}
                  {komunitas.sosmed.youtube && (
                    <a href={komunitas.sosmed.youtube} target="_blank" rel="noopener noreferrer" style={sosmedCardStyle}>
                      ▶️ YouTube
                    </a>
                  )}
                  {komunitas.sosmed.tiktok && (
                    <a href={komunitas.sosmed.tiktok} target="_blank" rel="noopener noreferrer" style={sosmedCardStyle}>
                      🎵 TikTok
                    </a>
                  )}
                </div>
              </div>
            )}

          </section>
        )}

      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", fontSize: "0.8rem", borderTop: "1px solid #e5e7eb" }}>
        <p>© {new Date().getFullYear()} {komunitas.nama} · Platform Komunitas Wonosobo</p>
      </footer>

    </main>
  );
}

// ── Style helpers ──────────────────────────────────────────────

const sosmedStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  padding: "0.3rem 0.75rem",
  borderRadius: 20,
  fontSize: "0.8rem",
  textDecoration: "none",
  display: "inline-block",
};

const sosmedCardStyle: React.CSSProperties = {
  color: "#374151",
  textDecoration: "none",
  fontSize: "0.9rem",
  padding: "0.5rem 0.75rem",
  background: "#f9fafb",
  borderRadius: 8,
  display: "block",
  transition: "background 0.2s",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  padding: "1.25rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
  border: "1px solid #f1f5f9",
};

function sectionTitleStyle(primer: string): React.CSSProperties {
  return {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "1.25rem",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    paddingBottom: "0.75rem",
    borderBottom: `2px solid ${primer}`,
  };
}