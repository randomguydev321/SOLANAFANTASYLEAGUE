// NBA Stats API integration for live player data
export interface NBAPlayerStats {
  playerId: string;
  name: string;
  team: string;
  position: string;
  salary: number;
  // Live stats
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fg: number;
  fga: number;
  ft: number;
  fta: number;
  // Calculated fantasy points
  fantasyPoints: number;
  // Game info
  gameDate: string;
  opponent: string;
  isPlaying: boolean;
}

export class NBAStatsService {
  private static instance: NBAStatsService;
  private cache: Map<string, NBAPlayerStats> = new Map();
  private lastUpdate: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): NBAStatsService {
    if (!NBAStatsService.instance) {
      NBAStatsService.instance = new NBAStatsService();
    }
    return NBAStatsService.instance;
  }

  // Calculate fantasy points based on standard scoring
  private calculateFantasyPoints(stats: any): number {
    const points = stats.pts || 0;
    const rebounds = stats.reb || 0;
    const assists = stats.ast || 0;
    const steals = stats.stl || 0;
    const blocks = stats.blk || 0;
    const turnovers = stats.to || 0;
    const fgMade = stats.fg || 0;
    const fgMissed = (stats.fga || 0) - (stats.fg || 0);
    const ftMade = stats.ft || 0;
    const ftMissed = (stats.fta || 0) - (stats.ft || 0);

    // Standard fantasy scoring
    return (points * 1) + 
           (rebounds * 1.2) + 
           (assists * 1.5) + 
           (steals * 2) + 
           (blocks * 2) + 
           (turnovers * -1) + 
           (fgMissed * -0.5) + 
           (ftMissed * -0.5);
  }

  // Fetch live stats from NBA API - NO MOCK DATA
  async getLiveStats(): Promise<NBAPlayerStats[]> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (now - this.lastUpdate < this.CACHE_DURATION && this.cache.size > 0) {
      return Array.from(this.cache.values());
    }

    try {
      // Try to fetch from backend API first
      const response = await fetch('http://localhost:3001/api/live-stats');
      if (response.ok) {
        const liveStats = await response.json();
        // Cache the data
        this.cache.clear();
        liveStats.forEach((stat: NBAPlayerStats) => {
          this.cache.set(stat.playerId, stat);
        });
        this.lastUpdate = now;
        return liveStats;
      }
    } catch (error) {
      console.log('Backend API not available, using empty stats');
    }

    // Return empty array if no API available - NO MOCK DATA
    return [];
  }

  // Get stats for specific player
  async getPlayerStats(playerId: string): Promise<NBAPlayerStats | null> {
    const allStats = await this.getLiveStats();
    return allStats.find(player => player.playerId === playerId) || null;
  }

  // Get players by position
  async getPlayersByPosition(position: string): Promise<NBAPlayerStats[]> {
    const allStats = await this.getLiveStats();
    return allStats.filter(player => player.position === position);
  }

  // Get top performers
  async getTopPerformers(limit: number = 10): Promise<NBAPlayerStats[]> {
    const allStats = await this.getLiveStats();
    return allStats
      .sort((a, b) => b.fantasyPoints - a.fantasyPoints)
      .slice(0, limit);
  }
}

export default NBAStatsService;
