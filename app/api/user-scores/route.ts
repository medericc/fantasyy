import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapte le chemin si besoin

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Optionnels : filtres userId, weekId, league
  const userId = searchParams.get("userId");
  const weekId = searchParams.get("weekId");
  const league = searchParams.get("league"); // "lfb" ou "lf2", optionnel

  let whereSql = "";
  if (userId) whereSql += ` AND c.user_id = ${Number(userId)} `;
  if (weekId) whereSql += ` AND c.week_id = ${Number(weekId)} `;
  if (league === "lfb") whereSql += " AND c.week_id < 22 ";
  if (league === "lf2") whereSql += " AND c.week_id >= 22 ";

  // Par défaut, on retourne les scores LFB
  if (!league) whereSql += " AND c.week_id < 22 ";

  const scores = await prisma.$queryRawUnsafe(`
    SELECT 
      u.id AS user_id,
      u.pseudo,
      c.week_id,
      SUM(pr.rate) AS pts
    FROM user u
    JOIN choice c ON c.user_id = u.id
    JOIN player_rate pr ON pr.player_id = c.player_id AND pr.week_id = c.week_id
    WHERE 1=1
      ${whereSql}
    GROUP BY u.id, c.week_id
    ORDER BY u.id, c.week_id
  `);

  return NextResponse.json(scores);
}