// app/api/players/by-team/[teamId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // et PAS depuis generated


export async function GET(request: Request, { params }: { params: { teamId: string } }) {
  const players = await prisma.player.findMany({
    where: { team_id: Number(params.teamId) },
  });

  return NextResponse.json(players);
}
