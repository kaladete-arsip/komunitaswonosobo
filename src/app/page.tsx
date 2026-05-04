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
    <main>
      {/* Hero */}
      <section style={{ background: "#16a34a", color: "white", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            Jaya Sanga Nusantara
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: 500, margin: "0 auto" }}>
            Platform komunitas dan yayasan non-profit Indonesia
          </p>
        </div>
      </section>

      {/* Direktori */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem" }}>
            Komunitas Kami ({data.length})
          </h2>

          {data.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <p>Belum ada komunitas terdaftar.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem"
            }}>
              {data.map((k) => (
                <Link
                  key={k._id}
                  href={`/${k.slug.current}`}
                  style={{ display: "block" }}
                >
                  <div className="card" style={{
                    borderTop: `4px solid ${k.warnaPrimer || "#16a34a"}`,
                    transition: "box-shadow 0.2s",
                    cursor: "pointer"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                      <div style={{
                        width: 48, height: 48,
                        borderRadius: 8,
                        background: k.warnaPrimer || "#16a34a",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: "1.2rem",
                        flexShrink: 0
                      }}>
                        {k.nama[0]}
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{k.nama}</h3>
                        {k.tagline && (
                          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{k.tagline}</p>
                        )}
                      </div>
                    </div>
                    <p style={{
                      fontSize: "0.8rem",
                      color: k.warnaPrimer || "#16a34a",
                      fontWeight: 500
                    }}>
                      {k.slug.current}.komunitaswonosobo.org →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
