import { prisma } from '@/lib/prisma';

export async function getWeeklyRanking(leagueId: number, weekId: number) {
  const choices = await prisma.choice.findMany({
    where: {
      week_id: weekId,
      week: {
        league_id: leagueId,
      },
    },
    select: {
      user_id: true,
      user: {
        select: {
          pseudo: true,
        },
      },
      player: {
        select: {
          player_rate: {
            where: {
              week_id: weekId,
            },
            select: {
              rate: true,
            },
          },
        },
      },
    },
  });

  const userPointsMap = new Map<number, { pseudo: string, total: number }>();

  for (const choice of choices) {
    const userId = choice.user_id;
    const pseudo = choice.user?.pseudo ?? 'Anonyme';
    const rates = choice.player.player_rate.map(r => r.rate);
    const total = rates.reduce((sum, rate) => sum + rate, 0);

    if (!userPointsMap.has(userId)) {
      userPointsMap.set(userId, { pseudo, total });
    } else {
      userPointsMap.get(userId)!.total += total;
    }
  }

  const ranking = Array.from(userPointsMap.entries())
    .map(([userId, { pseudo, total }]) => ({
      userId,
      pseudo,
      points: total,
    }))
    .sort((a, b) => b.points - a.points);

  return ranking;
}
export async function getTotalRanking(leagueId: number) {
  const choices = await prisma.choice.findMany({
    where: {
      week: {
        league_id: leagueId,
      },
    },
    select: {
      user_id: true,
      user: {
        select: {
          pseudo: true,
        },
      },
      player: {
        select: {
          player_rate: {
            where: {
              week: {
                league_id: leagueId,
              },
            },
            select: {
              rate: true,
            },
          },
        },
      },
    },
  });

  const userPointsMap = new Map<number, { pseudo: string, total: number }>();

  for (const choice of choices) {
    const userId = choice.user_id;
    const pseudo = choice.user?.pseudo ?? 'Anonyme';
    const rates = choice.player.player_rate.map(r => r.rate);
    const total = rates.reduce((sum, rate) => sum + rate, 0);

    if (!userPointsMap.has(userId)) {
      userPointsMap.set(userId, { pseudo, total });
    } else {
      userPointsMap.get(userId)!.total += total;
    }
  }

  const ranking = Array.from(userPointsMap.entries())
    .map(([userId, { pseudo, total }]) => ({
      userId,
      pseudo,
      points: total,
    }))
    .sort((a, b) => b.points - a.points);

  return ranking;
}
