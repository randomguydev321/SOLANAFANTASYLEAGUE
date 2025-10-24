// Create Database Tables
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Create players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        team VARCHAR(50) NOT NULL,
        position VARCHAR(10) NOT NULL,
        salary INTEGER NOT NULL CHECK (salary >= 1 AND salary <= 5),
        nba_id VARCHAR(20) UNIQUE NOT NULL,
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created players table');
    
    // Create player_stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        game_date DATE NOT NULL,
        pts INTEGER DEFAULT 0,
        reb INTEGER DEFAULT 0,
        ast INTEGER DEFAULT 0,
        stl INTEGER DEFAULT 0,
        blk INTEGER DEFAULT 0,
        "to" INTEGER DEFAULT 0,
        fgm INTEGER DEFAULT 0,
        fga INTEGER DEFAULT 0,
        ftm INTEGER DEFAULT 0,
        fta INTEGER DEFAULT 0,
        fantasy_points DECIMAL(10,2) DEFAULT 0,
        is_playing BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, game_date)
      )
    `);
    console.log('Created player_stats table');
    
    // Create tournaments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        entry_fee DECIMAL(10,2) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created tournaments table');
    
    // Create participants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
        wallet_address VARCHAR(100) NOT NULL,
        lineup JSONB NOT NULL,
        total_score DECIMAL(10,2) DEFAULT 0,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tournament_id, wallet_address)
      )
    `);
    console.log('Created participants table');
    
    // Create user_profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        total_score DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created user_profiles table');
    
    console.log('All tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();
