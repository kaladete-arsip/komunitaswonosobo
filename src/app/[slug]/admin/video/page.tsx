"use client";
// src/app/[slug]/admin/video/page.tsx
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

interface Video {
  _id: string;
  judul: string;
  deskripsi?: string;
  youtubeUrl: string;
}

export default function AdminVideoPage() {
  const { status } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ judul: "", deskripsi: "", youtubeUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${slug}/admin`);
    if (status === "authenticated") loadVideos();
  }, [status]);

  async function loadVideos() {
    const res = await fetch(`/api/admin/video?slug=${slug}`);
    if (res.ok) setVideos(await res.json());
    setLoading(false);
  }

  function handleUrlChange(url: string) {
    setForm({ ...form, youtubeUrl: url });
    const embed = getYoutubeEmbedUrl(url);
    setPreviewUrl(embed);
  }

  async function handleSubmit() {
    if (!form.judul.trim() || !form.youtubeUrl.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/admin/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...form }),
    });
    if (res.ok) {
      setForm({ judul: "", deskripsi: "", youtubeUrl: "" });
      setPreviewUrl(null);
      setShowForm(false);
      loadVideos();
    } else {
      const data = await res.json();
      alert(data.error || "Gagal menambahkan video");
    }
    setSubmitting(false);
  }

  async function handleDelete(videoId: string) {
    if (!confirm("Hapus video ini?")) return;
    await fetch("/api/admin/video", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, videoId }),
    });
    loadVideos();
  }

  return (
    <main>
      <header style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href={`/${slug}/admin`} style={{ color: "#6b7280", fontSize: "0.875rem" }}>← Dashboard</Link>
            <h1 style={{ fontWeight: 600 }}>Video YouTube</h1>
          </div>
          <button className="btn btn-primary" style={{ background: "#16a34a" }} onClick={() => setShowForm(!showForm)}>
            + Tambah Video
          </button>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>

        {showForm && (
          <div className="card" style={{ marginBottom: "2rem", borderTop: "3px solid #16a34a" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Tambah Video Baru</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Link YouTube *</label>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem" }}
                />
                {form.youtubeUrl && !previewUrl && (
                  <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.25rem" }}>URL YouTube tidak valid</p>
                )}
              </div>

              {previewUrl && (
                <div style={{ position: "relative", paddingBottom: "40%", borderRadius: 8, overflow: "hidden" }}>
                  <iframe
                    src={previewUrl}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allowFullScreen
                    title="preview"
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Judul *</label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Judul video..."
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Deskripsi singkat video..."
                  rows={2}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ background: "#16a34a" }}
                  onClick={handleSubmit}
                  disabled={submitting || !previewUrl}
                >
                  {submitting ? "Menyimpan..." : "Tambahkan"}
                </button>
                <button className="btn btn-outline" style={{ borderColor: "#d1d5db", color: "#6b7280" }} onClick={() => setShowForm(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: "#6b7280" }}>Memuat...</p>
        ) : videos.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p>Belum ada video. Tambahkan video YouTube pertama!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {videos.map((video) => {
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{video.judul}</h3>
                      {video.deskripsi && (
                        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{video.deskripsi}</p>
                      )}
                    </div>
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: "0.75rem", flexShrink: 0 }}
                      onClick={() => handleDelete(video._id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
