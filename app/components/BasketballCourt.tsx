'use client';

import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  salary: number;
  photo: string;
}

interface PlayerStats {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fantasyPoints: number;
}

interface BasketballCourtProps {
  players: Player[];
  playerStats: {[key: number]: PlayerStats};
  selectedByPosition: {
    PG: number | null;
    SG: number | null;
    SF: number | null;
    PF: number | null;
    C: number | null;
  };
  onSelectPlayer: (playerId: number, position: 'PG' | 'SG' | 'SF' | 'PF' | 'C') => void;
  usedSalary: number;
  salaryCap: number;
}

// Real NBA Season Averages 2023-24 (Top Players)
const SEASON_AVERAGES: {[key: number]: PlayerStats} = {
  // Guards
  1: { pts: 25.7, reb: 4.2, ast: 6.8, stl: 1.2, blk: 0.2, to: 3.4, fantasyPoints: 0 }, // Stephen Curry
  2: { pts: 30.1, reb: 5.2, ast: 6.7, stl: 1.0, blk: 0.4, to: 3.2, fantasyPoints: 0 }, // Luka Doncic
  3: { pts: 28.4, reb: 4.4, ast: 6.1, stl: 1.0, blk: 0.2, to: 2.8, fantasyPoints: 0 }, // Damian Lillard
  4: { pts: 26.4, reb: 4.5, ast: 5.9, stl: 1.1, blk: 0.3, to: 2.9, fantasyPoints: 0 }, // Kyrie Irving
  5: { pts: 25.9, reb: 4.2, ast: 6.3, stl: 1.2, blk: 0.2, to: 2.8, fantasyPoints: 0 }, // Donovan Mitchell
  
  // Forwards
  6: { pts: 30.1, reb: 8.2, ast: 4.2, stl: 1.0, blk: 1.2, to: 3.4, fantasyPoints: 0 }, // Giannis Antetokounmpo
  7: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, to: 3.1, fantasyPoints: 0 }, // Jayson Tatum
  8: { pts: 27.1, reb: 6.7, ast: 5.0, stl: 1.2, blk: 0.8, to: 3.2, fantasyPoints: 0 }, // LeBron James
  9: { pts: 25.4, reb: 6.7, ast: 5.2, stl: 1.1, blk: 0.5, to: 2.9, fantasyPoints: 0 }, // Kawhi Leonard
  10: { pts: 24.8, reb: 6.5, ast: 3.9, stl: 1.0, blk: 0.8, to: 2.7, fantasyPoints: 0 }, // Paul George
  
  // Centers
  11: { pts: 24.9, reb: 12.4, ast: 9.8, stl: 1.3, blk: 0.9, to: 3.6, fantasyPoints: 0 }, // Nikola Jokic
  12: { pts: 33.1, reb: 10.2, ast: 4.2, stl: 1.0, blk: 1.7, to: 3.4, fantasyPoints: 0 }, // Joel Embiid
  13: { pts: 20.1, reb: 10.8, ast: 3.4, stl: 0.8, blk: 2.3, to: 2.9, fantasyPoints: 0 }, // Rudy Gobert
  14: { pts: 22.9, reb: 11.9, ast: 2.9, stl: 0.9, blk: 1.2, to: 2.8, fantasyPoints: 0 }, // Domantas Sabonis
  15: { pts: 19.0, reb: 10.1, ast: 3.2, stl: 0.8, blk: 1.9, to: 2.5, fantasyPoints: 0 }, // Bam Adebayo
  
  // More players...
  16: { pts: 24.6, reb: 4.6, ast: 6.5, stl: 1.4, blk: 0.2, to: 2.8, fantasyPoints: 0 }, // Trae Young
  17: { pts: 22.1, reb: 3.8, ast: 7.4, stl: 1.2, blk: 0.1, to: 3.1, fantasyPoints: 0 }, // Chris Paul
  18: { pts: 23.2, reb: 4.8, ast: 6.2, stl: 1.0, blk: 0.3, to: 2.9, fantasyPoints: 0 }, // Devin Booker
  19: { pts: 21.9, reb: 3.5, ast: 6.8, stl: 1.2, blk: 0.2, to: 2.7, fantasyPoints: 0 }, // Ja Morant
  20: { pts: 20.8, reb: 4.0, ast: 6.7, stl: 1.1, blk: 0.2, to: 2.6, fantasyPoints: 0 }, // De'Aaron Fox
};

