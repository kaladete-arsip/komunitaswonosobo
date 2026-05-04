// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "80vh", textAlign: "center",
      padding: "2rem"
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌿</div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>404</h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Halaman atau komunitas tidak ditemukan.
      </p>
      <Link href="/" style={{
        background: "#16a34a", color: "white",
        padding: "0.6rem 1.5rem", borderRadius: 6, fontWeight: 500
      }}>
        Kembali ke Direktori
      </Link>
    </div>
  );
}
