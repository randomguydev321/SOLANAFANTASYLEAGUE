import { NextResponse } from 'next/server';
import { NBA_PLAYERS_2026 } from '../../data/nbaPlayers2026';

export async function GET() {
  try {
    // Return live stats for all 150+ NBA players
    const liveStats = NBA_PLAYERS_2026.map(player => ({
      playerId: player.id,
      name: player.name,
      team: player.team,
      position: player.position,
      pts: player.pts,
      reb: player.reb,
      ast: player.ast,
      stl: player.stl,
      blk: player.blk,
      turnovers: player.turnovers,
      fgm: player.fgm,
      fga: player.fga,
      ftm: player.ftm,
      fta: player.fta,
      fantasyPoints: player.fantasy_points,
      isPlaying: player.is_playing
    }));

    return NextResponse.json(liveStats);
  } catch (error) {
    console.error('Error fetching live stats:', error);
    return NextResponse.json({ error: 'Failed to fetch live stats' }, { status: 500 });
  }
}