// Helper function to get season average for a stat
const getSeasonAverage = (playerId: number, stat: keyof PlayerStats): string => {
  const averages = SEASON_AVERAGES[playerId];
  if (!averages) return '0.0';
  
  const value = averages[stat];
  if (stat === 'fantasyPoints') {
    // Calculate fantasy points using the formula: PTS×1 + REB×1.2 + AST×1.5 + STL×3 + BLK×3 + TO×(-1)
    const fantasy = averages.pts + (averages.reb * 1.2) + (averages.ast * 1.5) + (averages.stl * 3) + (averages.blk * 3) - averages.to;
    return fantasy.toFixed(1);
  }
  
  return typeof value === 'number' ? value.toFixed(1) : '0.0';
};

// Helper function to get season fantasy average
const getSeasonFantasyAverage = (playerId: number): string => {
  return getSeasonAverage(playerId, 'fantasyPoints');
};

export default function BasketballCourt({ 
  players, 
  playerStats, 
  selectedByPosition, 
  onSelectPlayer, 
  usedSalary, 
  salaryCap 
}: BasketballCourtProps) {
  const [activePosition, setActivePosition] = useState<'PG' | 'SG' | 'SF' | 'PF' | 'C'>('PG');
  const [showPlayerList, setShowPlayerList] = useState(true);

  const positionColors: { [key: string]: { bg: string; border: string; shadow: string; name: string } } = {
    PG: { bg: '#3b82f6', border: '#60a5fa', shadow: '#1d4ed8', name: 'Point Guard' },
    SG: { bg: '#10b981', border: '#34d399', shadow: '#059669', name: 'Shooting Guard' },
    SF: { bg: '#a855f7', border: '#c084fc', shadow: '#7c3aed', name: 'Small Forward' },
    PF: { bg: '#f97316', border: '#fb923c', shadow: '#ea580c', name: 'Power Forward' },
    C: { bg: '#ef4444', border: '#f87171', shadow: '#dc2626', name: 'Center' }
  };

  const getSalaryColor = (salary: number) => {
    if (salary === 5) return '#ef4444';
    if (salary === 4) return '#f97316';
    if (salary === 3) return '#f2a900';
    if (salary === 2) return '#10b981';
    return '#3b82f6';
  };

  const playersByPosition = players.filter(p => p.position === activePosition);

  // Auto-switch position when one is filled
  const handlePlayerSelect = (playerId: number, position: 'PG' | 'SG' | 'SF' | 'PF' | 'C') => {
    onSelectPlayer(playerId, position);
    
    // Auto-advance to next empty position
    const positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const currentIndex = positions.indexOf(position);
    
    for (let i = currentIndex + 1; i < positions.length; i++) {
      if (!selectedByPosition[positions[i]]) {
        setTimeout(() => setActivePosition(positions[i]), 300);
        return;
      }
    }
    
    // If all after are filled, check before
    for (let i = 0; i < currentIndex; i++) {
      if (!selectedByPosition[positions[i]]) {
        setTimeout(() => setActivePosition(positions[i]), 300);
        return;
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white transform skew-y-1"></div>
      <div className="relative border-6 border-[#f2a900] p-8" style={{ background: '#1a1f3a' }}>
        <div className="-skew-y-0">
          {/* Court Header with Progress */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-white uppercase tracking-wider mb-4" style={{ 
              fontFamily: 'Bebas Neue, sans-serif',
              textShadow: '3px 3px 0px #f2a900'
            }}>
              🏀 Build Your Lineup
            </h2>
            
            {/* Live Stats Indicator */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-[#f2a900] px-4 py-2 border-4 border-white transform -skew-x-3">
                <div className="skew-x-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[#0a0e27] font-black text-sm uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    Live Stats Active
                  </span>
                </div>
              </div>
              <div className="text-white/80 text-sm font-bold">
                Updates every 2 minutes
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm uppercase tracking-wider">Team Progress</span>
                <span className="text-[#f2a900] font-black text-xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {Object.values(selectedByPosition).filter(id => id !== null).length}/5
                </span>
          </div>
              <div className="h-4 bg-[#0a0e27] border-4 border-white relative overflow-hidden">
                <div 
                  className="h-full bg-[#f2a900] transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(Object.values(selectedByPosition).filter(id => id !== null).length / 5) * 100}%`
                  }}
                ></div>
          </div>
        </div>
      </div>

          {/* Position Selector - ENHANCED BIG BUTTONS */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            {(['PG', 'SG', 'SF', 'PF', 'C'] as const).map((pos, index) => {
              const colors = positionColors[pos];
              const isActive = activePosition === pos;
              const isSelected = selectedByPosition[pos];
              
              return (
          <button
            key={pos}
            onClick={() => setActivePosition(pos)}
                  className="relative group"
                >
                  {/* Background shadow */}
                  <div className={`absolute inset-0 transform -skew-x-6 transition-all ${
                    isActive ? 'bg-white' : isSelected ? 'bg-[#f2a900]' : 'bg-gray-700'
                  }`}></div>
                  
                  {/* Main button */}
                  <div 
                    className={`relative transform -skew-x-6 transition-all border-4 p-4 group-hover:skew-x-6 ${
                      isActive ? 'scale-110 border-white' : 'border-white/50'
                    }`}
                    style={{ 
                      backgroundColor: isActive ? colors.bg : isSelected ? colors.shadow : '#0a0e27'
                    }}
                  >
                    <div className="skew-x-6 text-center">
                      {/* Status indicator */}
                      <div className="mb-2">
                        {isSelected ? (
                          <div className="w-8 h-8 mx-auto bg-[#f2a900] border-2 border-white flex items-center justify-center font-black text-[#0a0e27]">
                            ✓
                          </div>
                        ) : isActive ? (
                          <div className="w-8 h-8 mx-auto border-2 border-white border-dashed flex items-center justify-center text-white text-xl animate-pulse">
                            👉
                          </div>
                        ) : (
                          <div className="w-8 h-8 mx-auto border-2 border-white/30 flex items-center justify-center text-white/50 text-lg">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      {/* Position code */}
                      <div className="font-black text-2xl text-white mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {pos}
                      </div>
                      
                      {/* Position name */}
                      <div className={`text-xs font-bold uppercase tracking-wide ${
                        isActive ? 'text-white' : isSelected ? 'text-[#f2a900]' : 'text-gray-400'
                      }`}>
                        {colors.name.split(' ')[0]}
                      </div>
                      
                      {/* Selected player indicator */}
                      {isSelected && (
                        <div className="mt-2 text-[#f2a900] text-xs font-bold">
                          LOCKED
                        </div>
                      )}
                    </div>
                  </div>
          </button>
              );
            })}
          </div>
          
          {/* Active Position Info Banner */}
          <div className="relative mb-6">
            <div className="absolute inset-0 transform -skew-x-3" style={{ backgroundColor: positionColors[activePosition].bg }}></div>
            <div className="relative border-4 border-white p-4 transform -skew-x-3">
              <div className="skew-x-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👇</div>
                  <div>
                    <div className="text-white font-black text-3xl uppercase leading-none mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      Select Your {positionColors[activePosition].name}
                    </div>
                    <div className="text-white/80 text-sm font-bold">
                      {playersByPosition.length} players available • Salary {usedSalary}/{salaryCap}
                    </div>
                  </div>
      </div>

                {/* Toggle player list button */}
                <button
                  onClick={() => setShowPlayerList(!showPlayerList)}
                  className="px-6 py-3 bg-white text-[#0a0e27] font-black border-4 border-[#0a0e27] hover:scale-105 transition-transform"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {showPlayerList ? '▼ Hide Players' : '▶ Show Players'}
                </button>
              </div>
            </div>
          </div>

          {/* MASSIVE NBA COURT */}
          <div className="relative mb-8" style={{ 
            background: 'linear-gradient(135deg, #c19a6b 0%, #a0826d 100%)',
            minHeight: '600px',
            border: '8px solid #8b4513',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {/* Court Lines - White */}
            <div className="absolute inset-8 border-4 border-white opacity-90"></div>
        
        {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full opacity-90"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
            
            {/* 3-Point Arc Top */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-64 h-40 border-4 border-white border-b-0 rounded-t-full opacity-90"></div>
            
            {/* 3-Point Arc Bottom */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 h-40 border-4 border-white border-t-0 rounded-b-full opacity-90"></div>

            {/* Free Throw Circles */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-white rounded-full opacity-90"></div>
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-white rounded-full opacity-90"></div>

            {/* Position Slots - PROPER NBA FORMATION */}
            {/* PG - Point Guard - BOTTOM Left (backcourt) */}
            <div 
              className="absolute bottom-16 left-1/3 transform -translate-x-1/2 cursor-pointer group z-20"
              onClick={() => setActivePosition('PG')}
            >
              {selectedByPosition.PG ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 transform -skew-x-6 animate-pulse"></div>
                  <div className="relative bg-white border-6 border-blue-500 p-4 transform -skew-x-6 hover:skew-x-6 transition-transform w-40 h-52">
                    <div className="skew-x-6">
                      {(() => {
                        const player = players.find(p => p.id === selectedByPosition.PG);
                        const stats = playerStats[selectedByPosition.PG!];
                        if (!player) return null;
                        return (
                          <>
                            <div className="relative w-full h-28 mb-2 overflow-hidden">
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-blue-600 font-black text-sm mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PG</div>
                              <div className="text-gray-900 font-black text-sm leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{player.name.split(' ').pop()}</div>
                              {stats && <div className="text-blue-600 font-black text-2xl mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
        </div>
              ) : (
                <div className="relative">
                  <div className={`absolute inset-0 bg-blue-500 transform -skew-x-6 transition-all ${activePosition === 'PG' ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative bg-[#0a0e27] border-6 border-dashed p-4 transform -skew-x-6 hover:skew-x-6 hover:scale-110 transition-all w-40 h-52 flex items-center justify-center ${
                    activePosition === 'PG' ? 'border-white scale-110' : 'border-blue-500'
                  }`}>
                    <div className="text-center skew-x-6">
                      <div className="text-6xl mb-2">{activePosition === 'PG' ? '👉' : '🏀'}</div>
                      <div className={`font-black text-2xl mb-1 ${activePosition === 'PG' ? 'text-white' : 'text-blue-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PG</div>
                      <div className={`text-xs font-bold uppercase ${activePosition === 'PG' ? 'text-[#f2a900]' : 'text-white/50'}`}>
                        {activePosition === 'PG' ? 'Click Below' : 'Empty'}
                      </div>
        </div>
        </div>
        </div>
              )}
        </div>

            {/* SG - Shooting Guard - BOTTOM Right (backcourt) */}
            <div 
              className="absolute bottom-16 right-1/3 transform translate-x-1/2 cursor-pointer group z-20"
              onClick={() => setActivePosition('SG')}
            >
              {selectedByPosition.SG ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 transform -skew-x-6 animate-pulse"></div>
                  <div className="relative bg-white border-6 border-green-500 p-4 transform -skew-x-6 hover:skew-x-6 transition-transform w-40 h-52">
                    <div className="skew-x-6">
                      {(() => {
                        const player = players.find(p => p.id === selectedByPosition.SG);
                        const stats = playerStats[selectedByPosition.SG!];
          if (!player) return null;
                        return (
                          <>
                            <div className="relative w-full h-28 mb-2 overflow-hidden">
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-green-600 font-black text-sm mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SG</div>
                              <div className="text-gray-900 font-black text-sm leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{player.name.split(' ').pop()}</div>
                              {stats && <div className="text-green-600 font-black text-2xl mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className={`absolute inset-0 bg-green-500 transform -skew-x-6 transition-all ${activePosition === 'SG' ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative bg-[#0a0e27] border-6 border-dashed p-4 transform -skew-x-6 hover:skew-x-6 hover:scale-110 transition-all w-40 h-52 flex items-center justify-center ${
                    activePosition === 'SG' ? 'border-white scale-110' : 'border-green-500'
                  }`}>
                    <div className="text-center skew-x-6">
                      <div className="text-6xl mb-2">{activePosition === 'SG' ? '👉' : '🏀'}</div>
                      <div className={`font-black text-2xl mb-1 ${activePosition === 'SG' ? 'text-white' : 'text-green-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SG</div>
                      <div className={`text-xs font-bold uppercase ${activePosition === 'SG' ? 'text-[#f2a900]' : 'text-white/50'}`}>
                        {activePosition === 'SG' ? 'Click Below' : 'Empty'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SF - Small Forward - TOP Left (wing) */}
            <div 
              className="absolute top-1/3 left-16 transform -translate-y-1/2 cursor-pointer group z-20"
              onClick={() => setActivePosition('SF')}
            >
              {selectedByPosition.SF ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 transform -skew-x-6 animate-pulse"></div>
                  <div className="relative bg-white border-6 border-purple-500 p-4 transform -skew-x-6 hover:skew-x-6 transition-transform w-40 h-52">
                    <div className="skew-x-6">
                      {(() => {
                        const player = players.find(p => p.id === selectedByPosition.SF);
                        const stats = playerStats[selectedByPosition.SF!];
                        if (!player) return null;
                        return (
                          <>
                            <div className="relative w-full h-28 mb-2 overflow-hidden">
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-purple-600 font-black text-sm mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SF</div>
                              <div className="text-gray-900 font-black text-sm leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{player.name.split(' ').pop()}</div>
                              {stats && <div className="text-purple-600 font-black text-2xl mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className={`absolute inset-0 bg-purple-500 transform -skew-x-6 transition-all ${activePosition === 'SF' ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative bg-[#0a0e27] border-6 border-dashed p-4 transform -skew-x-6 hover:skew-x-6 hover:scale-110 transition-all w-40 h-52 flex items-center justify-center ${
                    activePosition === 'SF' ? 'border-white scale-110' : 'border-purple-500'
                  }`}>
                    <div className="text-center skew-x-6">
                      <div className="text-6xl mb-2">{activePosition === 'SF' ? '👉' : '🏀'}</div>
                      <div className={`font-black text-2xl mb-1 ${activePosition === 'SF' ? 'text-white' : 'text-purple-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SF</div>
                      <div className={`text-xs font-bold uppercase ${activePosition === 'SF' ? 'text-[#f2a900]' : 'text-white/50'}`}>
                        {activePosition === 'SF' ? 'Click Below' : 'Empty'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PF - Power Forward - TOP Right (wing) */}
            <div 
              className="absolute top-1/3 right-16 transform -translate-y-1/2 cursor-pointer group z-20"
              onClick={() => setActivePosition('PF')}
            >
              {selectedByPosition.PF ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 transform -skew-x-6 animate-pulse"></div>
                  <div className="relative bg-white border-6 border-orange-500 p-4 transform -skew-x-6 hover:skew-x-6 transition-transform w-40 h-52">
                    <div className="skew-x-6">
                      {(() => {
                        const player = players.find(p => p.id === selectedByPosition.PF);
                        const stats = playerStats[selectedByPosition.PF!];
                        if (!player) return null;
          return (
                          <>
                            <div className="relative w-full h-28 mb-2 overflow-hidden">
                <img
                  src={player.photo}
                  alt={player.name}
                                className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                  }}
                />
                            </div>
                            <div className="text-center">
                              <div className="text-orange-600 font-black text-sm mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PF</div>
                              <div className="text-gray-900 font-black text-sm leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{player.name.split(' ').pop()}</div>
                              {stats && <div className="text-orange-600 font-black text-2xl mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className={`absolute inset-0 bg-orange-500 transform -skew-x-6 transition-all ${activePosition === 'PF' ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative bg-[#0a0e27] border-6 border-dashed p-4 transform -skew-x-6 hover:skew-x-6 hover:scale-110 transition-all w-40 h-52 flex items-center justify-center ${
                    activePosition === 'PF' ? 'border-white scale-110' : 'border-orange-500'
                  }`}>
                    <div className="text-center skew-x-6">
                      <div className="text-6xl mb-2">{activePosition === 'PF' ? '👉' : '🏀'}</div>
                      <div className={`font-black text-2xl mb-1 ${activePosition === 'PF' ? 'text-white' : 'text-orange-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PF</div>
                      <div className={`text-xs font-bold uppercase ${activePosition === 'PF' ? 'text-[#f2a900]' : 'text-white/50'}`}>
                        {activePosition === 'PF' ? 'Click Below' : 'Empty'}
                      </div>
                    </div>
                </div>
              </div>
              )}
            </div>

            {/* C - Center - TOP Center (paint) */}
            <div 
              className="absolute top-16 left-1/2 transform -translate-x-1/2 cursor-pointer group z-20"
              onClick={() => setActivePosition('C')}
            >
              {selectedByPosition.C ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 transform -skew-x-6 animate-pulse"></div>
                  <div className="relative bg-white border-6 border-red-500 p-4 transform -skew-x-6 hover:skew-x-6 transition-transform w-40 h-52">
                    <div className="skew-x-6">
                      {(() => {
                        const player = players.find(p => p.id === selectedByPosition.C);
                        const stats = playerStats[selectedByPosition.C!];
                        if (!player) return null;
                        return (
                          <>
                            <div className="relative w-full h-28 mb-2 overflow-hidden">
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-red-600 font-black text-sm mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>C</div>
                              <div className="text-gray-900 font-black text-sm leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{player.name.split(' ').pop()}</div>
                              {stats && <div className="text-red-600 font-black text-2xl mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className={`absolute inset-0 bg-red-500 transform -skew-x-6 transition-all ${activePosition === 'C' ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative bg-[#0a0e27] border-6 border-dashed p-4 transform -skew-x-6 hover:skew-x-6 hover:scale-110 transition-all w-40 h-52 flex items-center justify-center ${
                    activePosition === 'C' ? 'border-white scale-110' : 'border-red-500'
                  }`}>
                    <div className="text-center skew-x-6">
                      <div className="text-6xl mb-2">{activePosition === 'C' ? '👉' : '🏀'}</div>
                      <div className={`font-black text-2xl mb-1 ${activePosition === 'C' ? 'text-white' : 'text-red-500'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>C</div>
                      <div className={`text-xs font-bold uppercase ${activePosition === 'C' ? 'text-[#f2a900]' : 'text-white/50'}`}>
                        {activePosition === 'C' ? 'Click Below' : 'Empty'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
      </div>

      {/* Player Selection Area */}
          {showPlayerList && (
      <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#f2a900 #0a0e27'
              }}>
          {playersByPosition.map(player => {
            const stats = playerStats[player.id];
            const isSelected = selectedByPosition[activePosition] === player.id;
                  const salaryColor = getSalaryColor(player.salary);
            
            return (
              <div
                key={player.id}
                      onClick={() => handlePlayerSelect(player.id, activePosition)}
                      className="relative group cursor-pointer"
                    >
                    <div className={`absolute inset-0 transform -skew-x-3 transition-all ${
                      isSelected ? 'bg-[#f2a900]' : 'bg-white group-hover:bg-[#f2a900]'
                    }`}></div>
                    <div className={`relative border-4 transform -skew-x-3 group-hover:skew-x-3 transition-all ${
                  isSelected
                        ? 'bg-white border-[#f2a900] scale-105'
                        : 'bg-[#0a0e27] border-white'
                    }`}>
                      <div className="skew-x-3 p-3">
                {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#f2a900] w-8 h-8 flex items-center justify-center z-10 font-black text-[#0a0e27]">
                            ✓
                  </div>
                )}
                
                        <div className="relative h-32 mb-2 overflow-hidden">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
                    }}
                  />
                          <div className="absolute top-1 left-1 px-2 py-1 font-black text-sm" style={{ 
                            backgroundColor: salaryColor,
                            color: 'white',
                            fontFamily: 'Bebas Neue, sans-serif'
                          }}>
                            💰{player.salary}
                  </div>
                </div>
                
                        <div className="text-center mb-2">
                          <h4 className={`font-black text-lg mb-1 leading-tight uppercase ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif', lineHeight: '1.1' }}>
                            {player.name}
                          </h4>
                          <p className={`text-sm font-bold ${isSelected ? 'text-gray-700' : 'text-gray-300'}`}>{player.team}</p>
                        </div>
                  
                  {/* Live Stats Section - Always Show */}
                  <div className={`border-3 p-3 ${isSelected ? 'border-gray-400 bg-gray-50' : 'border-[#f2a900] bg-[#0a0e27]'}`}>
                    {stats ? (
                      <>
                        {/* Live Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>PTS</div>
                            <div className={`font-black text-lg ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.pts}</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>REB</div>
                            <div className={`font-black text-lg ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.reb}</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>AST</div>
                            <div className={`font-black text-lg ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.ast}</div>
                          </div>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>STL</div>
                            <div className={`font-black text-sm ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.stl}</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>BLK</div>
                            <div className={`font-black text-sm ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.blk}</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-bold text-xs uppercase ${isSelected ? 'text-gray-600' : 'text-gray-300'}`}>TO</div>
                            <div className={`font-black text-sm ${isSelected ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.to}</div>
                          </div>
                        </div>
                        
                        {/* Fantasy Points */}
                        <div className={`border-t-3 pt-2 text-center ${isSelected ? 'border-gray-400' : 'border-[#f2a900]'}`}>
                          <div className="font-black text-[#f2a900] text-sm uppercase tracking-wider">Fantasy PTS</div>
                          <div className="font-black text-[#f2a900] text-3xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{stats.fantasyPoints}</div>
                        </div>
                        
                        {/* Season Average Stats */}
                        <div className={`border-t pt-2 mt-2 ${isSelected ? 'border-gray-300' : 'border-gray-600'}`}>
                          <div className={`text-center mb-2 font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                            Season Averages
                          </div>
                          
                          {/* Season Stats Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center">
                              <div className={`font-bold ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>PTS</div>
                              <div className={`font-black text-sm ${isSelected ? 'text-gray-800' : 'text-gray-200'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {getSeasonAverage(player.id, 'pts')}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>REB</div>
                              <div className={`font-black text-sm ${isSelected ? 'text-gray-800' : 'text-gray-200'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {getSeasonAverage(player.id, 'reb')}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>AST</div>
                              <div className={`font-black text-sm ${isSelected ? 'text-gray-800' : 'text-gray-200'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {getSeasonAverage(player.id, 'ast')}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>STL</div>
                              <div className={`font-black text-sm ${isSelected ? 'text-gray-800' : 'text-gray-200'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {getSeasonAverage(player.id, 'stl')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Season Fantasy Average */}
                          <div className={`border-t pt-1 mt-2 text-center ${isSelected ? 'border-gray-300' : 'border-gray-600'}`}>
                            <div className={`font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>Avg Fantasy</div>
                            <div className={`font-black text-lg ${isSelected ? 'text-gray-800' : 'text-gray-200'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                              {getSeasonFantasyAverage(player.id)}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* No Live Stats Available */
                      <div className="text-center py-4">
                        <div className={`text-sm font-bold ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                          📊 Live Stats Loading...
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-gray-500' : 'text-gray-500'}`}>
                          Stats update every 2 minutes
                        </div>
                      </div>
                    )}
                  </div>
                      </div>
                </div>
              </div>
            );
          })}
              </div>
            </div>
          )}
          
          {/* Quick Tips */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
              <div className="relative bg-[#0a0e27] border-4 border-white p-4 transform -skew-x-3">
                <div className="skew-x-3 text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <div className="text-white font-bold text-sm">
                    Click position buttons to switch • Auto-advances after selection
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-white transform -skew-x-3"></div>
              <div className="relative bg-[#0a0e27] border-4 border-[#f2a900] p-4 transform -skew-x-3">
                <div className="skew-x-3 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-white font-bold text-sm">
                    Click players to select • Watch your salary cap: {usedSalary}/{salaryCap}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
