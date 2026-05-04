// sanity/schemas/post.ts
import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Post / Artikel",
  type: "document",
  fields: [
    defineField({
      name: "judul",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "judul" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "komunitas",
      title: "Komunitas",
      type: "reference",
      to: [{ type: "komunitas" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ringkasan",
      title: "Ringkasan",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "object",
      fields: [
        { name: "blobUrl", title: "URL (Vercel Blob)", type: "url" },
      ],
    }),
    defineField({
      name: "konten",
      title: "Konten",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [
            { name: "caption", title: "Caption", type: "string" },
            { name: "blobUrl", title: "URL (Vercel Blob)", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal Publish",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Terbaru",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});

// sanity/schemas/galeri.ts
export const galeriSchema = defineType({
  name: "galeri",
  title: "Galeri Foto",
  type: "document",
  fields: [
    defineField({
      name: "komunitas",
      title: "Komunitas",
      type: "reference",
      to: [{ type: "komunitas" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "blobUrl",
      title: "URL Foto (Vercel Blob)",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

// sanity/schemas/video.ts
export const videoSchema = defineType({
  name: "video",
  title: "Video YouTube",
  type: "document",
  fields: [
    defineField({
      name: "komunitas",
      title: "Komunitas",
      type: "reference",
      to: [{ type: "komunitas" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "judul",
      title: "Judul Video",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deskripsi",
      title: "Deskripsi",
      type: "text",
    }),
    defineField({
      name: "youtubeUrl",
      title: "Link YouTube",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
