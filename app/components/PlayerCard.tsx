'use client';

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  salary: number;
  tier: string;
  number: string;
  photo: string;
}

interface PlayerStats {
  pts: number;
  reb: number;
  ast: number;
  fantasyPoints: number;
  trend: 'up' | 'down' | 'stable';
}

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  isSelected: boolean;
  onToggle: (id: number) => void;
  showSalary?: boolean;
  compact?: boolean;
}

export default function PlayerCard({ 
  player, 
  stats, 
  isSelected, 
  onToggle, 
  showSalary = true,
  compact = false 
}: PlayerCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-red-400';
      case 'A': return 'text-orange-400';
      case 'B': return 'text-yellow-400';
      case 'C': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div
      onClick={() => onToggle(player.id)}
      className={`player-card-artistic ${isSelected ? 'selected' : ''} ${compact ? 'cursor-pointer' : ''}`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center z-10 font-bold">
          ✓
        </div>
      )}
      
      <div className={`relative overflow-hidden ${compact ? 'h-24' : 'h-32'}`}>
        <img
          src={player.photo}
          alt={player.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className={`absolute top-1 left-1 px-2 py-1 rounded text-xs font-bold ${getTierColor(player.tier)} bg-black`}>
          {player.tier}
        </div>
      </div>
      
      <div className={`p-3 ${compact ? 'p-2' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="bg-white text-black px-2 py-1 text-xs font-bold">
            {player.position}
          </div>
          {showSalary && (
            <div className="text-white text-xs font-bold">${player.salary.toLocaleString()}</div>
          )}
        </div>
        
        <h3 className={`subtitle-artistic leading-tight mb-1 ${compact ? 'text-xs' : 'text-xs'}`}>
          {player.name}
        </h3>
        <p className={`text-artistic mb-2 text-gray-400 ${compact ? 'text-xs' : 'text-xs'}`}>
          {player.team}
        </p>
        
        {stats && (
          <div className={`bg-black border border-white rounded space-y-1 ${compact ? 'p-1' : 'p-2'}`}>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">PTS</span>
              <span className="text-white font-bold">{stats.pts}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">REB</span>
              <span className="text-white font-bold">{stats.reb}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">AST</span>
              <span className="text-white font-bold">{stats.ast}</span>
            </div>
            <div className={`border-t border-white pt-1 mt-1 flex justify-between text-xs ${compact ? '' : 'flex'}`}>
              <span className="text-yellow-400 font-bold">FPTS</span>
              <span className="text-yellow-400 font-bold">{stats.fantasyPoints}</span>
            </div>
            <div className="flex justify-center">
              <span className={`text-xs ${getTrendColor(stats.trend)}`}>
                {getTrendIcon(stats.trend)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





