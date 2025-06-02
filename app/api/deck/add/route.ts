// app/api/deck/add/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // et PAS depuis generated


export async function POST(request: Request) {
  const { userId, playerId, weekId } = await request.json();

  // Vérifier si déjà choisie dans les 5 dernières semaines
  const blocked = await prisma.choice.findFirst({
    where: {
      user_id: userId,
      player_id: playerId,
      week: {
        id: {
          gte: weekId - 5, // ajuster selon le format réel des semaines
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
  });

  return NextResponse.json(choice);
}
