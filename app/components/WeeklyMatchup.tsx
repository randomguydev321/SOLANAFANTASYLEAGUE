'use client';

import { useState, useEffect } from 'react';

interface Matchup {
  id: string;
  week: number;
  player1: {
    address: string;
    name?: string;
    lineup: {
      PG: number;
      SG: number;
      SF: number;
      PF: number;
      C: number;
    };
    totalScore: number;
    projectedScore: number;
  };
  player2: {
    address: string;
    name?: string;
    lineup: {
      PG: number;
      SG: number;
      SF: number;
      PF: number;
      C: number;
    };
    totalScore: number;
    projectedScore: number;
  };
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  winner?: string;
}

interface WeeklyMatchupProps {
  userAddress?: string;
  className?: string;
}

export default function WeeklyMatchup({ userAddress, className = '' }: WeeklyMatchupProps) {
  const [currentMatchup, setCurrentMatchup] = useState<Matchup | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Mock data for demonstration
  const mockMatchup: Matchup = {
    id: 'week-1',
    week: 1,
    player1: {
      address: userAddress || '0x1234...5678',
      name: 'Your Team',
      lineup: { PG: 1, SG: 31, SF: 61, PF: 91, C: 121 },
      totalScore: 0,
      projectedScore: 285
    },
    player2: {
      address: '0x9876...5432',
      name: 'Lakers Fan',
      lineup: { PG: 2, SG: 32, SF: 62, PF: 92, C: 122 },
      totalScore: 0,
      projectedScore: 298
    },
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCurrentMatchup(mockMatchup);
      setLoading(false);
    }, 1000);

    // Update time remaining every minute
    const interval = setInterval(() => {
      if (mockMatchup) {
        const now = new Date();
        const endDate = new Date(mockMatchup.endDate);
        const diff = endDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          setTimeRemaining(`${days}d ${hours}h`);
        } else {
          setTimeRemaining('Matchup Complete');
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [userAddress]);

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-yellow-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '⚔️';
      case 'upcoming': return '⏰';
      case 'completed': return '🏁';
      default: return '⏸️';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 border border-blue-500 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!currentMatchup) {
    return (
      <div className={`bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl p-6 border border-blue-500 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-gray-400">No matchup found</p>
          <p className="text-sm text-gray-500 mt-1">Check back for weekly matchups</p>
        </div>
      </div>
    );
  }

  const isUserPlayer1 = currentMatchup.player1.address.toLowerCase() === userAddress?.toLowerCase();
  const userTeam = isUserPlayer1 ? currentMatchup.player1 : currentMatchup.player2;
  const opponentTeam = isUserPlayer1 ? currentMatchup.player2 : currentMatchup.player1;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Week {currentMatchup.week} Matchup
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentMatchup.status)}`}>
          {currentMatchup.status.toUpperCase()}
        </div>
      </div>

      {/* Time Remaining */}
      <div className="text-center mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-600 text-sm mb-1">Time Remaining</p>
          <p className="text-xl font-bold text-gray-900">{timeRemaining}</p>
        </div>
      </div>

      {/* Matchup Display */}
      <div className="space-y-3">
        {/* Your Team */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">YOU</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">{userTeam.name || formatAddress(userTeam.address)}</p>
                <p className="text-green-600 text-xs">Your Team</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{userTeam.totalScore}</p>
              <p className="text-green-600 text-xs">Projected: {userTeam.projectedScore}</p>
            </div>
          </div>
          
          {/* Your Lineup */}
          <div className="grid grid-cols-5 gap-1 mt-2">
            {Object.entries(userTeam.lineup).map(([position, playerId]) => (
              <div key={position} className="bg-white rounded p-1 text-center">
                <div className="text-green-600 text-xs font-medium">{position}</div>
                <div className="text-gray-700 text-xs">#{playerId}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-full px-3 py-1">
            <span className="text-gray-700 font-medium text-sm">VS</span>
          </div>
        </div>

        {/* Opponent Team */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">OPP</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">{opponentTeam.name || formatAddress(opponentTeam.address)}</p>
                <p className="text-red-600 text-xs">Opponent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{opponentTeam.totalScore}</p>
              <p className="text-red-600 text-xs">Projected: {opponentTeam.projectedScore}</p>
            </div>
          </div>
          
          {/* Opponent Lineup */}
          <div className="grid grid-cols-5 gap-1 mt-2">
            {Object.entries(opponentTeam.lineup).map(([position, playerId]) => (
              <div key={position} className="bg-white rounded p-1 text-center">
                <div className="text-red-600 text-xs font-medium">{position}</div>
                <div className="text-gray-700 text-xs">#{playerId}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matchup Stats */}
      <div className="mt-4 bg-gray-50 rounded-lg p-3">
        <h4 className="text-gray-900 font-medium mb-2 text-center">Matchup Analysis</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Score Difference</p>
            <p className={`text-lg font-bold ${userTeam.totalScore > opponentTeam.totalScore ? 'text-green-600' : 'text-red-600'}`}>
              {userTeam.totalScore - opponentTeam.totalScore > 0 ? '+' : ''}{userTeam.totalScore - opponentTeam.totalScore}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Projected Winner</p>
            <p className={`text-lg font-bold ${userTeam.projectedScore > opponentTeam.projectedScore ? 'text-green-600' : 'text-red-600'}`}>
              {userTeam.projectedScore > opponentTeam.projectedScore ? 'YOU' : 'OPPONENT'}
            </p>
          </div>
        </div>
      </div>

      {/* Winner Announcement */}
      {currentMatchup.status === 'completed' && currentMatchup.winner && (
        <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-gray-900 font-bold text-lg">
              {currentMatchup.winner === userAddress ? 'YOU WON!' : 'YOU LOST'}
            </p>
            <p className="text-yellow-600 text-sm">Matchup Complete</p>
          </div>
        </div>
      )}
    </div>
  );
}
