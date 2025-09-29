// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // utile en dev
  });

// 👉 Log de la DATABASE_URL masquée (mot de passe remplacé par ****)
if (process.env.DATABASE_URL) {
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL.replace(/:\/\/(.*):(.*)@/, "://$1:****@")
  );
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
