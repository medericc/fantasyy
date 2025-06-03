// app/api/deck/add/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  const { playerId, weekId } = await request.json();

  if (!userId || !playerId || !weekId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Vérifier si déjà choisie dans les 5 dernières semaines
  const blocked = await prisma.choice.findFirst({
    where: {
      user_id: userId,
      player_id: playerId,
      week: {
        id: {
          gte: weekId - 5,
          lt: weekId,
        },
      },
    },
  });

  if (blocked) {
    return NextResponse.json({ error: 'Player is blocked for 5 weeks.' }, { status: 403 });
  }

  // Vérifier si déjà 5 joueuses choisies cette semaine
  const count = await prisma.choice.count({
    where: {
      user_id: userId,
      week_id: weekId,
    },
  });

  if (count >= 5) {
    return NextResponse.json({ error: 'Maximum 5 players per week' }, { status: 400 });
  }

  const choice = await prisma.choice.create({
    data: {
      user_id: userId,
      player_id: playerId,
      week_id: weekId,
    },
    include: {
      player: true,
    },
  });

  return NextResponse.json(choice);
}
