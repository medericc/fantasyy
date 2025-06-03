'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Team = { id: number; name: string };
type Match = { id: number; date: string; team_home: Team; team_away: Team };
type Player = {
  id: number;
  name: string;
  team: string;
  player_rate: { rate: number }[];
};
type Choice = { player: Player };
type Week = { id: number; name: string };

export default function LeaguePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [deck, setDeck] = useState<Choice[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [weekId, setWeekId] = useState<number | null>(null);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setUserId(json?.[0]?.userId ?? null);
    };
    fetchUser();
  }, []);

  // Fetch weeks
  useEffect(() => {
    const fetchWeeks = async () => {
      
      const res = await fetch(`/api/week/list?slug=${slug}`);
      const json = await res.json();
      setWeeks(json);
      setSelectedWeek(json?.[0] ?? null);
    };
    fetchWeeks();
  }, [slug]);

  // Fetch deck
  useEffect(() => {
    if (!userId || !selectedWeek) return;
    const fetchDeck = async () => {
      try {
        const resWeekId = await fetch(`/api/week/id?slug=${slug}&name=${selectedWeek.name}`);
        const { id } = await resWeekId.json();
        setWeekId(id);
        
        // Ici tu pourrais fetch le deck avec ce weekId si nécessaire
      } catch (err) {
        console.error('Erreur fetchDeck:', err);
      }
    };
    fetchDeck();
  }, [userId, selectedWeek, slug]);

  // Fetch matches
  useEffect(() => {
    if (!selectedWeek) return;
    const fetchMatches = async () => {
      const resWeekId = await fetch(`/api/week/id?slug=${slug}&name=${selectedWeek.name}`);
      const { id } = await resWeekId.json();
      setWeekId(id);
      const res = await fetch(`/api/games/by-week/${id}`);
      const data = await res.json();
      setMatches(data);
    };
    fetchMatches();
  }, [selectedWeek, slug]);
useEffect(() => {
  if (!userId || !weekId) return;

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/deck/${userId}/${weekId}`);
      if (!res.ok) throw new Error("Erreur lors du chargement du deck");

      const data = await res.json();
      setDeck(data); // ← ça remplit ton deck correctement
    } catch (err) {
      console.error("Erreur lors du fetch du deck:", err);
    }
  };

  fetchDeck();
}, [userId, weekId]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold uppercase">Ligue : {slug}</h1>

      <div>
        <label className="mr-2">Semaine :</label>
        <select
          value={selectedWeek?.id || ''}
          onChange={(e) => {
            const id = parseInt(e.target.value, 10);
            const chosen = weeks.find((w) => w.id === id);
            setSelectedWeek(chosen ?? null);
          }}
          className="border rounded px-2 py-1"
        >
          {weeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun match prévu.</p>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  router.push(
                    `/leagues/${slug}/team/${match.team_home.id}?weekId=${selectedWeek?.id}`
                  )
                }
              >
                {match.team_home.name}
              </span>
              <span className="font-semibold text-gray-600">vs</span>
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  router.push(
                    `/leagues/${slug}/team/${match.team_away.id}?weekId=${selectedWeek?.id}`
                  )
                }
              >
                {match.team_away.name}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 border rounded shadow">
        <h2 className="text-lg font-bold mb-2">
          Ton deck – semaine {selectedWeek?.name}
        </h2>

        {deck.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune joueuse sélectionnée.</p>
        ) : (
          <ul className="space-y-1">
            {deck.map(({ player }) => (
              <li
                key={player.id}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{player.name}</span>
                <span className="text-gray-600">{player.team}</span>
                <span className="text-green-700">
                  {typeof player.player_rate?.[0]?.rate === 'number'
                    ? `${player.player_rate[0].rate} pts`
                    : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
