'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

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
  const { slug, teamId } = useParams<{ slug: string; teamId: string }>();
  const searchParams = useSearchParams();
  const weekId = searchParams.get('weekId');

  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<DeckPlayer[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDeckFull = deck.length >= 5;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setUserId(json?.[0]?.userId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!teamId || !userId || !weekId) return;
      console.log('[DEBUG] teamId:', teamId, 'userId:', userId, 'weekId:', weekId);
 
    fetch(`/api/players/by-team/${teamId}?userId=${userId}&weekId=${weekId}`)
      .then(res => res.json())
      .then(setPlayers);
 }, [teamId, userId, weekId]);

  useEffect(() => {
   if (userId == null || weekId == null) return;

    fetch(`/api/deck/${userId}/${weekId}`)
      .then(res => res.json())
      .then(setDeck);
  }, [userId, weekId]);

  const isInDeck = (playerId: number) => deck.some(d => d.player.id === playerId);

  const handleRemove = async (playerId: number) => {
    setError(null);
    const res = await fetch('/api/deck/remove', {
      method: 'POST',
      body: JSON.stringify({ userId, playerId, weekId }),
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
      body: JSON.stringify({ userId, playerId, weekId }),
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
    <div className="p-6 space-y-6">
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

      {/* 🔽 Bloc Deck actuel */}
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
    </div>
  );
}
