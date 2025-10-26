import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

// GET - Fetch leaderboard
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        wallet_address,
        COALESCE(username, wallet_address) as username,
        total_fantasy_points,
        wins,
        losses,
        games_played
      FROM leaderboard 
      ORDER BY total_fantasy_points DESC
      LIMIT 100
    `);

    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      wallet: row.wallet_address,
      username: row.username || 'Anonymous',
      points: parseFloat(row.total_fantasy_points) || 0,
      wins: parseInt(row.wins) || 0,
      losses: parseInt(row.losses) || 0,
      games: parseInt(row.games_played) || 0
    }));

    console.log(`✅ Fetched ${leaderboard.length} leaderboard entries`);
    
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

// PUT - Update user's leaderboard entry
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { wallet_address, username, total_fantasy_points, wins, losses, games_played } = body;

    if (!wallet_address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO leaderboard (wallet_address, username, total_fantasy_points, wins, losses, games_played, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (wallet_address) 
      DO UPDATE SET 
        username = COALESCE(EXCLUDED.username, leaderboard.username),
        total_fantasy_points = EXCLUDED.total_fantasy_points,
        wins = EXCLUDED.wins,
        losses = EXCLUDED.losses,
        games_played = EXCLUDED.games_played,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [wallet_address, username, total_fantasy_points || 0, wins || 0, losses || 0, games_played || 0]);

    console.log(`✅ Updated leaderboard entry for ${wallet_address}`);
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 });
  }
}

// DELETE - Reset leaderboard
export async function DELETE() {
  try {
    await pool.query('DELETE FROM leaderboard');
    console.log('✅ Leaderboard reset');
    return NextResponse.json({ success: true, message: 'Leaderboard reset successfully' });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    return NextResponse.json({ error: 'Failed to reset leaderboard' }, { status: 500 });
  }
}

