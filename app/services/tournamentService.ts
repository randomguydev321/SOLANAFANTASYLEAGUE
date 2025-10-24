// Tournament management for 24-hour cycles
export interface Tournament {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  lineupDeadline: Date; // 2 hours before start
  entryFee: number; // in SOL
  prizePool: number; // in SOL
  participants: string[]; // wallet addresses
  matchups: TournamentMatchup[]; // wallet vs wallet matchups
  status: 'upcoming' | 'active' | 'completed';
  winner?: string;
  results?: TournamentResult[];
}

export interface TournamentMatchup {
  id: string;
  wallet1: string;
  wallet2: string;
  wallet1Lineup?: UserLineup;
  wallet2Lineup?: UserLineup;
  wallet1Score: number;
  wallet2Score: number;
  winner?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface TournamentResult {
  walletAddress: string;
  lineup: {
    PG: string;
    SG: string;
    SF: string;
    PF: string;
    C: string;
  };
  totalFantasyPoints: number;
  rank: number;
  prize: number; // in SOL
}

export interface UserLineup {
  walletAddress: string;
  tournamentId: string;
  lineup: {
    PG: string;
    SG: string;
    SF: string;
    PF: string;
    C: string;
  };
  totalSalary: number;
  registeredAt: Date;
}

export class TournamentService {
  private static instance: TournamentService;
  private tournaments: Map<string, Tournament> = new Map();
  private userLineups: Map<string, UserLineup> = new Map();
  private readonly TOURNAMENT_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): TournamentService {
    if (!TournamentService.instance) {
      TournamentService.instance = new TournamentService();
    }
    return TournamentService.instance;
  }

  // Create a new tournament
  createTournament(name: string, entryFee: number): Tournament {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // Start in 1 hour
    const lineupDeadline = new Date(startTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before start
    const endTime = new Date(startTime.getTime() + this.TOURNAMENT_DURATION);

    const tournament: Tournament = {
      id: `tournament_${Date.now()}`,
      name,
      startTime,
      endTime,
      lineupDeadline,
      entryFee,
      prizePool: 0,
      participants: [],
      matchups: [],
      status: 'upcoming'
    };

    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  // Get current active tournament
  getCurrentTournament(): Tournament | null {
    const now = new Date();
    
    for (const tournament of this.tournaments.values()) {
      if (tournament.status === 'active' && 
          tournament.startTime <= now && 
          tournament.endTime > now) {
        return tournament;
      }
    }
    return null;
  }

  // Get upcoming tournaments
  getUpcomingTournaments(): Tournament[] {
    const now = new Date();
    return Array.from(this.tournaments.values())
      .filter(t => t.status === 'upcoming' && t.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Register user lineup for tournament
  registerLineup(
    walletAddress: string, 
    tournamentId: string, 
    lineup: { PG: string; SG: string; SF: string; PF: string; C: string },
    totalSalary: number
  ): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'upcoming') {
      return false;
    }

    // Check if lineup deadline has passed
    const now = new Date();
    if (now > tournament.lineupDeadline) {
      return false; // Too late to register
    }

    // Check if user already registered
    const existingLineup = this.userLineups.get(`${walletAddress}_${tournamentId}`);
    if (existingLineup) {
      return false;
    }

    // Validate salary cap
    if (totalSalary > 20) {
      return false;
    }

    // Register lineup
    const userLineup: UserLineup = {
      walletAddress,
      tournamentId,
      lineup,
      totalSalary,
      registeredAt: new Date()
    };

    this.userLineups.set(`${walletAddress}_${tournamentId}`, userLineup);
    
    // Add to tournament participants
    if (!tournament.participants.includes(walletAddress)) {
      tournament.participants.push(walletAddress);
      tournament.prizePool += tournament.entryFee;
      
      // Try to create matchups as players register
      this.createRandomMatchups(tournament);
    }

    return true;
  }

  // Start tournament (called by cron job)
  startTournament(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'upcoming') {
      return false;
    }

    // Final matchup creation before tournament starts
    this.createRandomMatchups(tournament);
    
    // Replace wallets without lineups
    this.replaceWalletsWithoutLineups(tournament);

    tournament.status = 'active';
    return true;
  }

  // Create random matchups for tournament
  private createRandomMatchups(tournament: Tournament): void {
    const participants = tournament.participants;
    const existingMatchups = tournament.matchups;
    
    // Get wallets that are already matched
    const matchedWallets = new Set<string>();
    existingMatchups.forEach(matchup => {
      matchedWallets.add(matchup.wallet1);
      matchedWallets.add(matchup.wallet2);
    });
    
    // Get unmatched wallets
    const unmatchedWallets = participants.filter(wallet => !matchedWallets.has(wallet));
    
    // Create new matchups with remaining wallets
    while (unmatchedWallets.length >= 2) {
      // Randomly select two wallets
      const randomIndex1 = Math.floor(Math.random() * unmatchedWallets.length);
      const wallet1 = unmatchedWallets.splice(randomIndex1, 1)[0];
      
      const randomIndex2 = Math.floor(Math.random() * unmatchedWallets.length);
      const wallet2 = unmatchedWallets.splice(randomIndex2, 1)[0];
      
      // Create matchup
      const matchup: TournamentMatchup = {
        id: `matchup_${tournament.id}_${Date.now()}_${Math.random()}`,
        wallet1,
        wallet2,
        wallet1Score: 0,
        wallet2Score: 0,
        status: 'pending'
      };
      
      tournament.matchups.push(matchup);
    }
  }

  // Replace wallets without lineups with new opponents
  private replaceWalletsWithoutLineups(tournament: Tournament): void {
    const now = new Date();
    
    // Check if lineup deadline has passed
    if (now <= tournament.lineupDeadline) {
      return; // Still within deadline
    }
    
    // Find wallets without lineups
    const walletsWithoutLineups: string[] = [];
    tournament.matchups.forEach(matchup => {
      const wallet1Lineup = this.userLineups.get(`${matchup.wallet1}_${tournament.id}`);
      const wallet2Lineup = this.userLineups.get(`${matchup.wallet2}_${tournament.id}`);
      
      if (!wallet1Lineup) {
        walletsWithoutLineups.push(matchup.wallet1);
      }
      if (!wallet2Lineup) {
        walletsWithoutLineups.push(matchup.wallet2);
      }
    });
    
    // Remove wallets without lineups from matchups
    tournament.matchups = tournament.matchups.filter(matchup => {
      const wallet1Lineup = this.userLineups.get(`${matchup.wallet1}_${tournament.id}`);
      const wallet2Lineup = this.userLineups.get(`${matchup.wallet2}_${tournament.id}`);
      
      return wallet1Lineup && wallet2Lineup;
    });
    
    // Remove from participants and refund entry fee
    walletsWithoutLineups.forEach(wallet => {
      const index = tournament.participants.indexOf(wallet);
      if (index > -1) {
        tournament.participants.splice(index, 1);
        tournament.prizePool -= tournament.entryFee;
      }
    });
    
    // Create new matchups with remaining wallets
    this.createRandomMatchups(tournament);
  }

  // End tournament and calculate results
  async endTournament(tournamentId: string): Promise<TournamentResult[]> {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'active') {
      return [];
    }

    // Get all lineups for this tournament
    const lineups = Array.from(this.userLineups.values())
      .filter(lineup => lineup.tournamentId === tournamentId);

    // Calculate fantasy points for each lineup
    const results: TournamentResult[] = [];
    
    for (const lineup of lineups) {
      const totalFantasyPoints = await this.calculateLineupPoints(lineup.lineup);
      
      results.push({
        walletAddress: lineup.walletAddress,
        lineup: lineup.lineup,
        totalFantasyPoints,
        rank: 0, // Will be set after sorting
        prize: 0 // Will be calculated based on rank
      });
    }

    // Sort by fantasy points (descending)
    results.sort((a, b) => b.totalFantasyPoints - a.totalFantasyPoints);

    // Assign ranks and prizes
    const totalPrizePool = tournament.prizePool;
    const participantCount = results.length;

    results.forEach((result, index) => {
      result.rank = index + 1;
      
      // Prize distribution: 1st gets 50%, 2nd gets 30%, 3rd gets 20%
      if (index === 0) {
        result.prize = totalPrizePool * 0.5; // 50%
      } else if (index === 1) {
        result.prize = totalPrizePool * 0.3; // 30%
      } else if (index === 2) {
        result.prize = totalPrizePool * 0.2; // 20%
      } else {
        result.prize = 0;
      }
    });

    // Update tournament
    tournament.status = 'completed';
    tournament.results = results;
    tournament.winner = results[0]?.walletAddress;

    return results;
  }

