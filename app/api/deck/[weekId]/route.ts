import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: { weekId: string } }
) {
  const userId = await getCurrentUserId();
  const weekId = Number(context.params.weekId);

  console.log("🔍 API /deck - userId:", userId, "weekId reçu:", weekId);

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
