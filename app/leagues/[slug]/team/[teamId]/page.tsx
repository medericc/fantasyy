'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
type Player = {
  id: number;
  name: string;
  forename: string;
  team_id: number;
  isLocked?: boolean;
};

type DeckPlayer = {
  player: {
    id: number;
    forename: string;
    name: string;
  };
};

export default function TeamPage() {
  const rawParams = useParams();
  const teamId = rawParams?.teamId ? String(rawParams.teamId) : null;
  const searchParams = useSearchParams();
  const weekId = searchParams.get('weekId');

  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<DeckPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isDeckFull = deck.length >= 5;

  useEffect(() => {
    const numericTeamId = teamId ? Number(teamId) : NaN;
    const numericWeekId = weekId ? Number(weekId) : NaN;

    if (isNaN(numericTeamId) || isNaN(numericWeekId)) {
      console.log('[DEBUG] Params pas prêts → teamId:', teamId, 'weekId:', weekId);
      return;
    }

    console.log('[DEBUG] Params OK → fetch des joueuses');
    fetch(`/api/players/by-team/${numericTeamId}?weekId=${numericWeekId}`)
      .then(res => res.json())
      .then(data => {
        console.log('[DEBUG] Players received:', data);
        setPlayers(data);
      });
  }, [teamId, weekId]);

  useEffect(() => {
    const numericWeekId = weekId ? Number(weekId) : NaN;
    if (isNaN(numericWeekId)) return;

    fetch(`/api/deck/${numericWeekId}`)
      .then(res => res.json())
      .then(setDeck);
  }, [weekId]);

  const isInDeck = (playerId: number) => deck.some(d => d.player.id === playerId);

  const handleRemove = async (playerId: number) => {
    setError(null);
    const res = await fetch('/api/deck/remove', {
      method: 'POST',
      body: JSON.stringify({ playerId, weekId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erreur suppression');
    } else {
      setDeck(prev => prev.filter(c => c.player.id !== playerId));
    }
  };

  const handleAdd = async (playerId: number) => {
    setError(null);
    const res = await fetch('/api/deck/add', {
      method: 'POST',
      body: JSON.stringify({ playerId, weekId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erreur');
    } else {
      const newChoice = await res.json();
      setDeck(prev => [...prev, newChoice]);
    }
  };

  return (
    <div>
    <Header />
    <div className="p-6 space-y-6">
      {!weekId ? (
        <div className="text-gray-600 italic">Chargement…</div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold">Équipe #{teamId}</h1>
            <h2 className="text-lg text-gray-600">Semaine {weekId}</h2>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div>
            <h3 className="text-xl font-semibold mb-2">Joueuses de l'équipe</h3>
            <ul className="space-y-2">
              {players.map(p => (
                <li
                  key={p.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{p.forename} {p.name}</span>
                  {isInDeck(p.id) ? (
                    <span className="text-green-600 font-semibold">✅ Ajouté</span>
                  ) : p.isLocked ? (
                    <span className="text-gray-500 italic">Indisponible</span>
                  ) : isDeckFull ? (
                    <span
                      className="text-gray-400 italic"
                      title="Limite de 5 joueuses atteinte"
                    >
                      Limite atteinte
                    </span>
                  ) : (
                    <button
                      disabled={isDeckFull}
                      className={`px-2 py-1 rounded text-white ${
                        isDeckFull
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600'
                      }`}
                      title={
                        isDeckFull
                          ? 'Limite de 5 joueuses atteinte'
                          : 'Ajouter la joueuse'
                      }
                      onClick={() => handleAdd(p.id)}
                    >
                      Ajouter
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">🃏 Mon deck de la semaine</h3>
            {deck.length === 0 ? (
              <p className="text-gray-500 italic">Aucune joueuse sélectionnée.</p>
            ) : (
              <ul className="space-y-2">
                {deck.map(({ player }) => (
                  <li
                    key={player.id}
                    className="flex justify-between items-center border p-2 rounded bg-gray-100"
                  >
                    <span>{player.forename} {player.name}</span>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleRemove(player.id)}
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div><Footer /> </div>
  );
}
