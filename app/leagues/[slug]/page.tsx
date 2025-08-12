'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [highlightWeekId, setHighlightWeekId] = useState<number | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [deck, setDeck] = useState<Choice[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Charger depuis localStorage
  useEffect(() => {
    const savedWeekId = localStorage.getItem(`selectedWeek-${slug}`);
    if (savedWeekId && weeks.length > 0) {
      const chosen = weeks.find(w => w.id === Number(savedWeekId));
      if (chosen) setSelectedWeek(chosen);
    }
  }, [weeks, slug]);

  // Sauvegarder quand on change
  useEffect(() => {
    if (selectedWeek) {
      localStorage.setItem(`selectedWeek-${slug}`, String(selectedWeek.id));
    }
  }, [selectedWeek, slug]);

  // Fetch weeks
  useEffect(() => {
    const fetchWeeks = async () => {
      const res = await fetch(`/api/week/list?slug=${slug}`);
      const json: Week[] = await res.json();
      setWeeks(json);

      const savedWeekId = localStorage.getItem(`selectedWeek-${slug}`);
      if (savedWeekId) {
        const chosen = json.find((w) => w.id === Number(savedWeekId));
        if (chosen) {
          setSelectedWeek(chosen);
          return;
        }
      }

      const now = new Date();
      let closestWeek: Week | null = null;
      
      for (const week of json) {
        const resMatches = await fetch(`/api/games/by-week/${week.id}`);
        const matches = await resMatches.json();

        if (matches.length > 0) {
          const firstMatchDate = new Date(matches[0].date);
          if (firstMatchDate >= now) {
            closestWeek = week;
            setHighlightWeekId(week.id);
            break;
          }
        }
      }

      setSelectedWeek(closestWeek ?? json[0] ?? null);
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
// mapping des logos
const teamLogos: Record<string, string> = {
  "UF Angers": "/angers.webp",
  "Lyon ASVEL": "/asvel.webp",
  "Tango Bourges": "/bourges.webp",
  "Charnay BBS": "/charnay.webp",
  "ESBVA Lille": "/esbva.webp",
  "Landerneau BB": "/landerneau.webp",
  "Basket Landes": "/landes.webp",
  "Lattes-Montpellier": "/lattes.webp",
  "Roche Vendée": "/roche.webp",
  "Toulouse MB": "/toulouse.webp",
  "Charleville": "/flammes.webp",
  "Chartres BL": "/chartres.webp",
};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
      
        {/* Sélecteur de semaine */}
        <div className="space-y-2">
         <Select
            value={selectedWeek?.id?.toString() || ''}
            onValueChange={(value) => {
              const id = parseInt(value, 10);
              const chosen = weeks.find((w) => w.id === id);
              setSelectedWeek(chosen ?? null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une semaine" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week) => (
                <SelectItem 
                  key={week.id} 
                  value={week.id.toString()}
                  className={week.id === highlightWeekId ? "bg-yellow-50" : ""}
                >
                 Journée {week.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste des matchs */}
        <div className="space-y-3">
        
          {matches.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun match prévu cette semaine
            </p>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <Card key={match.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-1 grid grid-cols-3 items-center">
                  <Button 
  variant="link" 
  className="justify-end"
  onClick={() => router.push(`/leagues/${slug}/team/${match.team_home.id}?weekId=${selectedWeek?.id}`)}
>
  <img
    src={teamLogos[match.team_home.name] || "/Logo_LBWL.png"}
    alt={match.team_home.name}
    className="h-8 w-auto"
  />
</Button>

                    
                    <div className="text-center">
                      <Badge variant="outline" className="px-3 py-1">
                        VS
                      </Badge>
                    </div>
                    
                  <Button 
  variant="link" 
  className="justify-start"
  onClick={() => router.push(`/leagues/${slug}/team/${match.team_away.id}?weekId=${selectedWeek?.id}`)}
>
  <img
    src={teamLogos[match.team_away.name] || "/Logo_LBWL.png"}
    alt={match.team_away.name}
    className="h-8 w-auto"
  />
</Button>

                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Deck */}
        <div className="mt-6 p-4 bg-gray-50 border rounded shadow">
        <h2 className="text-lg text-center font-bold mb-2">
          Ton Deck 
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
      </div> </main>
      
      <Footer />
    </div>
  );
}