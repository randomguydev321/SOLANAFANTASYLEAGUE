import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    // Fetch REAL players from database with current season stats
    const result = await pool.query(`
      SELECT id, name, team, position, salary, nba_id, photo,
             pts, reb, ast, stl, blk, turnovers, fgm, fga, ftm, fta,
             fantasy_points, is_playing, games_played, minutes
      FROM players 
      ORDER BY fantasy_points DESC
    `);
    
    const players = result.rows.map(player => ({
      id: player.id,
      name: player.name,
      team: player.team,
      position: player.position,
      salary: player.salary,
      nba_id: player.nba_id,
      photo: player.photo,
      pts: parseFloat(player.pts) || 0,
      reb: parseFloat(player.reb) || 0,
      ast: parseFloat(player.ast) || 0,
      stl: parseFloat(player.stl) || 0,
      blk: parseFloat(player.blk) || 0,
      turnovers: parseFloat(player.turnovers) || 0,
      fgm: parseFloat(player.fgm) || 0,
      fga: parseFloat(player.fga) || 0,
      ftm: parseFloat(player.ftm) || 0,
      fta: parseFloat(player.fta) || 0,
      fantasy_points: parseFloat(player.fantasy_points) || 0,
      is_playing: player.is_playing || false,
      games_played: player.games_played || 0,
      minutes: parseFloat(player.minutes) || 0
    }));

    console.log(`✅ Fetched ${players.length} players with REAL 2025-26 season stats from database`);
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players from database:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
