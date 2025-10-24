// Backend API server for NBA Fantasy League
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import NBAStatsService from './nbaStatsService.js';
import StatsUpdater from './statsUpdater.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: false
});

// Initialize services
const nbaStatsService = NBAStatsService.getInstance();
const statsUpdater = StatsUpdater.getInstance();

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        team VARCHAR(50) NOT NULL,
        position VARCHAR(10) NOT NULL,
        salary INTEGER NOT NULL,
        nba_id VARCHAR(20) NOT NULL,
        photo TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Player stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id SERIAL PRIMARY KEY,
        player_id INTEGER NOT NULL,
        pts DECIMAL(5,2) NOT NULL,
        reb DECIMAL(5,2) NOT NULL,
        ast DECIMAL(5,2) NOT NULL,
        stl DECIMAL(5,2) NOT NULL,
        blk DECIMAL(5,2) NOT NULL,
        turnovers DECIMAL(5,2) NOT NULL,
        fg_made DECIMAL(5,2) NOT NULL,
        fg_attempted DECIMAL(5,2) NOT NULL,
        ft_made DECIMAL(5,2) NOT NULL,
        ft_attempted DECIMAL(5,2) NOT NULL,
        fantasy_points DECIMAL(8,2) NOT NULL,
        game_date DATE NOT NULL,
        opponent VARCHAR(50) NOT NULL,
        is_playing BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players (id)
      )
    `);

    // Tournaments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        lineup_deadline TIMESTAMP NOT NULL,
        entry_fee DECIMAL(10,2) NOT NULL,
        prize_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User lineups table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_lineups (
        id VARCHAR(50) PRIMARY KEY,
        wallet_address VARCHAR(100) NOT NULL,
        tournament_id VARCHAR(50) NOT NULL,
        pg_player_id INTEGER NOT NULL,
        sg_player_id INTEGER NOT NULL,
        sf_player_id INTEGER NOT NULL,
        pf_player_id INTEGER NOT NULL,
        c_player_id INTEGER NOT NULL,
        total_salary INTEGER NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        FOREIGN KEY (pg_player_id) REFERENCES players (id),
        FOREIGN KEY (sg_player_id) REFERENCES players (id),
        FOREIGN KEY (sf_player_id) REFERENCES players (id),
        FOREIGN KEY (pf_player_id) REFERENCES players (id),
        FOREIGN KEY (c_player_id) REFERENCES players (id)
      )
    `);

    // Tournament matchups table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournament_matchups (
        id VARCHAR(50) PRIMARY KEY,
        tournament_id VARCHAR(50) NOT NULL,
        wallet1 VARCHAR(100) NOT NULL,
        wallet2 VARCHAR(100) NOT NULL,
        wallet1_score DECIMAL(8,2) NOT NULL DEFAULT 0,
        wallet2_score DECIMAL(8,2) NOT NULL DEFAULT 0,
        winner VARCHAR(100),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// API Routes

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id');
    res.json(result.rows);
    } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get players by position
