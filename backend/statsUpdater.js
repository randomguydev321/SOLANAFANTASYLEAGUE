// Real-Time NBA Stats Updater
import cron from 'node-cron';
import { Pool } from 'pg';
import NBAStatsService from './nbaStatsService.js';
import dotenv from 'dotenv';

dotenv.config();

class StatsUpdater {
  static instance;
  db;
  nbaStatsService;
  isRunning = false;

  constructor() {
    // Initialize database connection
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.nbaStatsService = NBAStatsService.getInstance();
    this.setupCronJobs();
  }

  static getInstance() {
    if (!StatsUpdater.instance) {
      StatsUpdater.instance = new StatsUpdater();
    }
    return StatsUpdater.instance;
  }

  setupCronJobs() {
    console.log('Setting up NBA stats update cron jobs...');
    
    // Update daily stats every day at 6 AM EST
    cron.schedule('0 6 * * *', async () => {
      console.log('Running daily NBA stats update...');
      await this.updateStats();
    }, {
      timezone: "America/New_York"
    });

    // Daily cleanup at 3 AM EST
    cron.schedule('0 3 * * *', async () => {
      console.log('Running daily cleanup...');
      await this.cleanupOldStats();
    }, {
      timezone: "America/New_York"
    });
  }

  async updateStats() {
    if (this.isRunning) {
      console.log('Stats update already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting NBA daily stats update...');

    try {
      const liveStats = await this.nbaStatsService.getLiveStats(true);
      console.log(`Updated stats for ${liveStats.length} players`);
      
      // Update database with new stats
      for (const stat of liveStats) {
        await this.db.query(
          `INSERT INTO player_stats (player_id, game_date, pts, reb, ast, stl, blk, "to", fgm, fga, ftm, fta, fantasy_points, is_playing)
           VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (player_id, game_date) DO UPDATE SET
           pts = EXCLUDED.pts, reb = EXCLUDED.reb, ast = EXCLUDED.ast, stl = EXCLUDED.stl, blk = EXCLUDED.blk, "to" = EXCLUDED."to",
           fgm = EXCLUDED.fgm, fga = EXCLUDED.fga, ftm = EXCLUDED.ftm, fta = EXCLUDED.fta, fantasy_points = EXCLUDED.fantasy_points, is_playing = EXCLUDED.is_playing,
           updated_at = CURRENT_TIMESTAMP`,
          [stat.playerId, stat.pts || 0, stat.reb || 0, stat.ast || 0, stat.stl || 0, stat.blk || 0, stat.turnovers || 0, 
           stat.fgm || 0, stat.fga || 0, stat.ftm || 0, stat.fta || 0, stat.fantasyPoints || 0, stat.isPlaying || false]
        );
      }
      
      console.log('NBA daily stats update completed successfully');
    } catch (error) {
      console.error('Error updating NBA stats:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async cleanupOldStats() {
    try {
      // Delete stats older than 7 days
      const result = await this.db.query(
        'DELETE FROM player_stats WHERE game_date < CURRENT_DATE - INTERVAL \'7 days\''
      );
      console.log(`Cleaned up ${result.rowCount} old stat records`);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async start() {
    console.log('NBA Stats Updater started');
    // Run initial update
    await this.updateStats();
  }

  async stop() {
    console.log('NBA Stats Updater stopped');
    await this.db.end();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Next update in 5 minutes
    };
  }
}

// If this script is run directly, start the updater
if (process.argv[1].includes('statsUpdater.js')) {
  console.log('Starting NBA Stats Updater...');
  const updater = StatsUpdater.getInstance();
  updater.start();
}

export default StatsUpdater;