  // Calculate total fantasy points for a lineup
  private async calculateLineupPoints(lineup: { PG: string; SG: string; SF: string; PF: string; C: string }): Promise<number> {
    // Import NBA stats service
    const { NBAStatsService } = await import('./nbaStatsService');
    const statsService = NBAStatsService.getInstance();

    let totalPoints = 0;
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

    for (const position of positions) {
      const playerId = lineup[position];
      const playerStats = await statsService.getPlayerStats(playerId);
      if (playerStats) {
        totalPoints += playerStats.fantasyPoints;
      }
    }

    return totalPoints;
  }

  // Get user's lineup for a tournament
  getUserLineup(walletAddress: string, tournamentId: string): UserLineup | null {
    return this.userLineups.get(`${walletAddress}_${tournamentId}`) || null;
  }

  // Get tournament results
  getTournamentResults(tournamentId: string): TournamentResult[] {
    const tournament = this.tournaments.get(tournamentId);
    return tournament?.results || [];
  }

  // Get user's matchup for a tournament
  getUserMatchup(walletAddress: string, tournamentId: string): TournamentMatchup | null {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return null;
    
    return tournament.matchups.find(matchup => 
      matchup.wallet1 === walletAddress || matchup.wallet2 === walletAddress
    ) || null;
  }

  // Check if lineup deadline has passed
  isLineupDeadlinePassed(tournamentId: string): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return true;
    
    const now = new Date();
    return now > tournament.lineupDeadline;
  }

  // Get time remaining until lineup deadline
  getTimeUntilDeadline(tournamentId: string): number {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return 0;
    
    const now = new Date();
    const timeRemaining = tournament.lineupDeadline.getTime() - now.getTime();
    return Math.max(0, timeRemaining);
  }

  // Initialize with a default tournament
  initializeDefaultTournament(): void {
    const tournament = this.createTournament("Daily NBA Fantasy", 0.1); // 0.1 SOL entry
    console.log('Created default tournament:', tournament.id);
  }
}

export default TournamentService;
