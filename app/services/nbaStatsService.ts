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

  // Fetch live stats from NBA API (mock implementation)
  async getLiveStats(): Promise<NBAPlayerStats[]> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (now - this.lastUpdate < this.CACHE_DURATION && this.cache.size > 0) {
      return Array.from(this.cache.values());
    }

    try {
      // Mock live data - in production, replace with real NBA API
      const liveStats: NBAPlayerStats[] = [
        {
          playerId: "1629029",
          name: "LUKA DONCIC",
          team: "MAVERICKS",
          position: "PG",
          salary: 5,
          pts: 32.4,
          reb: 8.2,
          ast: 9.1,
          stl: 1.4,
          blk: 0.5,
          to: 3.8,
          fg: 12.1,
          fga: 24.3,
          ft: 6.8,
          fta: 8.1,
          fantasyPoints: this.calculateFantasyPoints({ pts: 32.4, reb: 8.2, ast: 9.1, stl: 1.4, blk: 0.5, to: 3.8, fg: 12.1, fga: 24.3, ft: 6.8, fta: 8.1 }),
          gameDate: new Date().toISOString().split('T')[0],
          opponent: "WARRIORS",
          isPlaying: true
        },
        {
          playerId: "201939",
          name: "STEPHEN CURRY",
          team: "WARRIORS",
          position: "PG",
          salary: 5,
          pts: 28.7,
          reb: 4.3,
          ast: 6.8,
          stl: 1.2,
          blk: 0.3,
          to: 3.1,
          fg: 10.2,
          fga: 20.1,
          ft: 4.8,
          fta: 5.2,
          fantasyPoints: this.calculateFantasyPoints({ pts: 28.7, reb: 4.3, ast: 6.8, stl: 1.2, blk: 0.3, to: 3.1, fg: 10.2, fga: 20.1, ft: 4.8, fta: 5.2 }),
          gameDate: new Date().toISOString().split('T')[0],
          opponent: "MAVERICKS",
          isPlaying: true
        },
        {
          playerId: "1628983",
          name: "SHAI GILGEOUS-ALEXANDER",
          team: "THUNDER",
          position: "PG",
          salary: 5,
          pts: 30.1,
          reb: 5.5,
          ast: 6.3,
          stl: 1.3,
          blk: 1.0,
          to: 2.8,
          fg: 11.4,
          fga: 22.8,
          ft: 6.1,
          fta: 6.9,
          fantasyPoints: this.calculateFantasyPoints({ pts: 30.1, reb: 5.5, ast: 6.3, stl: 1.3, blk: 1.0, to: 2.8, fg: 11.4, fga: 22.8, ft: 6.1, fta: 6.9 }),
          gameDate: new Date().toISOString().split('T')[0],
          opponent: "LAKERS",
          isPlaying: true
        },
        // Add more players...
      ];

      // Update cache
      this.cache.clear();
      liveStats.forEach(player => {
        this.cache.set(player.playerId, player);
      });
      this.lastUpdate = now;

      return liveStats;
    } catch (error) {
      console.error('Error fetching live NBA stats:', error);
      // Return cached data if available, otherwise empty array
      return Array.from(this.cache.values());
    }
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
