// app/api/admin/update-player-rate/route.ts
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { playerId, weekId, rate } = await request.json();

    if (!playerId || !weekId || rate === undefined) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1️⃣ Met à jour ou crée la note du joueur pour la semaine
    await prisma.player_rate.upsert({
      where: { player_id_week_id: { player_id: playerId, week_id: weekId } },
      update: { rate },
      create: { player_id: playerId, week_id: weekId, rate },
    });

    // 2️⃣ Met à jour toutes les lignes choice correspondantes
    await prisma.choice.updateMany({
      where: { player_id: playerId, week_id: weekId },
      data: { points: rate },
    });

    // 3️⃣ Recalcule les points totaux pour tous les users
    const allUsers = await prisma.user.findMany({ select: { id: true } });

    for (const user of allUsers) {
      const totalPoints = await prisma.choice.aggregate({
        where: { user_id: user.id },
        _sum: { points: true },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { ptl_lfb: totalPoints._sum.points || 0 },
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
