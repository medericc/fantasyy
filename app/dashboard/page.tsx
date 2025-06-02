'use client';

import { useEffect, useState } from 'react';

type LeagueRanking = {
  league: string;
  week: string;
  weekIndex: number;
  weekPoints: number;
  totalIndex: number;
  totalPoints: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<LeagueRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-4">Chargement du classement...</p>;

  return (
    <div className="p-4 space-y-6">
      {data.map((info) => (
        <div key={info.league} className="border rounded p-4 shadow">
          <h2 className="text-xl font-bold">{info.league}</h2>
          <p>Semaine : {info.week}</p>
          <p>Classement de la semaine : {info.weekIndex}ᵉ avec {info.weekPoints} pts</p>
          <p>Classement total : {info.totalIndex}ᵉ avec {info.totalPoints} pts</p>
        </div>
      ))}
    </div>
  );
}
