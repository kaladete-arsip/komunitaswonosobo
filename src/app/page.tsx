// src/app/page.tsx
import { readClient } from "../../sanity/lib/client";
import { ALL_KOMUNITAS_QUERY } from "../../sanity/lib/queries";
import Link from "next/link";

interface Komunitas {
  _id: string;
  nama: string;
  slug: { current: string };
  tagline?: string;
  warnaPrimer?: string;
  logo?: { asset: { url: string } };
}

export const revalidate = 60;

export default async function HomePage() {
  const data: Komunitas[] = await readClient.fetch(ALL_KOMUNITAS_QUERY);

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "white" }}>

      <style>{`
        .komunitas-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .komunitas-card:hover {
          border-color: #eab308;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(234,179,8,0.1);
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #eab308;
          color: #0a0a0a;
          font-weight: 700;
          padding: 0.7rem 1.5rem;
          border-radius: 8px;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cta-btn:hover {
          background: #ca8a04;
          transform: translateY(-1px);
        }
        .sosmed-btn {
          display: inline-block;
          background: rgba(234,179,8,0.12);
          border: 1px solid rgba(234,179,8,0.25);
          color: #eab308;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sosmed-btn:hover {
          background: rgba(234,179,8,0.2);
        }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #111111 0%, #1a1a0a 60%, #0a0a0a 100%)",
        padding: "5rem 0 4rem",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #222",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(234,179,8,0.12)",
            border: "1px solid rgba(234,179,8,0.25)",
            padding: "0.35rem 0.9rem",
            borderRadius: 9999,
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#eab308",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            🌿 Jaya Sanga Nusantara
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em",
          }}>
            Komunitas{" "}
            <span style={{ color: "#eab308" }}>Wonosobo</span>
            <br />
            <span style={{ color: "#a3a3a3", fontWeight: 400, fontSize: "0.65em" }}>
              Satu Platform, Banyak Komunitas
            </span>
          </h1>

          <p style={{
            fontSize: "1.05rem",
            color: "#a3a3a3",
            maxWidth: 520,
            lineHeight: 1.75,
            marginBottom: "2.5rem",
          }}>
            Platform digital untuk komunitas dan yayasan di Wonosobo.
            Dikelola bersama oleh{" "}
            <span style={{ color: "#eab308", fontWeight: 600 }}>jayasanganusantara.or.id</span>
          </p>

          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
            {[
              { label: "Komunitas Aktif", value: data.length.toString() },
              { label: "Platform", value: "Gratis" },
              { label: "Pengelola", value: "JSN" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#eab308" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.1rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR (dekoratif) ───────────────────────────── */}
      <section style={{
        background: "#111",
        borderBottom: "1px solid #1f1f1f",
        padding: "1.25rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{
            flex: 1, minWidth: 200,
            display: "flex", alignItems: "center", gap: "0.75rem",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            padding: "0.6rem 1rem",
          }}>
            <span style={{ color: "#555" }}>🔍</span>
            <span style={{ color: "#555", fontSize: "0.9rem" }}>
              Cari komunitas di Wonosobo...
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            color: "#555", fontSize: "0.85rem",
          }}>
            <span>Total:</span>
            <span style={{
              background: "#eab308",
              color: "#0a0a0a",
              fontWeight: 700,
              padding: "0.15rem 0.6rem",
              borderRadius: 9999,
              fontSize: "0.8rem",
            }}>
              {data.length} komunitas
            </span>
          </div>
        </div>
      </section>

      {/* ── DIREKTORI ───────────────────────────────────────── */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
            flexWrap: "wrap", gap: "1rem",
          }}>
            <h2 style={{
              fontSize: "0.8rem", fontWeight: 700,
              color: "#555", letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Direktori Komunitas
            </h2>
            <div style={{
              height: 1, flex: 1, minWidth: 40,
              background: "linear-gradient(to right, #222, transparent)",
              margin: "0 1rem",
            }} />
            <span style={{ color: "#444", fontSize: "0.8rem" }}>
              {data.length} terdaftar
            </span>
          </div>

          {data.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "5rem 2rem",
              border: "1px dashed #222",
              borderRadius: 12,
              color: "#555",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>🏘️</div>
              <p style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#777" }}>
                Belum ada komunitas terdaftar
              </p>
              <p style={{ fontSize: "0.85rem" }}>
                Hubungi Jaya Sanga Nusantara untuk mendaftarkan komunitas Anda
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}>
              {data.map((k) => {
                const warna = k.warnaPrimer || "#16a34a";
                return (
                  <Link key={k._id} href={`/${k.slug.current}`} className="komunitas-card">
                    {/* Color accent bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: 3,
                      background: warna,
                    }} />

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{
                        width: 52, height: 52,
                        borderRadius: 10,
                        background: `${warna}22`,
                        border: `1px solid ${warna}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: warna,
                        fontWeight: 800,
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}>
                        {k.nama[0]}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#f5f5f5",
                          marginBottom: "0.3rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {k.nama}
                        </h3>
                        {k.tagline && (
                          <p style={{
                            fontSize: "0.8rem",
                            color: "#6b7280",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {k.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{
                      marginTop: "1.25rem",
                      paddingTop: "0.85rem",
                      borderTop: "1px solid #1f1f1f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <span style={{
                        fontSize: "0.73rem",
                        color: "#333",
                        fontFamily: "monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "70%",
                      }}>
                        /{k.slug.current}
                      </span>
                      <span style={{
                        fontSize: "0.78rem",
                        color: "#eab308",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        Lihat →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: "#111",
        borderTop: "1px solid #1a1a1a",
        padding: "3.5rem 0",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(234,179,8,0.06)",
            border: "1px solid rgba(234,179,8,0.15)",
            borderRadius: 16,
            padding: "2.5rem 3rem",
            maxWidth: 520,
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌿</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.6rem", color: "#f5f5f5" }}>
              Daftarkan Komunitas Anda
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.75, marginBottom: "1.75rem" }}>
              Bergabung dengan platform komunitas Wonosobo.
              Gratis, mudah, dan dikelola sendiri oleh pengurus komunitas.
            </p>
            <a
              href="https://jayasanganusantara.or.id"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              Hubungi Jaya Sanga Nusantara →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid #151515",
        padding: "1.5rem 0",
        background: "#0a0a0a",
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <p style={{ fontSize: "0.8rem", color: "#333" }}>
            © {new Date().getFullYear()} Komunitas Wonosobo ·{" "}
            <span style={{ color: "#eab308" }}>Jaya Sanga Nusantara</span>
          </p>
          <p style={{ fontSize: "0.8rem", color: "#2a2a2a" }}>
            komunitaswonosobo.org
          </p>
        </div>
      </footer>

    </main>
  );
}