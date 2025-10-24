import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return a basic set of NBA players until database is connected
    const players = [
      // Point Guards - 2026 Season Stats
      { id: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", salary: 5, nba_id: "1629029", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png", pts: 35.2, reb: 9.1, ast: 10.8, stl: 1.6, blk: 0.7, turnovers: 3.8, fgm: 12.4, fga: 24.8, ftm: 8.2, fta: 9.4, fantasy_points: 65.4, is_playing: true },
      { id: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", salary: 5, nba_id: "201939", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png", pts: 28.7, reb: 5.2, ast: 6.8, stl: 1.2, blk: 0.5, turnovers: 3.4, fgm: 9.8, fga: 21.5, ftm: 6.8, fta: 7.2, fantasy_points: 48.9, is_playing: true },
      { id: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", salary: 5, nba_id: "1628983", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png", pts: 32.8, reb: 6.1, ast: 7.4, stl: 1.5, blk: 1.2, turnovers: 3.1, fgm: 11.2, fga: 22.1, ftm: 9.1, fta: 10.2, fantasy_points: 58.7, is_playing: true },
      
      // Shooting Guards - 2026 Season Stats
      { id: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", salary: 5, nba_id: "1626164", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png", pts: 29.4, reb: 5.1, ast: 7.8, stl: 1.1, blk: 0.4, turnovers: 3.3, fgm: 10.8, fga: 21.2, ftm: 6.2, fta: 6.8, fantasy_points: 51.2, is_playing: true },
      { id: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", salary: 5, nba_id: "1628378", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png", pts: 28.9, reb: 4.8, ast: 6.2, stl: 1.9, blk: 0.5, turnovers: 2.9, fgm: 10.1, fga: 21.8, ftm: 6.7, fta: 7.4, fantasy_points: 49.8, is_playing: true },
      { id: 33, name: "ANTHONY EDWARDS", team: "TIMBERWOLVES", position: "SG", salary: 5, nba_id: "1630162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png", pts: 27.8, reb: 6.2, ast: 6.1, stl: 1.4, blk: 0.6, turnovers: 3.4, fgm: 9.8, fga: 21.5, ftm: 6.7, fta: 7.6, fantasy_points: 47.3, is_playing: true },
      
      // Small Forwards - 2026 Season Stats
      { id: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", salary: 5, nba_id: "2544", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png", pts: 27.2, reb: 8.1, ast: 9.4, stl: 1.4, blk: 0.6, turnovers: 3.7, fgm: 10.4, fga: 20.1, ftm: 5.8, fta: 7.2, fantasy_points: 52.8, is_playing: true },
      { id: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", salary: 5, nba_id: "201142", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png", pts: 29.1, reb: 7.2, ast: 5.8, stl: 1.0, blk: 1.4, turnovers: 3.6, fgm: 10.2, fga: 19.4, ftm: 6.8, fta: 7.5, fantasy_points: 49.7, is_playing: true },
      { id: 63, name: "JAYSON TATUM", team: "CELTICS", position: "SF", salary: 5, nba_id: "1628369", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png", pts: 28.4, reb: 8.8, ast: 5.6, stl: 1.1, blk: 0.7, turnovers: 3.1, fgm: 9.8, fga: 21.2, ftm: 7.1, fta: 8.1, fantasy_points: 50.2, is_playing: true },
      
      // Power Forwards - 2026 Season Stats
      { id: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", salary: 5, nba_id: "203507", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png", pts: 32.1, reb: 12.8, ast: 7.2, stl: 1.3, blk: 1.3, turnovers: 3.6, fgm: 11.4, fga: 21.2, ftm: 8.7, fta: 12.1, fantasy_points: 64.8, is_playing: true },
      { id: 92, name: "ZION WILLIAMSON", team: "PELICANS", position: "PF", salary: 5, nba_id: "1629627", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png", pts: 24.8, reb: 6.4, ast: 5.8, stl: 1.2, blk: 0.7, turnovers: 3.6, fgm: 9.4, fga: 16.8, ftm: 5.2, fta: 7.8, fantasy_points: 42.1, is_playing: true },
      { id: 93, name: "PAOLO BANCHERO", team: "MAGIC", position: "PF", salary: 4, nba_id: "1631094", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png", pts: 22.1, reb: 7.8, ast: 4.2, stl: 1.0, blk: 0.9, turnovers: 3.4, fgm: 7.8, fga: 16.8, ftm: 5.8, fta: 6.9, fantasy_points: 38.7, is_playing: true },
      
      // Centers - 2026 Season Stats
      { id: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", salary: 5, nba_id: "203999", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png", pts: 28.7, reb: 13.8, ast: 10.2, stl: 1.4, blk: 1.1, turnovers: 3.8, fgm: 11.2, fga: 19.4, ftm: 5.8, fta: 6.7, fantasy_points: 65.4, is_playing: true },
      { id: 122, name: "JOEL EMBIID", team: "76ERS", position: "C", salary: 5, nba_id: "203954", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png", pts: 36.8, reb: 12.4, ast: 6.8, stl: 1.3, blk: 1.9, turnovers: 3.9, fgm: 12.8, fga: 24.1, ftm: 10.2, fta: 12.4, fantasy_points: 68.7, is_playing: true },
      { id: 123, name: "ANTHONY DAVIS", team: "LAKERS", position: "C", salary: 5, nba_id: "203076", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png", pts: 26.4, reb: 13.8, ast: 4.1, stl: 1.3, blk: 2.6, turnovers: 2.9, fgm: 9.8, fga: 18.2, ftm: 5.9, fta: 7.4, fantasy_points: 56.8, is_playing: true },
      
      // More players for variety - 2026 Season Stats
      { id: 4, name: "TRAE YOUNG", team: "HAWKS", position: "PG", salary: 4, nba_id: "1629027", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png", pts: 27.8, reb: 3.2, ast: 12.1, stl: 1.4, blk: 0.3, turnovers: 4.2, fgm: 8.8, fga: 20.1, ftm: 8.4, fta: 9.2, fantasy_points: 53.7, is_playing: true },
      { id: 5, name: "DAMIAN LILLARD", team: "BUCKS", position: "PG", salary: 4, nba_id: "203081", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png", pts: 26.1, reb: 4.8, ast: 7.8, stl: 1.1, blk: 0.4, turnovers: 2.9, fgm: 8.4, fga: 19.2, ftm: 7.2, fta: 7.8, fantasy_points: 45.8, is_playing: true },
      { id: 34, name: "JAYLEN BROWN", team: "CELTICS", position: "SG", salary: 5, nba_id: "1627759", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png", pts: 24.8, reb: 6.4, ast: 4.1, stl: 1.3, blk: 0.6, turnovers: 3.1, fgm: 8.9, fga: 18.8, ftm: 5.6, fta: 6.7, fantasy_points: 42.4, is_playing: true },
      { id: 64, name: "KAWHI LEONARD", team: "CLIPPERS", position: "SF", salary: 5, nba_id: "202695", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png", pts: 25.2, reb: 6.8, ast: 4.1, stl: 1.7, blk: 1.0, turnovers: 2.1, fgm: 9.4, fga: 17.8, ftm: 5.4, fta: 6.1, fantasy_points: 46.1, is_playing: true },
      { id: 94, name: "JULIUS RANDLE", team: "KNICKS", position: "PF", salary: 4, nba_id: "203944", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203944.png", pts: 25.8, reb: 10.1, ast: 5.6, stl: 0.7, blk: 0.4, turnovers: 3.6, fgm: 9.1, fga: 19.4, ftm: 6.8, fta: 8.7, fantasy_points: 46.2, is_playing: true },
      { id: 124, name: "VICTOR WEMBANYAMA", team: "SPURS", position: "C", salary: 5, nba_id: "1641705", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png", pts: 23.8, reb: 11.8, ast: 4.4, stl: 1.3, blk: 4.1, turnovers: 3.9, fgm: 8.4, fga: 17.8, ftm: 5.2, fta: 6.7, fantasy_points: 61.2, is_playing: true },
    ];

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
