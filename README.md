# 🌿 Jaya Sanga Nusantara — Platform Komunitas

Platform web multi-tenant untuk komunitas dan yayasan di bawah naungan **Jaya Sanga Nusantara**.  
Satu codebase → ratusan web profil, masing-masing dengan subdomain, panel admin, dan konten sendiri.

```
komunitaswonosobo.org                     →  direktori semua komunitas
komunitasa.komunitaswonosobo.org          →  halaman publik komunitas A
komunitasa.komunitaswonosobo.org/admin    →  panel admin komunitas A (login Google)
komunitasb.komunitaswonosobo.org          →  halaman publik komunitas B
...dst
```

---

## 🏗️ Tech Stack

| Komponen | Tool | Fungsi | Biaya |
|---|---|---|---|
| Framework | Next.js 14 (App Router) | Frontend + API routes | Gratis |
| CMS Konten | Sanity.io | Struktur konten, post, galeri, video | Gratis |
| Database | Neon (PostgreSQL) | User, akses admin, activity log | Gratis |
| ORM | Prisma | Akses database dari Next.js | Gratis |
| Auth | NextAuth.js + Google OAuth | Login Google per komunitas | Gratis |
| File Storage | Vercel Blob | Upload foto, logo, thumbnail | Gratis (5GB) |
| Deploy | Vercel | Hosting + wildcard subdomain | Pro ($20/bln) |
| Repo | GitHub | Source control | Gratis |
| Domain | komunitaswonosobo.org | — | ~Rp 150rb/thn |

---

## 🚀 Setup dari Nol

### Langkah 1 — Clone repo

```bash
git clone https://github.com/USERNAME/jayasanganusantara.git
cd jayasanganusantara
npm install
```

---

### Langkah 2 — Buat project Sanity

