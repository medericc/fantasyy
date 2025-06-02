// app/api/deck/[userId]/[weekId]/route.ts
import { prisma } from '@/lib/prisma'; // et PAS depuis generated

import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { userId: string; weekId: string } }) {
  const choices = await prisma.choice.findMany({
    where: {
      user_id: Number(params.userId),
      week_id: Number(params.weekId),
    },
    include: { player: true },
  });

  return NextResponse.json(choices);
}
