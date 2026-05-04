"use client";
// src/app/[slug]/admin/galeri/page.tsx
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface GaleriItem {
  _id: string;
  blobUrl: string;
  caption?: string;
}

export default function AdminGaleriPage() {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const fileRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${slug}/admin`);
    if (status === "authenticated") loadGaleri();
  }, [status]);

  async function loadGaleri() {
    const res = await fetch(`/api/admin/galeri?slug=${slug}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("caption", caption);
    fd.append("foto", selectedFile);

    const res = await fetch("/api/admin/galeri", { method: "POST", body: fd });
    if (res.ok) {
      setCaption("");
      setPreview(null);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
      loadGaleri();
    }
    setUploading(false);
  }

  async function handleDelete(id: string, blobUrl: string) {
    if (!confirm("Hapus foto ini?")) return;
    await fetch("/api/admin/galeri", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, sanityId: id, blobUrl }),
    });
    loadGaleri();
  }

  return (
    <main>
      <header style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href={`/${slug}/admin`} style={{ color: "#6b7280", fontSize: "0.875rem" }}>← Dashboard</Link>
          <h1 style={{ fontWeight: 600 }}>Galeri Foto</h1>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>

        {/* Upload area */}
        <div className="card" style={{ marginBottom: "2rem", borderTop: "3px solid #16a34a" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Upload Foto Baru</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                border: "2px dashed #d1d5db", borderRadius: 8, padding: "2rem",
                textAlign: "center", cursor: "pointer", background: "#f9fafb"
              }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 6, margin: "0 auto" }} />
              ) : (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📷</div>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Klik untuk pilih foto</p>
                  <p style={{ color: "#9ca3af", fontSize: "0.75rem" }}>JPG, PNG, WEBP — maks 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption foto (opsional)"
              style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem" }}
            />
            <button
              className="btn btn-primary"
              style={{ background: "#16a34a", alignSelf: "flex-start" }}
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Mengupload..." : "Upload Foto"}
            </button>
          </div>
        </div>

        {/* Grid foto */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Memuat...</p>
        ) : items.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p>Belum ada foto. Upload foto pertama komunitas kamu!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {items.map((item) => (
              <div key={item._id} style={{ position: "relative", group: true } as any}>
                <img
                  src={item.blobUrl}
                  alt={item.caption || ""}
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }}
                />
                {item.caption && (
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>{item.caption}</p>
                )}
                <button
                  onClick={() => handleDelete(item._id, item.blobUrl)}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(239,68,68,0.9)", color: "white",
                    border: "none", borderRadius: 4, padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem", cursor: "pointer"
                  }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
