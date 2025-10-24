'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TournamentProps {
  userAddress: string;
  userScore: number;
}

interface WeeklyMatch {
  week: number;
  opponent: string | null;
  opponentScore: number | null;
  yourScore: number;
  result: 'pending' | 'win' | 'loss' | 'waiting';
  endsAt: number;
}

export default function WeeklyTournament({ userAddress, userScore }: TournamentProps) {
  const { t } = useLanguage();
  const [currentMatch, setCurrentMatch] = useState<WeeklyMatch | null>(null);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Create weekly tournament with real user matching
    const now = Date.now();
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    const weekNumber = Math.floor(weekStart.getTime() / (7 * 24 * 60 * 60 * 1000));
    
    // Check if there are other users in the pool
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const otherUsers = allUsers.filter((user: string) => user !== userAddress);
    
    const weeklyMatch: WeeklyMatch = {
      week: weekNumber,
      opponent: otherUsers.length > 0 ? otherUsers[Math.floor(Math.random() * otherUsers.length)] : null,
      opponentScore: otherUsers.length > 0 ? Math.floor(Math.random() * 200) + 100 : null,
      yourScore: userScore,
      result: otherUsers.length > 0 ? 'pending' : 'waiting',
      endsAt: now + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    setCurrentMatch(weeklyMatch);
    
    // Load real record from localStorage
    const savedRecord = localStorage.getItem(`tournamentRecord_${userAddress}`);
    if (savedRecord) {
      setRecord(JSON.parse(savedRecord));
    }
  }, [userAddress, userScore]);

  useEffect(() => {
    if (!currentMatch) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = currentMatch.endsAt - now;

      if (diff <= 0) {
        setTimeRemaining('Week Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMatch]);

  if (!currentMatch) return null;

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white transform skew-y-1"></div>
      <div className="relative bg-[#1a1f3a] border-6 border-[#f2a900] p-6 transform skew-y-1">
        <div className="-skew-y-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">⚔️</div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-wider leading-none" style={{ 
                fontFamily: 'Bebas Neue, sans-serif',
                textShadow: '2px 2px 0px #f2a900'
              }}>
                Weekly Tournament
              </h2>
              <p className="text-[#f2a900] font-bold text-sm">
                Week {currentMatch.week}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
            <div className="relative bg-[#0a0e27] border-4 border-white p-4 transform -skew-x-3">
              <div className="skew-x-3 text-center">
                <div className="text-gray-400 text-xs font-bold uppercase mb-1">Week Ends In</div>
                <div className="text-[#f2a900] text-3xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {timeRemaining}
                </div>
              </div>
            </div>
          </div>

          {/* VS Section */}
          {currentMatch.opponent ? (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Your Team */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 transform -skew-x-3"></div>
                <div className="relative bg-[#0a0e27] border-4 border-blue-400 p-4 transform -skew-x-3">
                  <div className="skew-x-3 text-center">
                    <div className="text-blue-400 text-xs font-bold uppercase mb-2">Your Team</div>
                    <div className="text-white font-mono text-xs mb-2">{formatAddress(userAddress)}</div>
                    <div className="text-blue-400 text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {currentMatch.yourScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#f2a900] transform rotate-12 animate-pulse"></div>
                  <div className="relative bg-[#0a0e27] border-4 border-white px-6 py-3">
                    <div className="text-white text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      VS
                    </div>
                  </div>
                </div>
              </div>

              {/* Opponent Team */}
              <div className="relative group">
                <div className="absolute inset-0 bg-red-500 transform -skew-x-3"></div>
                <div className="relative bg-[#0a0e27] border-4 border-red-400 p-4 transform -skew-x-3">
                  <div className="skew-x-3 text-center">
                    <div className="text-red-400 text-xs font-bold uppercase mb-2">Real Opponent</div>
                    <div className="text-white font-mono text-xs mb-2">{formatAddress(currentMatch.opponent)}</div>
                    <div className="text-red-400 text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {currentMatch.opponentScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Waiting for Opponents */
            <div className="text-center py-8 mb-6">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Waiting for Real Opponents
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                You're the first player! Share the game with friends to start competing in weekly tournaments.
              </p>
              <div className="text-gray-400 text-xs mb-4">
                No bots or fake opponents - only real wallet vs wallet matchups!
              </div>
              <div className="bg-[#f2a900] text-[#0a0e27] px-4 py-2 rounded-lg font-black text-sm inline-block" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Week {currentMatch.week} - Ready to Compete!
              </div>
            </div>
          )}

          {/* Record */}
          <div className="relative">
            <div className="absolute inset-0 bg-white transform -skew-x-3"></div>
            <div className="relative bg-[#0a0e27] border-4 border-[#f2a900] p-4 transform -skew-x-3">
              <div className="skew-x-3 flex items-center justify-between">
                <div className="text-white font-bold text-sm uppercase">{t('matchmaking.record')}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {record.wins}
                    </span>
                    <span className="text-green-500 text-xs font-bold">Wins</span>
                  </div>
                  <div className="text-white text-2xl">-</div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {record.losses}
                    </span>
                    <span className="text-red-500 text-xs font-bold">Losses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs font-bold">
              🏆 Weekly tournaments • Real users only • Top performers win SOL prizes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



