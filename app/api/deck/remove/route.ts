// app/api/deck/remove/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { userId, playerId, weekId } = await request.json();

  const deleted = await prisma.choice.deleteMany({
    where: {
      user_id: userId,
      player_id: playerId,
      week_id: weekId,
    },
  });

  return NextResponse.json({ deleted: deleted.count });
}
