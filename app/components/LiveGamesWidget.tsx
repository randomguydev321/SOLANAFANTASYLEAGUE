'use client';

import { useState, useEffect } from 'react';

interface Game {
  gameId: string;
  homeTeam: {
    teamId: number;
    teamName: string;
    teamTricode: string;
    score: number;
  };
  awayTeam: {
    teamId: number;
    teamName: string;
    teamTricode: string;
    score: number;
  };
  gameStatus: number;
  gameStatusText: string;
  period: number;
  gameClock: string;
  startTimeUTC: string;
}

interface LiveGamesWidgetProps {
  className?: string;
}

export default function LiveGamesWidget({ className = '' }: LiveGamesWidgetProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLiveGames = async () => {
    try {
      const response = await fetch('/api/live-games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching live games:', error);
      // No mock data - return empty array
      setGames([]);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGames();
    const interval = setInterval(fetchLiveGames, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'text-yellow-400'; // Not started
      case 2: return 'text-green-400 animate-pulse'; // Live
      case 3: return 'text-gray-400'; // Finished
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: return '⏰';
      case 2: return '🔴';
      case 3: return '✅';
      default: return '⏸️';
    }
  };

  const formatGameTime = (startTime: string) => {
    const gameTime = new Date(startTime);
    const now = new Date();
    const diff = gameTime.getTime() - now.getTime();
    
    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return 'Started';
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 border border-purple-500 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Live Games
        </h3>
        <div className="text-xs text-gray-500">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🏀</div>
          <p className="text-gray-500">No games live right now</p>
          <p className="text-sm text-gray-400 mt-1">Check back during game times</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {games.map((game) => (
            <div key={game.gameId} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${getStatusColor(game.gameStatus)}`}>
                    {getStatusIcon(game.gameStatus)}
                  </span>
                  <span className="text-gray-900 font-medium text-sm">
                    {game.gameStatusText}
                  </span>
                </div>
                {game.gameStatus === 2 && (
                  <div className="text-red-600 text-sm font-medium">
                    Q{game.period} - {game.gameClock}
                  </div>
                )}
                {game.gameStatus === 1 && (
                  <div className="text-yellow-600 text-sm">
                    {formatGameTime(game.startTimeUTC)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {/* Away Team */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 text-xs font-bold">
                        {game.awayTeam.teamTricode}
                      </span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{game.awayTeam.teamName}</span>
                  </div>
                  <span className="text-gray-900 font-bold text-lg">{game.awayTeam.score}</span>
                </div>

                {/* Home Team */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 text-xs font-bold">
                        {game.homeTeam.teamTricode}
                      </span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{game.homeTeam.teamName}</span>
                  </div>
                  <span className="text-gray-900 font-bold text-lg">{game.homeTeam.score}</span>
                </div>
              </div>

              {/* Live Indicator */}
              {game.gameStatus === 2 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 text-xs font-medium">LIVE</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 text-xs">Auto-updating every 30s</span>
        </div>
      </div>
    </div>
  );
}
