import { prisma } from '@/lib/prisma';

export async function getWeeklyRanking(weekId: number) {
  const choices = await prisma.choice.findMany({
    where: {
      week_id: weekId,
      week: {
        league_id: 1, // LFB uniquement
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

  const userPointsMap = new Map<number, { pseudo: string; total: number }>();

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

  return Array.from(userPointsMap.entries())
    .map(([userId, { pseudo, total }]) => ({
      userId,
      pseudo,
      points: total,
    }))
    .sort((a, b) => b.points - a.points);
}

export async function getTotalRanking() {
  const users = await prisma.user.findMany({
    select: {
      pseudo: true,
      ptl_lfb: true,
    },
    orderBy: { ptl_lfb: 'desc' },
    where: { ptl_lfb: { not: undefined } },
  });

  return users.map((user, index) => ({
    pseudo: user.pseudo ?? 'Anonyme',
    points: user.ptl_lfb ?? 0,
    userId: index + 1,
  }));
}
