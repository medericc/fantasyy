// app/api/deck/remove/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  const { playerId, weekId } = await request.json();

  if (!userId || !playerId || !weekId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const deleted = await prisma.choice.deleteMany({
    where: {
      user_id: userId,
      player_id: playerId,
      week_id: weekId,
    },
  });

  return NextResponse.json({ deleted: deleted.count });
}
