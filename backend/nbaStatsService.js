// NBA Stats Service - NO MOCK DATA
import fetch from 'node-fetch';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class NBAStatsService {
  static instance;
  cachedStats = [];
  lastFetchTime = 0;
  CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for live games, 5 minutes otherwise
  FULL_REFRESH_DURATION = 60 * 60 * 1000; // 1 hour for full refresh
  lastFullRefreshTime = 0;

  constructor() {}

  static getInstance() {
    if (!NBAStatsService.instance) {
      NBAStatsService.instance = new NBAStatsService();
    }
    return NBAStatsService.instance;
  }

  // Helper to calculate fantasy points
  calculateFantasyPoints(stats) {
    // Fantasy Points = PTS + (REB * 1.2) + (AST * 1.5) + (STL * 3) + (BLK * 3) + (TO * -1)
    return stats.pts +
           (stats.reb * 1.2) +
           (stats.ast * 1.5) +
           (stats.stl * 3) +
           (stats.blk * 3) -
           (stats.to * 1);
  }

  // Fetch player weekly stats from NBA API (2025-2026 season)
  async fetchPlayerWeeklyStats(nbaPlayerId) {
    try {
      const season = '2025-26'; // Current NBA season
      const url = `https://stats.nba.com/stats/playerdashboardbyyearoveryear?DateFrom=&DateTo=&GameSegment=&LastNGames=7&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=${nbaPlayerId}&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&VsConference=&VsDivision=`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://stats.nba.com/',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site'
        },
        timeout: 10000
      });
      
      const data = response.data;
      if (data.resultSets && data.resultSets[0] && data.resultSets[0].rowSet.length > 0) {
        const weeklyStats = data.resultSets[0].rowSet[0];
        const headers = data.resultSets[0].headers;

        const getStat = (header) => {
          const index = headers.indexOf(header);
          return index !== -1 ? parseFloat(weeklyStats[index]) || 0 : 0;
        };

        const stats = {
          pts: getStat('PTS'),
          reb: getStat('REB'),
          ast: getStat('AST'),
          stl: getStat('STL'),
          blk: getStat('BLK'),
          turnovers: getStat('TOV'),
          fgm: getStat('FGM'),
          fga: getStat('FGA'),
          ftm: getStat('FTM'),
          fta: getStat('FTA'),
          gamesPlayed: getStat('GP'),
          minutes: getStat('MIN'),
          isPlaying: getStat('GP') > 0 // Playing if games played > 0
        };
        
        const fantasyPoints = this.calculateFantasyPoints(stats);
        return { ...stats, fantasyPoints };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching weekly stats for player ${nbaPlayerId}:`, error.message);
      return null;
    }
  }

  // Get live game status from NBA CDN
  async getLiveGameStatus() {
    try {
      const url = `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
      const response = await axios.get(url);
      const data = response.data;
      if (data.scoreboard && data.scoreboard.games) {
        return data.scoreboard.games.map(game => ({
          gameId: game.gameId,
          gameStatus: game.gameStatus, // 1: Scheduled, 2: Live, 3: Final
          gameStatusText: game.gameStatusText,
          homeTeamId: game.homeTeam.teamId,
          awayTeamId: game.awayTeam.teamId,
          homeTeamScore: game.homeTeam.score,
          awayTeamScore: game.awayTeam.score,
          players: [...game.homeTeam.players, ...game.awayTeam.players].map(p => ({
            playerId: p.personId,
            isPlaying: p.status === 'ACTIVE' // Simplified check
          }))
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching live game status:', error.message);
      return [];
    }
  }

  // Main function to get live stats, prioritizing real-time sources
  async getLiveStats(forceRefresh = false) {
    const now = Date.now();
    const hasLiveGames = (await this.getLiveGameStatus()).some(game => game.gameStatus === 2);
    const currentCacheDuration = 24 * 60 * 60 * 1000; // 24 hours for live stats

    if (!forceRefresh && this.cachedStats.length > 0 && (now - this.lastFetchTime < currentCacheDuration)) {
      return this.cachedStats;
    }

    console.log('Fetching weekly NBA stats for 24-hour competition...');
    const allPlayers = await pool.query('SELECT id, nba_id, name, team, position, salary FROM players');
    const liveStatsPromises = allPlayers.rows.map(async (player) => {
      let stats = null;
      
      // Try to fetch weekly stats from NBA API (last 7 games)
      stats = await this.fetchPlayerWeeklyStats(player.nba_id);

      if (stats) {
        // Update DB
        await pool.query(
          `INSERT INTO player_stats (player_id, game_date, pts, reb, ast, stl, blk, "to", fgm, fga, ftm, fta, fantasy_points, is_playing)
           VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (player_id, game_date) DO UPDATE SET
           pts = EXCLUDED.pts, reb = EXCLUDED.reb, ast = EXCLUDED.ast, stl = EXCLUDED.stl, blk = EXCLUDED.blk, "to" = EXCLUDED."to",
           fgm = EXCLUDED.fgm, fga = EXCLUDED.fga, ftm = EXCLUDED.ftm, fta = EXCLUDED.fta, fantasy_points = EXCLUDED.fantasy_points, is_playing = EXCLUDED.is_playing;`,
          [player.id, stats.pts, stats.reb, stats.ast, stats.stl, stats.blk, stats.turnovers, stats.fgm, stats.fga, stats.ftm, stats.fta, stats.fantasyPoints, stats.isPlaying]
        );
        return { playerId: player.id, name: player.name, team: player.team, position: player.position, ...stats };
      }
      
      // If no live stats, try to get from DB
      const dbStats = await pool.query('SELECT * FROM player_stats WHERE player_id = $1 AND game_date = CURRENT_DATE ORDER BY updated_at DESC LIMIT 1', [player.id]);
      if (dbStats.rows.length > 0) {
        return { playerId: player.id, name: player.name, team: player.team, position: player.position, ...dbStats.rows[0] };
      }
      
      // Return empty stats if no data available - NO MOCK DATA
      return { playerId: player.id, name: player.name, team: player.team, position: player.position, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnovers: 0, fgm: 0, fga: 0, ftm: 0, fta: 0, fantasyPoints: 0, isPlaying: false };
    });

    this.cachedStats = (await Promise.all(liveStatsPromises)).filter(s => s !== null);
    this.lastFetchTime = now;
    return this.cachedStats;
  }

  async getTopPerformers(limit = 10) {
    const result = await pool.query(`
      SELECT ps.*, p.name, p.team, p.position 
      FROM player_stats ps 
      JOIN players p ON ps.player_id = p.id 
      WHERE ps.game_date = CURRENT_DATE
      ORDER BY ps.fantasy_points DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getTeamStats(teamName) {
    const result = await pool.query(`
      SELECT SUM(pts) as total_pts, SUM(reb) as total_reb, SUM(ast) as total_ast
      FROM player_stats ps
      JOIN players p ON ps.player_id = p.id
      WHERE p.team ILIKE $1 AND ps.game_date = CURRENT_DATE
    `, [`%${teamName}%`]);
    return result.rows[0];
  }
}

export default NBAStatsService;
