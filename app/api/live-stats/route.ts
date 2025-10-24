import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return sample live stats data
    const liveStats = [
      { playerId: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", pts: 32.4, reb: 8.2, ast: 9.1, stl: 1.4, blk: 0.5, turnovers: 3.4, fgm: 11.2, fga: 23.1, ftm: 7.8, fta: 8.9, fantasyPoints: 58.2, isPlaying: true },
      { playerId: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", pts: 26.4, reb: 4.5, ast: 5.1, stl: 1.0, blk: 0.4, turnovers: 3.2, fgm: 8.9, fga: 20.2, ftm: 5.8, fta: 6.1, fantasyPoints: 42.8, isPlaying: true },
      { playerId: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", pts: 30.1, reb: 5.5, ast: 6.2, stl: 1.3, blk: 1.0, turnovers: 2.8, fgm: 10.2, fga: 20.9, ftm: 8.9, fta: 9.8, fantasyPoints: 52.1, isPlaying: true },
      { playerId: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.9, blk: 0.3, turnovers: 3.1, fgm: 9.8, fga: 20.1, ftm: 5.8, fta: 6.2, fantasyPoints: 45.3, isPlaying: true },
      { playerId: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", pts: 26.6, reb: 4.1, ast: 5.1, stl: 1.8, blk: 0.4, turnovers: 2.8, fgm: 9.2, fga: 20.8, ftm: 6.1, fta: 6.8, fantasyPoints: 44.7, isPlaying: true },
      { playerId: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, turnovers: 3.5, fgm: 9.8, fga: 19.4, ftm: 5.1, fta: 6.8, fantasyPoints: 48.2, isPlaying: true },
      { playerId: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", pts: 27.1, reb: 6.7, ast: 5.0, stl: 0.9, blk: 1.2, turnovers: 3.4, fgm: 9.8, fga: 18.8, ftm: 6.1, fta: 6.8, fantasyPoints: 45.8, isPlaying: true },
      { playerId: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, turnovers: 3.4, fgm: 10.8, fga: 20.1, ftm: 8.1, fta: 11.2, fantasyPoints: 58.9, isPlaying: true },
      { playerId: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.3, blk: 0.9, turnovers: 3.6, fgm: 10.2, fga: 18.2, ftm: 5.4, fta: 6.1, fantasyPoints: 58.7, isPlaying: true },
      { playerId: 122, name: "JOEL EMBIID", team: "76ERS", position: "C", pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, turnovers: 3.7, fgm: 11.8, fga: 22.4, ftm: 10.1, fta: 11.7, fantasyPoints: 63.8, isPlaying: true },
    ];

    return NextResponse.json(liveStats);
  } catch (error) {
    console.error('Error fetching live stats:', error);
    return NextResponse.json({ error: 'Failed to fetch live stats' }, { status: 500 });
  }
}
