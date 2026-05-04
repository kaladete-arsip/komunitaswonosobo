// src/app/[slug]/post/[postSlug]/page.tsx
import { readClient } from "../../../../../sanity/lib/client";
import { POST_DETAIL_QUERY } from "../../../../../sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string; postSlug: string };
}) {
  const post = await readClient.fetch(POST_DETAIL_QUERY, {
    slug: params.slug,
    postSlug: params.postSlug,
  });

  if (!post) notFound();

  const primer = post.komunitas?.warnaPrimer || "#16a34a";

  return (
    <main>
      <header style={{ background: primer, color: "white", padding: "2rem 0" }}>
        <div className="container">
          <Link href={`/${params.slug}`} style={{ opacity: 0.8, fontSize: "0.875rem" }}>
            ← {post.komunitas?.nama}
          </Link>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.75rem" }}>
            {post.judul}
          </h1>
          <p style={{ opacity: 0.8, fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {new Date(post.publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: 780 }}>
        {post.thumbnail?.blobUrl && (
          <img
            src={post.thumbnail.blobUrl}
            alt={post.judul}
            style={{ width: "100%", borderRadius: 12, marginBottom: "2rem", maxHeight: 400, objectFit: "cover" }}
          />
        )}

        {/* Render konten sebagai teks sederhana (untuk demo) */}
        <div style={{ lineHeight: 1.8, fontSize: "1.05rem" }}>
          {Array.isArray(post.konten) &&
            post.konten.map((block: any, i: number) => {
              if (block._type === "block") {
                return (
                  <p key={i} style={{ marginBottom: "1rem" }}>
                    {block.children?.map((c: any) => c.text).join("")}
                  </p>
                );
              }
              if (block._type === "image" && block.blobUrl) {
                return (
                  <figure key={i} style={{ margin: "1.5rem 0" }}>
                    <img src={block.blobUrl} alt={block.caption || ""} style={{ width: "100%", borderRadius: 8 }} />
                    {block.caption && (
                      <figcaption style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "0.5rem" }}>
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
        </div>
      </div>
    </main>
  );
}
