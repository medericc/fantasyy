// app/api/players/by-team/[teamId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get('userId'));
  const currentWeek = Number(url.searchParams.get('weekId'));
console.log('[API] teamId:', params.teamId, 'userId:', userId, 'weekId:', currentWeek);

  if (!userId || !currentWeek) {
    return NextResponse.json({ error: 'userId and weekId are required' }, { status: 400 });
  }

  const players = await prisma.player.findMany({
    where: { team_id: Number(params.teamId) },
  });
 console.log('[API] Players fetched:', players.length);
  // Toutes les joueuses que cet user a utilisées avant cette semaine
  const lockedPlayers = await prisma.choice.findMany({
    where: {
      user_id: userId,
      week_id: { lt: currentWeek }, // utilisé pour une semaine précédente
    },
    select: {
      player_id: true,
    },
    distinct: ['player_id'], // éviter les doublons
  });

  const lockedIds = lockedPlayers.map(p => p.player_id);

  const playersWithLock = players.map(player => ({
    ...player,
    isLocked: lockedIds.includes(player.id),
  }));

  return NextResponse.json(playersWithLock);
}
