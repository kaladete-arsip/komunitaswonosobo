"use client";
// src/app/[slug]/admin/page.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.slug as string;
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [komunitas, setKomunitas] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      // Cek apakah user ini admin komunitas ini
      fetch(`/api/admin/check?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => {
          setIsAdmin(data.isAdmin);
          setKomunitas(data.komunitas);
        });
    }
  }, [status, slug]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#6b7280" }}>Memuat...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Panel Admin</h2>
        <p style={{ color: "#6b7280" }}>Login dengan akun Google untuk melanjutkan</p>
        <button
          className="btn btn-primary"
          onClick={() => signIn("google", { callbackUrl: `/${slug}/admin` })}
          style={{ background: "#16a34a" }}
        >
          🔑 Login dengan Google
        </button>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#6b7280" }}>Memverifikasi akses...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>⛔</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600 }}>Akses Ditolak</h2>
        <p style={{ color: "#6b7280", maxWidth: 360 }}>
          Akun <strong>{session?.user?.email}</strong> tidak terdaftar sebagai admin komunitas ini.
          Hubungi pengelola Jaya Sanga Nusantara untuk mendapatkan akses.
        </p>
        <button className="btn btn-outline" onClick={() => signOut()} style={{ borderColor: "#16a34a", color: "#16a34a" }}>
          Logout
        </button>
      </div>
    );
  }

  const primer = komunitas?.warnaPrimer || "#16a34a";

  return (
    <main>
      {/* Header Admin */}
      <header style={{ background: primer, color: "white", padding: "1.5rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: "0.8rem" }}>Panel Admin</p>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 600 }}>{komunitas?.nama}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {session?.user?.image && (
                <img src={session.user.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)" }} />
              )}
              <span style={{ fontSize: "0.875rem", opacity: 0.9 }}>{session?.user?.name}</span>
            </div>
            <button
              className="btn"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: "0.8rem" }}
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Menu Admin */}
      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>

          <Link href={`/${slug}/admin/posts`}>
            <div className="card" style={{ cursor: "pointer", borderLeft: `4px solid ${primer}` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📝</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Post & Artikel</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tulis dan kelola artikel komunitas</p>
            </div>
          </Link>

          <Link href={`/${slug}/admin/galeri`}>
            <div className="card" style={{ cursor: "pointer", borderLeft: `4px solid ${primer}` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🖼️</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Galeri Foto</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Upload dan kelola foto komunitas</p>
            </div>
          </Link>

          <Link href={`/${slug}/admin/video`}>
            <div className="card" style={{ cursor: "pointer", borderLeft: `4px solid ${primer}` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎥</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Video YouTube</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Tambahkan embed video YouTube</p>
            </div>
          </Link>

          <Link href={`/${slug}`} target="_blank">
            <div className="card" style={{ cursor: "pointer", borderLeft: `4px solid #6b7280` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🌐</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Lihat Halaman Publik</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Buka tampilan publik komunitas</p>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
