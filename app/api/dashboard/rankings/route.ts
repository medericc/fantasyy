// app/api/dashboard/rankings/route.ts
import { NextResponse } from 'next/server';
import { getTotalRanking, getWeeklyRanking } from '@/lib/ranking_total'; // à adapter
import { prisma } from '@/lib/prisma';


export async function GET() {
  const leagues = ['LFB', 'LF2'];

  const result: Record<string, any> = {};

  for (const [i, leagueName] of leagues.entries()) {
    const leagueId = i + 1;

    // Toutes les semaines avec des stats dans cette ligue
    const weeks = await prisma.week.findMany({
      where: {
        league_id: leagueId,
        player_rate: { some: {} },
      },
      orderBy: { id: 'asc' },
    });

    const weekly: Record<string, any[]> = {};

    for (const week of weeks) {
      const ranking = await getWeeklyRanking(leagueId, week.id);
      weekly[week.name] = ranking.map((r, index) => ({
        username: r.pseudo,
        week: week.name,
        weekIndex: index + 1,
        weekPoints: r.points,
        totalIndex: 0,
        totalPoints: 0,
      }));
    }

    const total = await getTotalRanking(leagueId);
    const totalFormatted = total.map((r, index) => ({
      username: r.pseudo,
      week: '',
      weekIndex: 0,
      weekPoints: 0,
      totalIndex: index + 1,
      totalPoints: r.points,
    }));

    result[leagueName] = {
      weekly,
      total: totalFormatted,
    };
  }

  return NextResponse.json(result);
}
