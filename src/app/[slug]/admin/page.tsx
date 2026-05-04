"use client";
// src/app/[slug]/admin/page.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.slug as string;
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [komunitas, setKomunitas] = useState<any>(null);
  const [showProfil, setShowProfil] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [form, setForm] = useState({
    nama: "", tagline: "", deskripsi: "",
    warnaPrimer: "#16a34a", warnaAksen: "#15803d",
    kontak: { email: "", telepon: "", alamat: "" },
    sosmed: { instagram: "", facebook: "", youtube: "", tiktok: "" },
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/admin/check?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => {
          setIsAdmin(data.isAdmin);
          setKomunitas(data.komunitas);
          if (data.komunitas) {
            const k = data.komunitas;
            setForm({
              nama: k.nama || "",
              tagline: k.tagline || "",
              deskripsi: k.deskripsi || "",
              warnaPrimer: k.warnaPrimer || "#16a34a",
              warnaAksen: k.warnaAksen || "#15803d",
              kontak: {
                email: k.kontak?.email || "",
                telepon: k.kontak?.telepon || "",
                alamat: k.kontak?.alamat || "",
              },
              sosmed: {
                instagram: k.sosmed?.instagram || "",
                facebook: k.sosmed?.facebook || "",
                youtube: k.sosmed?.youtube || "",
                tiktok: k.sosmed?.tiktok || "",
              },
            });
          }
        });
    }
  }, [status, slug]);

  async function handleSaveProfil() {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/admin/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...form }),
    });
    if (res.ok) {
      setSaveMsg("✅ Profil berhasil disimpan!");
      const updated = await fetch(`/api/admin/check?slug=${slug}`).then(r => r.json());
      setKomunitas(updated.komunitas);
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveMsg("❌ Gagal menyimpan, coba lagi.");
    }
    setSaving(false);
  }

  // ── Loading states ──────────────────────────────────────────
  if (status === "loading") return (
    <div style={centerStyle}>
      <div style={{ textAlign: "center", color: "#555" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
        <p>Memuat...</p>
      </div>
    </div>
  );

  if (status === "unauthenticated") return (
    <div style={{ ...centerStyle, background: "#0a0a0a" }}>
      <div style={{
        textAlign: "center",
        background: "#111",
        border: "1px solid #222",
        borderRadius: 16,
        padding: "3rem 2.5rem",
        maxWidth: 380,
        width: "100%",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔐</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f5f5f5", marginBottom: "0.5rem" }}>
          Panel Admin
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
          Login dengan akun Google untuk melanjutkan
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: `/${slug}/admin` })}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#eab308",
            color: "#0a0a0a",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          🔑 Login dengan Google
        </button>
      </div>
    </div>
  );

  if (isAdmin === null) return (
    <div style={{ ...centerStyle, background: "#0a0a0a" }}>
      <p style={{ color: "#555" }}>Memverifikasi akses...</p>
    </div>
  );

  if (isAdmin === false) return (
    <div style={{ ...centerStyle, background: "#0a0a0a" }}>
      <div style={{
        textAlign: "center",
        background: "#111",
        border: "1px solid #222",
        borderRadius: 16,
        padding: "3rem 2.5rem",
        maxWidth: 400,
        width: "100%",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⛔</div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f5f5f5", marginBottom: "0.5rem" }}>
          Akses Ditolak
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", maxWidth: 300, margin: "0 auto 1.5rem" }}>
          Akun <strong style={{ color: "#eab308" }}>{session?.user?.email}</strong> tidak terdaftar sebagai admin komunitas ini.
        </p>
        <button
          onClick={() => signOut()}
          style={{
            padding: "0.6rem 1.5rem",
            background: "transparent",
            color: "#eab308",
            border: "1px solid #eab308",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );

  const primer = komunitas?.warnaPrimer || "#16a34a";

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "white" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{
        background: "#111",
        borderBottom: "1px solid #1f1f1f",
        padding: "1rem 0",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div className="container" style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 36, height: 36,
              background: `${primer}22`,
              border: `1px solid ${primer}55`,
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: primer, fontWeight: 800, fontSize: "1rem",
            }}>
              {komunitas?.nama?.[0]}
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", color: "#555", lineHeight: 1 }}>Panel Admin</p>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f5f5f5" }}>{komunitas?.nama}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href={`/${slug}`} target="_blank" style={{
              fontSize: "0.8rem", color: "#6b7280",
              padding: "0.4rem 0.85rem",
              border: "1px solid #222",
              borderRadius: 6,
            }}>
              🌐 Lihat Web
            </Link>
            {session?.user?.image && (
              <img src={session.user.image} alt="" style={{ width: 30, height: 30, borderRadius: "50%" }} />
            )}
            <button
              onClick={() => signOut()}
              style={{
                fontSize: "0.8rem", color: "#6b7280",
                padding: "0.4rem 0.85rem",
                background: "transparent",
                border: "1px solid #222",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>

        {/* ── MENU CARDS ──────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.85rem",
          marginBottom: "2.5rem",
        }}>
          {[
            { href: `/${slug}/admin/posts`, icon: "📝", label: "Post & Artikel", desc: "Tulis dan kelola artikel" },
            { href: `/${slug}/admin/galeri`, icon: "🖼️", label: "Galeri Foto", desc: "Upload dan kelola foto" },
            { href: `/${slug}/admin/video`, icon: "🎥", label: "Video YouTube", desc: "Tambah embed video" },
          ].map((menu) => (
            <Link key={menu.href} href={menu.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: 12,
                padding: "1.25rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
                borderLeft: `3px solid ${primer}`,
              }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.6rem" }}>{menu.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f5f5f5", marginBottom: "0.25rem" }}>
                  {menu.label}
                </h3>
                <p style={{ fontSize: "0.78rem", color: "#555" }}>{menu.desc}</p>
              </div>
            </Link>
          ))}

          {/* Pengaturan Profil */}
          <div
            onClick={() => setShowProfil(!showProfil)}
            style={{
              background: showProfil ? "#1a1a0a" : "#111",
              border: `1px solid ${showProfil ? "#eab308" : "#1f1f1f"}`,
              borderRadius: 12,
              padding: "1.25rem",
              cursor: "pointer",
              borderLeft: `3px solid #eab308`,
            }}
          >
            <div style={{ fontSize: "1.75rem", marginBottom: "0.6rem" }}>⚙️</div>
            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f5f5f5", marginBottom: "0.25rem" }}>
              Pengaturan Profil
            </h3>
            <p style={{ fontSize: "0.78rem", color: "#555" }}>Edit nama, warna, kontak, sosmed</p>
          </div>
        </div>

        {/* ── PANEL PENGATURAN PROFIL ──────────────────────── */}
        {showProfil && (
          <div style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 16,
            padding: "2rem",
            marginBottom: "2rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
              <h2 style={{ fontWeight: 700, color: "#f5f5f5", fontSize: "1rem" }}>
                ⚙️ Pengaturan Profil Komunitas
              </h2>
              {saveMsg && (
                <span style={{ fontSize: "0.85rem", color: saveMsg.startsWith("✅") ? "#4ade80" : "#f87171" }}>
                  {saveMsg}
                </span>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>

              {/* Identitas */}
              <div>
                <p style={sectionLabel}>Identitas</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={labelStyle}>Nama Komunitas</label>
                    <input style={inputStyle} value={form.nama}
                      onChange={e => setForm({ ...form, nama: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tagline</label>
                    <input style={inputStyle} value={form.tagline} placeholder="Tagline singkat..."
                      onChange={e => setForm({ ...form, tagline: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Deskripsi</label>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" } as any}
                      value={form.deskripsi} placeholder="Deskripsi komunitas..."
                      onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Warna Tema */}
              <div>
                <p style={sectionLabel}>Warna Tema</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={labelStyle}>Warna Primer</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input type="color" value={form.warnaPrimer}
                        onChange={e => setForm({ ...form, warnaPrimer: e.target.value })}
                        style={{ width: 48, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={form.warnaPrimer}
                        onChange={e => setForm({ ...form, warnaPrimer: e.target.value })}
                        placeholder="#16a34a" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Warna Aksen</label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input type="color" value={form.warnaAksen}
                        onChange={e => setForm({ ...form, warnaAksen: e.target.value })}
                        style={{ width: 48, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={form.warnaAksen}
                        onChange={e => setForm({ ...form, warnaAksen: e.target.value })}
                        placeholder="#15803d" />
                    </div>
                  </div>
                  {/* Preview */}
                  <div style={{
                    background: `linear-gradient(135deg, ${form.warnaPrimer}, ${form.warnaAksen})`,
                    borderRadius: 8,
                    padding: "0.85rem 1rem",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}>
                    Preview: {form.nama || "Nama Komunitas"}
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div>
                <p style={sectionLabel}>Kontak</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} value={form.kontak.email} placeholder="email@komunitas.com"
                      onChange={e => setForm({ ...form, kontak: { ...form.kontak, email: e.target.value } })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Telepon / WhatsApp</label>
                    <input style={inputStyle} value={form.kontak.telepon} placeholder="08xx-xxxx-xxxx"
                      onChange={e => setForm({ ...form, kontak: { ...form.kontak, telepon: e.target.value } })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Alamat</label>
                    <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" } as any}
                      value={form.kontak.alamat} placeholder="Alamat lengkap..."
                      onChange={e => setForm({ ...form, kontak: { ...form.kontak, alamat: e.target.value } })} />
                  </div>
                </div>
              </div>

              {/* Media Sosial */}
              <div>
                <p style={sectionLabel}>Media Sosial</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    { key: "instagram", icon: "📸", placeholder: "https://instagram.com/..." },
                    { key: "facebook", icon: "👍", placeholder: "https://facebook.com/..." },
                    { key: "youtube", icon: "▶️", placeholder: "https://youtube.com/..." },
                    { key: "tiktok", icon: "🎵", placeholder: "https://tiktok.com/..." },
                  ].map(({ key, icon, placeholder }) => (
                    <div key={key}>
                      <label style={labelStyle}>{icon} {key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input style={inputStyle} placeholder={placeholder}
                        value={(form.sosmed as any)[key]}
                        onChange={e => setForm({ ...form, sosmed: { ...form.sosmed, [key]: e.target.value } })} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Save button */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button
                onClick={handleSaveProfil}
                disabled={saving}
                style={{
                  padding: "0.75rem 2rem",
                  background: saving ? "#555" : "#eab308",
                  color: "#0a0a0a",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
              </button>
              <button
                onClick={() => setShowProfil(false)}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  color: "#6b7280",
                  border: "1px solid #333",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// ── Style helpers ──────────────────────────────────────────────
const centerStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  minHeight: "100vh", background: "#0a0a0a",
};

const sectionLabel: React.CSSProperties = {
  fontSize: "0.7rem", fontWeight: 700, color: "#eab308",
  letterSpacing: "0.08em", textTransform: "uppercase",
  marginBottom: "0.75rem",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.8rem",
  fontWeight: 600, color: "#a3a3a3",
  marginBottom: "0.3rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.6rem 0.8rem",
  background: "#1a1a1a", border: "1px solid #2a2a2a",
  borderRadius: 6, fontSize: "0.875rem",
  color: "#f5f5f5", outline: "none",
  fontFamily: "inherit",
};