app.get('/api/players/position/:position', async (req, res) => {
  try {
    const { position } = req.params;
    const result = await pool.query(
      'SELECT * FROM players WHERE position = $1 ORDER BY salary DESC',
      [position]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players by position:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get player stats
app.get('/api/player-stats/:playerId', async (req, res) => {
  try {
  const { playerId } = req.params;
    const result = await pool.query(
      'SELECT * FROM player_stats WHERE player_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [playerId]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, ps.pts, ps.reb, ps.ast, ps.stl, ps.blk, ps."to" as turnovers, ps.fgm, ps.fga, ps.ftm, ps.fta, ps.fantasy_points, ps.is_playing
      FROM players p
      LEFT JOIN player_stats ps ON p.id = ps.player_id AND ps.game_date = CURRENT_DATE
      ORDER BY p.position, p.salary DESC, p.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get live stats (real-time from NBA APIs)
app.get('/api/live-stats', async (req, res) => {
  try {
    const liveStats = await nbaStatsService.getLiveStats();
    res.json(liveStats);
  } catch (error) {
    console.error('Error fetching live stats:', error);
    res.status(500).json({ error: 'Failed to fetch live stats' });
  }
});

// Get top performers
app.get('/api/top-performers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topPerformers = await nbaStatsService.getTopPerformers(limit);
    res.json(topPerformers);
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ error: 'Failed to fetch top performers' });
  }
});

// Get team stats
app.get('/api/team-stats/:team', async (req, res) => {
  try {
    const { team } = req.params;
    const teamStats = await nbaStatsService.getTeamStats(team);
    res.json(teamStats);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
});

// Trigger manual stats update
app.post('/api/admin/update-stats', async (req, res) => {
  try {
    await statsUpdater.triggerUpdate();
    res.json({ success: true, message: 'Stats update triggered' });
  } catch (error) {
    console.error('Error triggering stats update:', error);
    res.status(500).json({ error: 'Failed to trigger stats update' });
  }
});

// Get stats updater status
app.get('/api/admin/stats-status', async (req, res) => {
  try {
    const status = statsUpdater.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching stats status:', error);
    res.status(500).json({ error: 'Failed to fetch stats status' });
  }
});

// Update player stats
app.post('/api/player-stats', async (req, res) => {
  try {
    const {
      playerId, pts, reb, ast, stl, blk, turnovers,
      fgMade, fgAttempted, ftMade, ftAttempted,
      fantasyPoints, gameDate, opponent, isPlaying
    } = req.body;

    const result = await pool.query(`
      INSERT INTO player_stats 
      (player_id, pts, reb, ast, stl, blk, turnovers, fg_made, fg_attempted, 
       ft_made, ft_attempted, fantasy_points, game_date, opponent, is_playing)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      playerId, pts, reb, ast, stl, blk, turnovers,
      fgMade, fgAttempted, ftMade, ftAttempted,
      fantasyPoints, gameDate, opponent, isPlaying
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating player stats:', error);
    res.status(500).json({ error: 'Failed to update player stats' });
  }
});

// Tournament routes
app.get('/api/tournaments/current', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM tournaments 
      WHERE status = 'active' AND start_time <= NOW() AND end_time > NOW()
      ORDER BY start_time DESC LIMIT 1
    `);
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching current tournament:', error);
    res.status(500).json({ error: 'Failed to fetch current tournament' });
  }
});

app.get('/api/tournaments/upcoming', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM tournaments 
      WHERE status = 'upcoming' AND start_time > NOW()
      ORDER BY start_time ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming tournaments' });
  }
});

// Register lineup
app.post('/api/tournaments/:tournamentId/register', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { walletAddress, lineup, totalSalary } = req.body;

    // Check if tournament exists and is accepting registrations
    const tournament = await pool.query(
      'SELECT * FROM tournaments WHERE id = $1 AND status = $2 AND lineup_deadline > NOW()',
      [tournamentId, 'upcoming']
    );

    if (tournament.rows.length === 0) {
      return res.status(400).json({ error: 'Tournament not found or registration closed' });
    }

    // Check if user already registered
    const existingLineup = await pool.query(
      'SELECT * FROM user_lineups WHERE wallet_address = $1 AND tournament_id = $2',
      [walletAddress, tournamentId]
    );

    if (existingLineup.rows.length > 0) {
      return res.status(400).json({ error: 'Already registered for this tournament' });
    }

    // Register lineup
    const lineupId = `lineup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await pool.query(`
      INSERT INTO user_lineups 
      (id, wallet_address, tournament_id, pg_player_id, sg_player_id, sf_player_id, pf_player_id, c_player_id, total_salary)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      lineupId, walletAddress, tournamentId,
      lineup.PG, lineup.SG, lineup.SF, lineup.PF, lineup.C,
      totalSalary
    ]);

    // Update prize pool
    await pool.query(
      'UPDATE tournaments SET prize_pool = prize_pool + entry_fee WHERE id = $1',
      [tournamentId]
    );

    res.json({ success: true, lineupId });
  } catch (error) {
    console.error('Error registering lineup:', error);
    res.status(500).json({ error: 'Failed to register lineup' });
  }
});

// Get user matchup
app.get('/api/tournaments/:tournamentId/matchup/:walletAddress', async (req, res) => {
  try {
    const { tournamentId, walletAddress } = req.params;
    const result = await pool.query(
      'SELECT * FROM tournament_matchups WHERE tournament_id = $1 AND (wallet1 = $2 OR wallet2 = $2)',
      [tournamentId, walletAddress]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching user matchup:', error);
    res.status(500).json({ error: 'Failed to fetch matchup' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initializeDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
    console.log(`📊 Database: PostgreSQL`);
    console.log(`🔗 API Endpoints:`);
    console.log(`   GET  /api/players`);
    console.log(`   GET  /api/player-stats`);
    console.log(`   POST /api/player-stats`);
    console.log(`   GET  /api/tournaments/current`);
    console.log(`   POST /api/tournaments/:id/register`);
  });
}

startServer().catch(console.error);