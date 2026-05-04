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
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "white" }}>

      <style>{`
        .post-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 12px;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: border-color 0.2s, transform 0.2s;
        }
        .post-card:hover {
          border-color: #333;
          transform: translateY(-2px);
        }
        .video-card {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 12px;
          padding: 1rem;
          overflow: hidden;
        }
        .sosmed-pill {
          display: inline-block;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #d4d4d4;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sosmed-pill:hover {
          background: rgba(255,255,255,0.12);
          color: white;
        }
        .info-link {
          color: #a3a3a3;
          text-decoration: none;
          font-size: 0.9rem;
          display: block;
          padding: 0.4rem 0;
          border-bottom: 1px solid #1a1a1a;
          transition: color 0.2s;
        }
        .info-link:last-child { border-bottom: none; }
        .info-link:hover { color: #eab308; }
      `}</style>

      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <header style={{
        background: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow accent dari warna komunitas */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 400, height: 400,
          background: `radial-gradient(circle, ${primer}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", padding: "1.5rem 1.5rem 0" }}>
          {/* Nav top */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <Link href="/" style={{ color: "#555", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              ← Semua Komunitas
            </Link>
            <Link href={`/${params.slug}/admin`} style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#6b7280",
              padding: "0.4rem 0.9rem",
              borderRadius: 20,
              fontSize: "0.78rem",
              fontWeight: 500,
            }}>
              ⚙️ Admin
            </Link>
          </div>

          {/* Profile */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", paddingBottom: "2rem" }}>
            <div style={{
              width: 72, height: 72,
              background: `${primer}22`,
              border: `2px solid ${primer}55`,
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: primer, fontSize: "2rem", fontWeight: 800, flexShrink: 0,
            }}>
              {komunitas.nama[0]}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, color: "#f5f5f5", marginBottom: "0.3rem" }}>
                {komunitas.nama}
              </h1>
              {komunitas.tagline && (
                <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>{komunitas.tagline}</p>
              )}

              {/* Sosmed pills */}
              {komunitas.sosmed && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
                  {komunitas.sosmed.instagram && (
                    <a href={komunitas.sosmed.instagram} target="_blank" rel="noopener noreferrer" className="sosmed-pill">📸 Instagram</a>
                  )}
                  {komunitas.sosmed.facebook && (
                    <a href={komunitas.sosmed.facebook} target="_blank" rel="noopener noreferrer" className="sosmed-pill">👍 Facebook</a>
                  )}
                  {komunitas.sosmed.youtube && (
                    <a href={komunitas.sosmed.youtube} target="_blank" rel="noopener noreferrer" className="sosmed-pill">▶️ YouTube</a>
                  )}
                  {komunitas.sosmed.tiktok && (
                    <a href={komunitas.sosmed.tiktok} target="_blank" rel="noopener noreferrer" className="sosmed-pill">🎵 TikTok</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color bar bawah header */}
        <div style={{
          height: 3,
          background: `linear-gradient(to right, ${primer}, ${aksen}, transparent)`,
        }} />
      </header>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>

        {/* Deskripsi */}
        {komunitas.deskripsi && (
          <section style={{
            background: "#111",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "2.5rem",
            borderLeft: `3px solid ${primer}`,
          }}>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "#a3a3a3", margin: 0 }}>
              {komunitas.deskripsi}
            </p>
          </section>
        )}

        {/* Artikel */}
        {posts.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={sectionTitle}>📰 Artikel & Berita</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {posts.map((post: any) => (
                <Link key={post._id} href={`/${params.slug}/post/${post.slug.current}`} className="post-card">
                  {post.thumbnail?.blobUrl && (
                    <img src={post.thumbnail.blobUrl} alt={post.judul}
                      style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginBottom: "0.85rem" }} />
                  )}
                  <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f5f5f5", marginBottom: "0.4rem" }}>
                    {post.judul}
                  </h3>
                  {post.ringkasan && (
                    <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                      {post.ringkasan.slice(0, 100)}...
                    </p>
                  )}
                  <p style={{ fontSize: "0.72rem", color: "#444" }}>
                    🗓 {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Video */}
        {videos.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={sectionTitle}>🎥 Video</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {videos.map((video: any) => {
                const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
                return (
                  <div key={video._id} className="video-card">
                    {embedUrl && (
                      <div style={{ position: "relative", paddingBottom: "56.25%", marginBottom: "0.75rem", borderRadius: 8, overflow: "hidden" }}>
                        <iframe src={embedUrl}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                          allowFullScreen title={video.judul} />
                      </div>
                    )}
                    <h3 style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f5f5f5" }}>{video.judul}</h3>
                    {video.deskripsi && (
                      <p style={{ fontSize: "0.78rem", color: "#555", marginTop: "0.25rem" }}>{video.deskripsi}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Galeri */}
        {galeri.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={sectionTitle}>🖼️ Galeri Foto</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.6rem" }}>
              {galeri.map((item: any) => (
                <div key={item._id} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a1a" }}>
                  <img src={item.blobUrl} alt={item.caption || "Foto"}
                    style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} />
                  {item.caption && (
                    <div style={{ padding: "0.4rem 0.6rem", background: "#111" }}>
                      <p style={{ fontSize: "0.72rem", color: "#555", textAlign: "center", margin: 0 }}>{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Kontak & Sosmed */}
        {(komunitas.kontak || komunitas.sosmed) && (
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}>
            {komunitas.kontak && (komunitas.kontak.email || komunitas.kontak.telepon || komunitas.kontak.alamat) && (
              <div style={{
                background: "#111", border: "1px solid #1f1f1f",
                borderRadius: 12, padding: "1.25rem",
                borderTop: `2px solid ${primer}`,
              }}>
                <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#eab308", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  📬 Kontak
                </h3>
                {komunitas.kontak.email && (
                  <a href={`mailto:${komunitas.kontak.email}`} className="info-link">📧 {komunitas.kontak.email}</a>
                )}
                {komunitas.kontak.telepon && (
                  <a href={`https://wa.me/${komunitas.kontak.telepon.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="info-link">
                    📱 {komunitas.kontak.telepon}
                  </a>
                )}
                {komunitas.kontak.alamat && (
                  <p style={{ color: "#a3a3a3", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
                    📍 {komunitas.kontak.alamat}
                  </p>
                )}
              </div>
            )}

            {komunitas.sosmed && (komunitas.sosmed.instagram || komunitas.sosmed.facebook || komunitas.sosmed.youtube || komunitas.sosmed.tiktok) && (
              <div style={{
                background: "#111", border: "1px solid #1f1f1f",
                borderRadius: 12, padding: "1.25rem",
                borderTop: `2px solid ${primer}`,
              }}>
                <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#eab308", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  🌐 Media Sosial
                </h3>
                {komunitas.sosmed.instagram && (
                  <a href={komunitas.sosmed.instagram} target="_blank" rel="noopener noreferrer" className="info-link">📸 Instagram</a>
                )}
                {komunitas.sosmed.facebook && (
                  <a href={komunitas.sosmed.facebook} target="_blank" rel="noopener noreferrer" className="info-link">👍 Facebook</a>
                )}
                {komunitas.sosmed.youtube && (
                  <a href={komunitas.sosmed.youtube} target="_blank" rel="noopener noreferrer" className="info-link">▶️ YouTube</a>
                )}
                {komunitas.sosmed.tiktok && (
                  <a href={komunitas.sosmed.tiktok} target="_blank" rel="noopener noreferrer" className="info-link">🎵 TikTok</a>
                )}
              </div>
            )}
          </section>
        )}

      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #151515", padding: "1.5rem 0", background: "#0a0a0a" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#333" }}>
            © {new Date().getFullYear()} {komunitas.nama}
          </p>
          <Link href="/" style={{ fontSize: "0.78rem", color: "#333" }}>
            komunitaswonosobo.org
          </Link>
        </div>
      </footer>

    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#eab308",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "1.25rem",
  paddingBottom: "0.6rem",
  borderBottom: "1px solid #1a1a1a",
};