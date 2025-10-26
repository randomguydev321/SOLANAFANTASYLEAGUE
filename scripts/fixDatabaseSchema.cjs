// Script to fix database schema - add missing columns to players table
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema - adding missing columns...');
    
    // Add missing columns to players table
    const alterQueries = [
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS pts DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS reb DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS ast DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS stl DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS blk DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS turnovers DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS fgm DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS fga DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS ftm DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS fta DECIMAL(5,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS fantasy_points DECIMAL(6,1) DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS is_playing BOOLEAN DEFAULT false',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0',
      'ALTER TABLE players ADD COLUMN IF NOT EXISTS minutes DECIMAL(5,1) DEFAULT 0'
    ];
    
    for (const query of alterQueries) {
      try {
        await pool.query(query);
        console.log(`✅ Added column: ${query.split(' ')[5]}`);
      } catch (error) {
        console.log(`⚠️ Column may already exist: ${query.split(' ')[5]}`);
      }
    }
    
    console.log('🎯 Database schema fixed successfully!');
    
    // Show current table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'players' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Current players table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });
    
  } catch (error) {
    console.error('Error fixing database schema:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
fixDatabaseSchema();
