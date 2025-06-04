import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { clerkId: string } }
) {
  const { params } = await context; // 👈 await context
  const { clerkId } = params;

  const user = await prisma.user.findUnique({
    where: { clerk_id: clerkId },
    select: { pseudo: true },
  });

  if (!user) {
    return NextResponse.json({ pseudo: null }, { status: 404 });
  }

  return NextResponse.json(user);
}