'use client';
import { useEffect, useState } from 'react';
import PlayModal from '@/components/PlayModal'; // ajuste le chemin si besoin
import Header from '@/components/Header'; // ajuste si ton chemin est différent
import Footer from '@/components/Footer';

type LeagueRanking = {
  username: string;
  week: string;
  weekIndex: number;
  weekPoints: number;
  totalIndex: number;
  totalPoints: number;
};

type LeagueData = {
  [league: string]: {
    weekly: {
      [week: string]: LeagueRanking[];
    };
    total: LeagueRanking[];
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<LeagueData>({});
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<LeagueData>({});
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<{ [league: string]: string }>({});
  
const [openPlayModal, setOpenPlayModal] = useState(false);

  const [openModal, setOpenModal] = useState<null | {
    league: string;
    mode: 'weekly' | 'total';
    week?: string;
  }>(null);

useEffect(() => {
  const fetchAll = async () => {
    try {
      const [resUser, resRanking] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/dashboard/rankings'),
      ]);

      const userJson = await resUser.json();
      const rankingJson = await resRanking.json();

      setUser(userJson);
      setRankingData(rankingJson);
      setData(rankingJson);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  };

  fetchAll();
}, []);


  const weeks = (league: string) =>
    Object.keys(data[league]?.weekly || {}).sort();

 const renderTable = (rankings: LeagueRanking[], user?: { username: string } | null) => (
  <table className="w-full mt-4 border">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-2 text-left">#</th>
        <th className="p-2 text-left">Joueur</th>
        <th className="p-2 text-left">Points</th>
      </tr>
    </thead>
    <tbody>
      {rankings.map((r, i) => (
        <tr
          key={r.username}
          className={`border-t ${user?.username === r.username ? 'bg-yellow-100 font-bold' : ''}`}
        >
          <td className="p-2">{i + 1}</td>
          <td className="p-2">{r.username}</td>
          <td className="p-2">
            {openModal?.mode === 'weekly' ? r.weekPoints : r.totalPoints}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

  if (loading) return <p className="p-4">Chargement du classement...</p>;

  return (
    <div>
    <Header />
    <div className="p-4 space-y-6">
      {Object.keys(rankingData).map((league) => {
        const latestWeek = weeks(league).slice(-1)[0];
        const weekRankings =
          rankingData[league]?.weekly?.[latestWeek] || [];
        const totalRankings = rankingData[league]?.total || [];

        const userWeekly = weekRankings.find(
          (r) => r.username === user?.username
        );
        const userTotal = totalRankings.find(
          (r) => r.username === user?.username
        );

        return (
          <div
            key={league}
            className="border rounded p-4 shadow space-y-2"
          >
            <h2 className="text-xl font-bold">{league}</h2>

            {userWeekly && (
              <p className="text-sm text-gray-700">
                🏅 {userWeekly.weekIndex + 1}e semaine {latestWeek} –{' '}
                {userWeekly.weekPoints} pts
              </p>
            )}

            {userTotal && (
              <p className="text-sm text-gray-700">
                🏆 {userTotal.totalIndex + 1}e total –{' '}
                {userTotal.totalPoints} pts
              </p>
            )}

            <button
              onClick={() => {
  setOpenModal({
    league,
    mode: 'weekly',
    week: latestWeek,
  });
  setSelectedWeek((prev) => ({ ...prev, [league]: latestWeek }));
}}
              className="text-blue-600 underline"
            >
              Voir classement semaine
            </button>
            <button
              onClick={() =>
                setOpenModal({ league, mode: 'total' })
              }
              className="text-green-600 underline ml-4"
            >
              Voir classement saison
            </button>

          {openModal?.league === league &&
              openModal?.mode === 'weekly' && (
                <div>
                  {/* Menu déroulant pour changer de semaine */}
                  <div className="mb-2">
                    <label htmlFor={`week-select-${league}`}>Semaine : </label>
                    <select
                      id={`week-select-${league}`}
                      value={selectedWeek[league] || latestWeek}
                      onChange={e => {
                        const week = e.target.value;
                        setSelectedWeek((prev) => ({ ...prev, [league]: week }));
                        setOpenModal((prev) =>
                          prev ? { ...prev, week } : prev
                        );
                      }}
                      className="border rounded px-2 py-1"
                    >
                      {weeks(league).map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Tableau avec surlignage user */}
                  {renderTable(
                    rankingData[league]?.weekly?.[selectedWeek[league] || latestWeek] || [],
                    user
                  )}
                </div>
              )}

            {openModal?.league === league &&
              openModal?.mode === 'total' &&
              renderTable(totalRankings)}

              <button
  onClick={() => setOpenPlayModal(true)}
  className="text-purple-600 underline ml-4"
>
  PLAY
</button>
  {openPlayModal && <PlayModal onClose={() => setOpenPlayModal(false)} />}

          </div>
       

        );
      })}
    </div><Footer />
     </div>
  );
}
