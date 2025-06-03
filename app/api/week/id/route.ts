import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const name = searchParams.get('name');

    if (!slug || !name) {
      return NextResponse.json({ error: 'Missing slug or name' }, { status: 400 });
    }

    const leagueId = slug.toLowerCase() === 'lf2' ? 2 : 1; // À adapter si tu gères plus de ligues

    const week = await prisma.week.findFirst({
      where: {
        name,
        league_id: leagueId,
      },
      select: {
        id: true,
      },
    });

    if (!week) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }

    return NextResponse.json({ id: week.id });
  } catch (error) {
    console.error('Error in /api/week/id:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
