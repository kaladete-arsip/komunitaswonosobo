// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

// Ambil session user saat ini
export async function getSession() {
  return await getServerSession(authOptions);
}

// Cek apakah user yang login adalah admin dari komunitas tertentu
export async function isAdminOf(komunitasSlug: string): Promise<boolean> {
  const session = await getSession();
  if (!session?.user?.email) return false;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      adminOf: {
        where: { komunitasSlug },
      },
    },
  });

  return (user?.adminOf?.length ?? 0) > 0;
}

// Middleware helper: redirect kalau bukan admin
export async function requireAdmin(komunitasSlug: string) {
  const ok = await isAdminOf(komunitasSlug);
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}
