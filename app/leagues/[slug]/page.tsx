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
  
  const [deck, setDeck] = useState<Choice[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);


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



  // Fetch matches
useEffect(() => {
  if (!selectedWeek) return;

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/games/by-week/${selectedWeek.id}`);
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Erreur fetch matches:", err);
    }
  };

  fetchMatches();
}, [selectedWeek]);

useEffect(() => {
  if (!selectedWeek) return;

  const fetchDeck = async () => {
    try {
      const res = await fetch(`/api/deck/${selectedWeek.id}`);
      if (!res.ok) throw new Error("Erreur lors du chargement du deck");

      const data = await res.json();
      setDeck(data);
    } catch (err) {
      console.error("Erreur lors du fetch du deck:", err);
    }
  };

  fetchDeck();
}, [selectedWeek]);



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
