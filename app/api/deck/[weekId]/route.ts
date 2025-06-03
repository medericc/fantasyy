// app/api/deck/[weekId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { weekId: string } }) {
  const userId = await getCurrentUserId();
  const weekId = Number(params.weekId);

  if (!userId || isNaN(weekId)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const choices = await prisma.choice.findMany({
    where: {
      user_id: userId,
      week_id: weekId,
    },
    include: {
      player: {
        include: {
          player_rate: {
            where: { week_id: weekId },
            select: { rate: true },
          },
        },
      },
    },
  });

  return NextResponse.json(choices);
}
