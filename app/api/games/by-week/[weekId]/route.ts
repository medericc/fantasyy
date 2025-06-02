// app/api/games/by-week/[weekId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { weekId: string } }) {
  const games = await prisma.game.findMany({
    where: { week_id: Number(params.weekId) },
    include: {
      team_home: true,
      team_away: true,
    },
  });

  return NextResponse.json(games);
}
