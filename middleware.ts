// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Daftar domain utama yang dikenali
  const rootDomains = [
    "komunitaswonosobo.org",
    "www.komunitaswonosobo.org",
    "localhost:3000",
  ];

  const isRootDomain = rootDomains.some((d) => hostname === d);

  // Kalau akses dari root domain → jalan normal
  if (isRootDomain) {
    return NextResponse.next();
  }

  // Deteksi subdomain
  // Contoh: "komunitasa.komunitaswonosobo.org" → slug = "komunitasa"
  // Contoh: "komunitasa.localhost:3000" → slug = "komunitasa"
  const subdomain = hostname
    .replace(".komunitaswonosobo.org", "")
    .replace(".localhost:3000", "")
    .replace(".localhost", "");

  // Kalau ada subdomain yang valid (bukan www)
  if (subdomain && subdomain !== "www" && subdomain !== hostname) {
    // Rewrite URL ke /[slug]/... tapi tetap tampilkan subdomain di browser
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan middleware di semua route kecuali _next, api/auth, dan file statis
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