1. Buka [sanity.io](https://sanity.io) → Sign up gratis
2. Buat project baru → dataset: `production`
3. Catat **Project ID** (format: `abc12345`)

---

### Langkah 3 — Setup Neon (PostgreSQL)

1. Buka [neon.tech](https://neon.tech) → Sign up gratis
2. Buat project baru → catat **Connection String**  
   Format: `postgresql://user:password@host/dbname?sslmode=require`
3. Nanti diisi ke `.env.local` sebagai `DATABASE_URL`

---

### Langkah 4 — Setup Google OAuth

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project → **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth 2.0 Client ID** → Web application
4. Tambahkan Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://komunitaswonosobo.org/api/auth/callback/google
   ```
5. Catat **Client ID** dan **Client Secret**

---

### Langkah 5 — Setup Vercel Blob

1. Deploy project ke Vercel dulu (Langkah 8)
2. Di Vercel dashboard → **Storage** → **Create Blob Store**
3. Connect ke project → token otomatis ditambahkan sebagai env var `BLOB_READ_WRITE_TOKEN`

---

### Langkah 6 — Isi environment variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skXXXXXXXXXXXXXX
SANITY_REVALIDATE_SECRET=string-acak-bebas

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_SECRET=                  # generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

# Vercel Blob (otomatis diisi Vercel, isi manual untuk dev lokal)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxx
```

**Cara buat Sanity API Token:**
```
sanity.io/manage → pilih project → API → Tokens → Add API token
Nama: "Next.js App"   Role: Editor   → salin token
```

---

### Langkah 7 — Setup database & jalankan lokal

```bash
# Push schema Prisma ke Neon
npm run db:push

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

### Langkah 8 — Isi data komunitas pertama di Sanity Studio

```bash
# Studio lokal
npx sanity dev
# Buka http://localhost:3333

# Atau deploy studio ke cloud
npx sanity deploy
```

Di Sanity Studio, klik **"Komunitas / Yayasan"** → **"+ New"** → isi:
- Nama & slug (contoh: `komunitas-hijau`)
- Tagline, deskripsi, logo, warna
- **Admin Emails**: tambahkan email Google pengurus komunitas ini
- Kontak dan sosmed

Setelah save, buka: `http://localhost:3000/komunitas-hijau`

---

### Langkah 9 — Deploy ke Vercel

**A. Push ke GitHub:**
```bash
git add .
git commit -m "Initial commit: Jaya Sanga Nusantara"
git remote add origin https://github.com/USERNAME/jayasanganusantara.git
git push -u origin main
```

**B. Connect ke Vercel:**
1. [vercel.com](https://vercel.com) → **Add New Project** → pilih repo
2. **Environment Variables** → tambahkan semua isi `.env.local`
3. Ubah `NEXTAUTH_URL` → `https://komunitaswonosobo.org`
4. Klik **Deploy**

**C. Setup Vercel Blob** (setelah deploy pertama):
```
Vercel Dashboard → Storage → Create Database → Blob
→ Connect to project → jayasanganusantara
```

---

### Langkah 10 — Pasang domain & wildcard subdomain

**A. Tambahkan domain di Vercel:**
```
Vercel → Project → Settings → Domains
→ komunitaswonosobo.org
→ *.komunitaswonosobo.org    ← wildcard untuk semua komunitas
```

> ⚠️ Wildcard subdomain membutuhkan **Vercel Pro** ($20/bln).  
> Alternatif gratis: gunakan path → `komunitaswonosobo.org/[slug]`  
> (middleware sudah mendukung keduanya)

**B. DNS record di provider domain:**
```
Type: A    Name: @    Value: 76.76.21.21
Type: A    Name: *    Value: 76.76.21.21
```

Setelah propagasi DNS (~5–30 menit) semua subdomain komunitas langsung aktif.

---

### Langkah 11 — Setup Webhook Sanity (auto-update)

```
sanity.io/manage → project → API → Webhooks → Add Webhook

Name    : Vercel Revalidate
URL     : https://komunitaswonosobo.org/api/revalidate?secret=STRING_REVALIDATE_MU
Dataset : production
Trigger : Create, Update, Delete
→ Save
```

---

## 🔐 Sistem Panel Admin

Tiap komunitas punya panel admin di:
```
[slug].komunitaswonosobo.org/admin
```

### Alur Login
```
1. Pengurus buka /admin di subdomain mereka
2. Klik "Login dengan Google"
3. Google OAuth → verifikasi email
4. Sistem cek: apakah email terdaftar di komunitas ini? (Sanity adminEmails + Neon)
5. ✅ Akses diberikan → masuk dashboard admin
   ❌ Ditolak → tampil pesan error
```

### Daftarkan Admin Komunitas
Email pengurus didaftarkan oleh super admin di Sanity Studio:
```
Sanity Studio → Komunitas → [nama komunitas] → Admin Emails
→ + tambahkan email Google pengurus
→ Publish
```
Tidak perlu restart atau konfigurasi tambahan — langsung aktif.

---

## ✏️ Fitur Panel Admin

### 📝 Post / Artikel
- Tulis dan publish artikel langsung dari browser
- Judul, ringkasan, konten teks
- Langsung tampil di halaman publik tanpa moderasi

### 🖼️ Galeri Foto
- Upload foto dari perangkat
- Tersimpan di **Vercel Blob** (CDN global)
- URL referensi disimpan ke Sanity
- Bisa hapus foto (terhapus dari Blob dan Sanity)

### 🎥 Video YouTube
- Paste link YouTube (mendukung youtube.com dan youtu.be)
- Preview embed langsung saat mengisi form
- Tampil sebagai embed di halaman publik

---

## 📁 Struktur Project

```
jayasanganusantara/
├── prisma/
│   └── schema.prisma             ← Schema Neon: User, Session, KomunitasAdmin, ActivityLog
├── sanity/
│   ├── schemas/
│   │   ├── komunitas.ts          ← Profil komunitas + adminEmails
│   │   └── content.ts            ← Post, Galeri, Video schemas
│   └── lib/
│       ├── client.ts             ← Sanity read/write client
│       └── queries.ts            ← Semua GROQ queries
├── src/
│   ├── lib/
│   │   ├── prisma.ts             ← Prisma singleton
│   │   ├── auth.ts               ← Auth helpers + isAdminOf()
│   │   └── youtube.ts            ← YouTube URL parser
│   └── app/
│       ├── page.tsx              ← Direktori semua komunitas
│       ├── providers.tsx         ← SessionProvider wrapper
│       ├── layout.tsx            ← Root layout
│       ├── not-found.tsx         ← 404 page
│       ├── [slug]/
│       │   ├── page.tsx          ← Halaman publik komunitas
│       │   ├── post/[postSlug]/
│       │   │   └── page.tsx      ← Detail artikel
│       │   └── admin/
│       │       ├── page.tsx      ← Dashboard admin (Google OAuth)
│       │       ├── posts/page.tsx    ← Kelola artikel
│       │       ├── galeri/page.tsx   ← Kelola foto (upload ke Blob)
│       │       └── video/page.tsx    ← Kelola video YouTube
│       └── api/
│           ├── auth/[...nextauth]/route.ts   ← Google OAuth handler
│           ├── revalidate/route.ts           ← Sanity webhook
│           └── admin/
│               ├── check/route.ts    ← Verifikasi akses admin
│               ├── post/route.ts     ← CRUD post (Sanity)
│               ├── galeri/route.ts   ← Upload/hapus foto (Blob + Sanity)
│               └── video/route.ts    ← CRUD video (Sanity)
├── middleware.ts                 ← Subdomain routing
├── sanity.config.ts              ← Konfigurasi Sanity Studio
├── next.config.js
├── .env.local.example
└── README.md
```

---

## ➕ Onboard Komunitas Baru

```
1. Sanity Studio → New Komunitas / Yayasan
2. Isi: nama, slug, logo, warna, deskripsi, kontak
3. Di field "Admin Emails" → tambahkan email Google pengurus
4. Publish
5. Subdomain langsung aktif: [slug].komunitaswonosobo.org
6. Kirim link /admin ke pengurus → login pakai Google
7. Selesai 🎉
```

Total waktu per komunitas baru: **5–10 menit**

---

## 🗄️ Pembagian Tugas Storage

| Data | Disimpan di | Alasan |
|---|---|---|
| Profil komunitas, post, galeri ref, video ref | **Sanity** | CMS, mudah diedit via Studio |
| User accounts, session, akses admin | **Neon (PostgreSQL)** | Data relasional, dikelola Prisma |
| File foto, logo, thumbnail | **Vercel Blob** | CDN global, URL publik langsung |
| State aplikasi sementara | **Next.js** | — |

---

## 🚧 Roadmap Fitur

| Fitur | Prioritas | Status |
|---|---|---|
| Panel admin + Google OAuth | v1 | ✅ Done |
| Post / artikel | v1 | ✅ Done |
| Galeri foto (Vercel Blob) | v1 | ✅ Done |
| Embed video YouTube | v1 | ✅ Done |
| Multi-admin per komunitas | v1 | ✅ Done |
| Halaman event / jadwal kegiatan | v2 | 🔜 |
| Form kontak per komunitas | v2 | 🔜 |
| Statistik pengunjung per komunitas | v2 | 🔜 |
| SEO otomatis (meta per komunitas) | v2 | 🔜 |
| Donasi online (Midtrans/GoPay) | v3 | 🔜 |
| Pendaftaran anggota | v3 | 🔜 |
| Notifikasi email otomatis | v3 | 🔜 |

---

## 🔗 Link Penting

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Sanity.io](https://sanity.io) — [GROQ](https://www.sanity.io/docs/groq)
- [Neon — Serverless PostgreSQL](https://neon.tech)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js — Google Provider](https://next-auth.js.org/providers/google)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Google Cloud Console](https://console.cloud.google.com)

---

*Dibangun untuk komunitas dan yayasan Indonesia 🇮🇩*
