const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

async function resetLeaderboard() {
  try {
    console.log('Resetting leaderboard...');

    // Delete all leaderboard entries
    await pool.query('DELETE FROM leaderboard');
    
    console.log('✅ Leaderboard reset successfully!');
    console.log('All wallet statistics have been cleared.');

    await pool.end();
  } catch (error) {
    console.error('❌ Error resetting leaderboard:', error);
    process.exit(1);
  }
}

resetLeaderboard();

