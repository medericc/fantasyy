// app/api/games/by-week/[weekId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: { weekId: string } }
) {
  const weekId = Number(context.params.weekId);

  if (isNaN(weekId)) {
    return NextResponse.json({ error: 'Invalid weekId' }, { status: 400 });
  }

  const games = await prisma.game.findMany({
    where: { week_id: weekId },
    include: {
      team_home: true,
      team_away: true,
    },
  });

  return NextResponse.json(games);
}
