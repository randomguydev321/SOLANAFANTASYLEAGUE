import { NextResponse } from 'next/server';
import { NBA_PLAYERS_2026 } from '../../data/nbaPlayers2026';

export async function GET() {
  try {
    // Return all 150+ NBA players with 2026 season stats
    return NextResponse.json(NBA_PLAYERS_2026);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
