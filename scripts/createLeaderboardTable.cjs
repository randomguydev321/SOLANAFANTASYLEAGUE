const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

async function createLeaderboardTable() {
  try {
    console.log('Creating leaderboard table...');

    // Create leaderboard table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(100),
        total_fantasy_points DECIMAL(10,2) NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0,
        games_played INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster leaderboard queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard(total_fantasy_points DESC)
    `);

    // Create index for wallet lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet ON leaderboard(wallet_address)
    `);

    console.log('✅ Leaderboard table created successfully!');

    await pool.end();
  } catch (error) {
    console.error('❌ Error creating leaderboard table:', error);
    process.exit(1);
  }
}

createLeaderboardTable();

