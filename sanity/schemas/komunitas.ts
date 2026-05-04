// sanity/schemas/komunitas.ts
import { defineField, defineType } from "sanity";

export const komunitasSchema = defineType({
  name: "komunitas",
  title: "Komunitas / Yayasan",
  type: "document",
  fields: [
    defineField({
      name: "nama",
      title: "Nama Komunitas",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (subdomain)",
      type: "slug",
      options: { source: "nama" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "deskripsi",
      title: "Deskripsi",
      type: "text",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "warnaPrimer",
      title: "Warna Primer (hex)",
      type: "string",
      initialValue: "#16a34a",
    }),
    defineField({
      name: "warnaAksen",
      title: "Warna Aksen (hex)",
      type: "string",
      initialValue: "#15803d",
    }),
    defineField({
      name: "adminEmails",
      title: "Email Admin (Google)",
      description: "Email Google yang diizinkan login sebagai admin komunitas ini",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "kontak",
      title: "Kontak",
      type: "object",
      fields: [
        { name: "email", title: "Email", type: "string" },
        { name: "telepon", title: "Telepon / WhatsApp", type: "string" },
        { name: "alamat", title: "Alamat", type: "text" },
      ],
    }),
    defineField({
      name: "sosmed",
      title: "Media Sosial",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "youtube", title: "YouTube Channel URL", type: "url" },
        { name: "tiktok", title: "TikTok URL", type: "url" },
      ],
    }),
  ],
});
