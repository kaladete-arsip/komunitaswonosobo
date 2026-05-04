"use client";
// src/app/[slug]/admin/posts/page.tsx
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  _id: string;
  judul: string;
  slug: { current: string };
  ringkasan?: string;
  publishedAt: string;
}

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ judul: "", ringkasan: "", konten: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${slug}/admin`);
    if (status === "authenticated") loadPosts();
  }, [status]);

  async function loadPosts() {
    const res = await fetch(`/api/admin/post?slug=${slug}`);
    if (res.ok) {
      setPosts(await res.json());
    }
    setLoading(false);
  }

  async function handleSubmit() {
    if (!form.judul.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/admin/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        judul: form.judul,
        ringkasan: form.ringkasan,
        konten: form.konten
          ? [{ _type: "block", _key: "1", children: [{ _type: "span", text: form.konten }], markDefs: [], style: "normal" }]
          : [],
      }),
    });
    if (res.ok) {
      setForm({ judul: "", ringkasan: "", konten: "" });
      setShowForm(false);
      loadPosts();
    }
    setSubmitting(false);
  }

  async function handleDelete(postId: string) {
    if (!confirm("Hapus post ini?")) return;
    await fetch("/api/admin/post", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, postId }),
    });
    loadPosts();
  }

  return (
    <main>
      <header style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href={`/${slug}/admin`} style={{ color: "#6b7280", fontSize: "0.875rem" }}>← Dashboard</Link>
            <h1 style={{ fontWeight: 600 }}>Post & Artikel</h1>
          </div>
          <button className="btn btn-primary" style={{ background: "#16a34a" }} onClick={() => setShowForm(!showForm)}>
            + Post Baru
          </button>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>

        {/* Form tambah post */}
        {showForm && (
          <div className="card" style={{ marginBottom: "2rem", borderTop: "3px solid #16a34a" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "1rem" }}>Tulis Post Baru</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Judul *</label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Judul artikel..."
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.95rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Ringkasan</label>
                <textarea
                  value={form.ringkasan}
                  onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                  placeholder="Ringkasan singkat..."
                  rows={2}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem", resize: "vertical" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>Konten</label>
                <textarea
                  value={form.konten}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  placeholder="Tulis isi artikel di sini..."
                  rows={8}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "0.875rem", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ background: "#16a34a" }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Menyimpan..." : "Publish"}
                </button>
                <button className="btn btn-outline" style={{ borderColor: "#d1d5db", color: "#6b7280" }} onClick={() => setShowForm(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daftar post */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Memuat...</p>
        ) : posts.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p>Belum ada post. Klik "+ Post Baru" untuk mulai menulis.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {posts.map((post) => (
              <div key={post._id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{post.judul}</h3>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <Link href={`/${slug}/post/${post.slug.current}`} target="_blank">
                    <button className="btn btn-outline" style={{ borderColor: "#d1d5db", color: "#374151", fontSize: "0.8rem" }}>Lihat</button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => handleDelete(post._id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
