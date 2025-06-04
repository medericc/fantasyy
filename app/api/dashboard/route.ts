// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth'; // à adapter selon ton auth
import { getTotalRanking, getWeeklyRanking } from '@/lib/ranking_total'; // à adapter
import { prisma } from '@/lib/prisma';

export async function GET() {
  const userId = await getCurrentUserId(); // Clerk ou session
 console.log("User ID récupéré :", userId);
  const leagues = ['LFB', 'LF2'];

  const results = await Promise.all(
    leagues.map(async (leagueName, i) => {
      const leagueId = i + 1;

      const latestWeek = await prisma.week.findFirst({
        where: {
          league_id: leagueId,
          player_rate: { some: {} },
        },
        orderBy: { id: 'desc' },
      });

      const fallbackWeek = await prisma.week.findFirst({
        where: { league_id: leagueId },
        orderBy: { id: 'asc' },
      });

      const weekToUse = latestWeek ?? fallbackWeek;
      if (!weekToUse) return null;

      const weekRanking = await getWeeklyRanking(leagueId, weekToUse.id);
      const totalRanking = await getTotalRanking(leagueId);

      const weekIndex = weekRanking.findIndex(u => u.userId === userId) + 1;
      const totalIndex = totalRanking.findIndex(u => u.userId === userId) + 1;

      const weekPoints = weekRanking.find(u => u.userId === userId)?.points ?? 0;
      const totalPoints = totalRanking.find(u => u.userId === userId)?.points ?? 0;

      return {
        league: leagueName,
        week: weekToUse.name,
        weekIndex,
        weekPoints,
        totalIndex,
        totalPoints,
      };
    })
  );

  const filteredResults = results.filter(Boolean);

  return NextResponse.json(filteredResults);
}
