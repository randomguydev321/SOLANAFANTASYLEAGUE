'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TournamentProps {
  userAddress: string;
  userScore: number;
}

interface Match {
  round: number;
  opponent: string;
  opponentScore: number;
  yourScore: number;
  result: 'pending' | 'win' | 'loss';
  endsAt: number;
}

export default function ThreeDayTournament({ userAddress, userScore }: TournamentProps) {
  const { t } = useLanguage();
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Simulate matchmaking - in production, this would come from smart contract
    const mockMatch: Match = {
      round: 1,
      opponent: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      opponentScore: Math.floor(Math.random() * 500) + 200,
      yourScore: userScore,
      result: 'pending',
      endsAt: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 days from now
    };
    
    setCurrentMatch(mockMatch);
    
    // Mock record
    setRecord({
      wins: Math.floor(Math.random() * 5),
      losses: Math.floor(Math.random() * 3)
    });
  }, [userAddress, userScore]);

  useEffect(() => {
    if (!currentMatch) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = currentMatch.endsAt - now;

      if (diff <= 0) {
        setTimeRemaining('Match Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
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
                {t('matchmaking.title')}
              </h2>
              <p className="text-[#f2a900] font-bold text-sm">
                {t('matchmaking.currentRound')} {currentMatch.round}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
            <div className="relative bg-[#0a0e27] border-4 border-white p-4 transform -skew-x-3">
              <div className="skew-x-3 text-center">
                <div className="text-gray-400 text-xs font-bold uppercase mb-1">{t('matchmaking.nextMatch')}</div>
                <div className="text-[#f2a900] text-3xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {timeRemaining}
                </div>
              </div>
            </div>
          </div>

          {/* VS Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Your Team */}
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 transform -skew-x-3"></div>
              <div className="relative bg-[#0a0e27] border-4 border-blue-400 p-4 transform -skew-x-3">
                <div className="skew-x-3 text-center">
                  <div className="text-blue-400 text-xs font-bold uppercase mb-2">{t('matchmaking.yourTeam')}</div>
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
                  <div className="text-red-400 text-xs font-bold uppercase mb-2">{t('matchmaking.opponent')}</div>
                  <div className="text-white font-mono text-xs mb-2">{formatAddress(currentMatch.opponent)}</div>
                  <div className="text-red-400 text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {currentMatch.opponentScore}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    <span className="text-green-500 text-xs font-bold">{t('matchmaking.wins')}</span>
                  </div>
                  <div className="text-white text-2xl">-</div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {record.losses}
                    </span>
                    <span className="text-red-500 text-xs font-bold">{t('matchmaking.losses')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs font-bold">
              🏆 Winners advance every 3 days • Top performers win BNB prizes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



