// Real-Time NBA Stats Updater
import cron from 'node-cron';
import { Pool } from 'pg';
import NBAStatsService from './nbaStatsService.js';
import dotenv from 'dotenv';

dotenv.config();

class StatsUpdater {
  private static instance: StatsUpdater;
  private db: Pool;
  private nbaStatsService: NBAStatsService;
  private isRunning: boolean = false;

  private constructor() {
    // Initialize database connection
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
      ssl: {
        rejectUnauthorized: false
      }
    });

    this.nbaStatsService = NBAStatsService.getInstance();
    this.setupCronJobs();
  }

  public static getInstance(): StatsUpdater {
    if (!StatsUpdater.instance) {
      StatsUpdater.instance = new StatsUpdater();
    }
    return StatsUpdater.instance;
  }

  // Setup automated cron jobs
  private setupCronJobs(): void {
    console.log('🕐 Setting up NBA stats update schedules...');

    // Update stats every 2 minutes during NBA games (6 PM - 2 AM EST)
    cron.schedule('*/2 * 18-23,0-2 * * *', () => {
      this.updateStats('Live game update');
    }, {
      timezone: 'America/New_York'
    });

    // Update stats every 5 minutes during other hours
    cron.schedule('*/5 * * * *', () => {
      this.updateStats('Regular update');
    });

    // Full refresh every hour
    cron.schedule('0 * * * *', () => {
      this.updateStats('Hourly refresh');
    });

    // Daily cleanup and summary at 3 AM EST
    cron.schedule('0 3 * * *', () => {
      this.dailyCleanup();
    }, {
      timezone: 'America/New_York'
    });

    console.log('✅ Cron jobs scheduled successfully');
  }

  // Main stats update function
  async updateStats(reason: string = 'Manual update'): Promise<void> {
    if (this.isRunning) {
      console.log('⏳ Stats update already running, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log(`🔄 Starting stats update: ${reason}`);

      // Fetch live stats from NBA APIs
      const liveStats = await this.nbaStatsService.getLiveStats();
      
      if (liveStats.length === 0) {
        console.log('⚠️ No live stats available');
        return;
      }

      // Update database with new stats
      await this.updateDatabaseStats(liveStats);

      // Update tournament scores if any tournaments are active
      await this.updateTournamentScores();

      const duration = Date.now() - startTime;
      console.log(`✅ Stats update completed in ${duration}ms - Updated ${liveStats.length} players`);

    } catch (error) {
      console.error('❌ Error updating stats:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Update player stats in database
  private async updateDatabaseStats(stats: any[]): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      for (const stat of stats) {
        // Insert or update player stats
        await client.query(`
          INSERT INTO player_stats (
            player_id, pts, reb, ast, stl, blk, turnovers, fg_made, fg_attempted,
            ft_made, ft_attempted, fantasy_points, game_date, opponent, is_playing,
            minutes, plus_minus, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
          ON CONFLICT (player_id, game_date) 
          DO UPDATE SET 
            pts = EXCLUDED.pts,
            reb = EXCLUDED.reb,
            ast = EXCLUDED.ast,
            stl = EXCLUDED.stl,
            blk = EXCLUDED.blk,
            turnovers = EXCLUDED.turnovers,
            fg_made = EXCLUDED.fg_made,
            fg_attempted = EXCLUDED.fg_attempted,
            ft_made = EXCLUDED.ft_made,
            ft_attempted = EXCLUDED.ft_attempted,
            fantasy_points = EXCLUDED.fantasy_points,
            opponent = EXCLUDED.opponent,
            is_playing = EXCLUDED.is_playing,
            minutes = EXCLUDED.minutes,
            plus_minus = EXCLUDED.plus_minus,
            updated_at = NOW()
        `, [
          stat.playerId, stat.pts, stat.reb, stat.ast, stat.stl, stat.blk,
          stat.turnovers, stat.fgMade, stat.fgAttempted, stat.ftMade,
          stat.ftAttempted, stat.fantasyPoints, stat.gameDate, stat.opponent,
          stat.isPlaying, stat.minutes, stat.plusMinus
        ]);

        // Update player table if needed
        await client.query(`
          INSERT INTO players (id, name, team, position, salary, nba_id, photo)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            team = EXCLUDED.team,
            position = EXCLUDED.position,
            salary = EXCLUDED.salary
        `, [
          stat.playerId, stat.name, stat.team, stat.position, 5, // Default salary
          stat.playerId, `https://cdn.nba.com/headshots/nba/latest/1040x760/${stat.playerId}.png`
        ]);
      }

      await client.query('COMMIT');
      console.log(`📊 Updated ${stats.length} player stats in database`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update tournament scores based on current player stats
  private async updateTournamentScores(): Promise<void> {
    const client = await this.db.connect();
    
    try {
      // Get active tournaments
      const activeTournaments = await client.query(`
        SELECT id FROM tournaments 
        WHERE status = 'active' AND start_time <= NOW() AND end_time > NOW()
      `);

      for (const tournament of activeTournaments.rows) {
        await this.updateTournamentScoresForTournament(client, tournament.id);
      }

    } catch (error) {
      console.error('Error updating tournament scores:', error);
    } finally {
      client.release();
    }
  }

  // Update scores for a specific tournament
  private async updateTournamentScoresForTournament(client: any, tournamentId: string): Promise<void> {
    try {
      // Get all lineups for this tournament
      const lineups = await client.query(`
        SELECT ul.*, ps.fantasy_points
        FROM user_lineups ul
        LEFT JOIN player_stats ps ON (
          ps.player_id IN (ul.pg_player_id, ul.sg_player_id, ul.sf_player_id, ul.pf_player_id, ul.c_player_id)
          AND ps.game_date = CURRENT_DATE
        )
        WHERE ul.tournament_id = $1
      `, [tournamentId]);

      // Calculate total scores for each lineup
      const lineupScores = new Map();
      
      for (const lineup of lineups.rows) {
        const lineupId = lineup.id;
        if (!lineupScores.has(lineupId)) {
          lineupScores.set(lineupId, {
            walletAddress: lineup.wallet_address,
            totalScore: 0,
            lineup: lineup
          });
        }
        
        if (lineup.fantasy_points) {
          lineupScores.get(lineupId).totalScore += lineup.fantasy_points;
        }
      }

      // Update matchup scores
      for (const [lineupId, data] of lineupScores) {
        await client.query(`
          UPDATE tournament_matchups 
          SET 
            wallet1_score = CASE WHEN wallet1 = $1 THEN $2 ELSE wallet1_score END,
            wallet2_score = CASE WHEN wallet2 = $1 THEN $2 ELSE wallet2_score END,
            updated_at = NOW()
          WHERE tournament_id = $3 AND (wallet1 = $1 OR wallet2 = $1)
        `, [data.walletAddress, data.totalScore, tournamentId]);
      }

      console.log(`🏆 Updated scores for tournament ${tournamentId}`);

    } catch (error) {
      console.error(`Error updating tournament ${tournamentId}:`, error);
    }
  }

  // Daily cleanup and maintenance
  private async dailyCleanup(): Promise<void> {
    console.log('🧹 Running daily cleanup...');
    
    try {
      const client = await this.db.connect();
      
      // Archive old player stats (keep last 30 days)
      await client.query(`
        DELETE FROM player_stats 
        WHERE game_date < CURRENT_DATE - INTERVAL '30 days'
      `);

      // Update completed tournaments
      await client.query(`
        UPDATE tournaments 
        SET status = 'completed' 
        WHERE status = 'active' AND end_time < NOW()
      `);

      // Clean up old matchups
      await client.query(`
        DELETE FROM tournament_matchups 
        WHERE tournament_id IN (
          SELECT id FROM tournaments WHERE status = 'completed' AND end_time < NOW() - INTERVAL '7 days'
        )
      `);

      console.log('✅ Daily cleanup completed');
      client.release();

    } catch (error) {
      console.error('Error during daily cleanup:', error);
    }
  }

  // Manual trigger for immediate update
  async triggerUpdate(): Promise<void> {
    console.log('🚀 Manual stats update triggered');
    await this.updateStats('Manual trigger');
  }

  // Get update status
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.nbaStatsService.lastFetchTime,
      cacheSize: this.nbaStatsService.cachedStats.size
    };
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down stats updater...');
    await this.db.end();
  }
}

// Export singleton instance
export default StatsUpdater;

// If running directly, start the updater
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = StatsUpdater.getInstance();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await updater.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await updater.shutdown();
    process.exit(0);
  });

  console.log('🏀 NBA Stats Updater started successfully!');
}