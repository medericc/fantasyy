// lib/auth.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export async function getCurrentUserId(): Promise<number> {
  const user = await currentUser();
  if (!user || !user.id) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerk_id: user.id },
  });

  if (!dbUser) throw new Error("User not found in DB");

  return dbUser.id; // l’ID de ta table `user`, pas Clerk
}
