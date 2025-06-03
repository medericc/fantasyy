// /api/week/list/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  const leagueId = slug?.toLowerCase() === 'lf2' ? 2 : 1;

  const weeks = await prisma.week.findMany({
    where: { league_id: leagueId },
    select: { id: true, name: true },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(weeks); // [{ id: 1, name: 'Semaine 1' }, ...]
}
