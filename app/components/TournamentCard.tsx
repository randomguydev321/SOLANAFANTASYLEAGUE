'use client';

interface Tournament {
  id: number;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  startTime: Date;
  endTime: Date;
  type: 'weekly' | 'daily' | 'head-to-head' | 'survivor';
  status: 'upcoming' | 'active' | 'completed';
}

interface TournamentCardProps {
  tournament: Tournament;
  onEnter: (tournamentId: number) => void;
  loading?: boolean;
}

export default function TournamentCard({ tournament, onEnter, loading = false }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-yellow-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly': return '📅';
      case 'daily': return '⚡';
      case 'head-to-head': return '⚔️';
      case 'survivor': return '🏃';
      default: return '🏆';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    } else {
      return `Starts in ${minutes}m`;
    }
  };

  const getProgressPercentage = () => {
    return (tournament.participants / tournament.maxParticipants) * 100;
  };

  return (
    <div className="card-artistic">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTypeIcon(tournament.type)}</span>
          <h3 className="subtitle-artistic text-lg">{tournament.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded text-xs font-bold ${getStatusColor(tournament.status)}`}>
          {tournament.status.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-artistic text-sm">ENTRY FEE:</span>
          <span className="subtitle-artistic text-sm">{tournament.entryFee} BNB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-artistic text-sm">PRIZE POOL:</span>
          <span className="subtitle-artistic text-sm text-yellow-400">{tournament.prizePool} BNB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-artistic text-sm">PARTICIPANTS:</span>
          <span className="subtitle-artistic text-sm">{tournament.participants}/{tournament.maxParticipants}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-artistic text-sm">TYPE:</span>
          <span className="subtitle-artistic text-sm">{tournament.type.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-artistic text-sm">START:</span>
          <span className="subtitle-artistic text-sm">{formatTime(tournament.startTime)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>PARTICIPANTS</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{width: `${getProgressPercentage()}%`}}
          ></div>
        </div>
      </div>
      
      <button
        onClick={() => onEnter(tournament.id)}
        disabled={tournament.status !== 'upcoming' || loading || tournament.participants >= tournament.maxParticipants}
        className={`w-full btn-artistic ${
          tournament.status !== 'upcoming' || loading || tournament.participants >= tournament.maxParticipants 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ENTERING...
          </span>
        ) : tournament.status === 'upcoming' && tournament.participants < tournament.maxParticipants ? (
          `ENTER (${tournament.entryFee} BNB)`
        ) : tournament.participants >= tournament.maxParticipants ? (
          'FULL'
        ) : (
          'NOT AVAILABLE'
        )}
      </button>
    </div>
  );
}





