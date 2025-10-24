import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return a basic set of NBA players until database is connected
    const players = [
      // Point Guards
      { id: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", salary: 5, nba_id: "1629029", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png", pts: 32.4, reb: 8.2, ast: 9.1, stl: 1.4, blk: 0.5, turnovers: 3.4, fgm: 11.2, fga: 23.1, ftm: 7.8, fta: 8.9, fantasy_points: 58.2, is_playing: true },
      { id: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", salary: 5, nba_id: "201939", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png", pts: 26.4, reb: 4.5, ast: 5.1, stl: 1.0, blk: 0.4, turnovers: 3.2, fgm: 8.9, fga: 20.2, ftm: 5.8, fta: 6.1, fantasy_points: 42.8, is_playing: true },
      { id: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", salary: 5, nba_id: "1628983", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png", pts: 30.1, reb: 5.5, ast: 6.2, stl: 1.3, blk: 1.0, turnovers: 2.8, fgm: 10.2, fga: 20.9, ftm: 8.9, fta: 9.8, fantasy_points: 52.1, is_playing: true },
      
      // Shooting Guards
      { id: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", salary: 5, nba_id: "1626164", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png", pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.9, blk: 0.3, turnovers: 3.1, fgm: 9.8, fga: 20.1, ftm: 5.8, fta: 6.2, fantasy_points: 45.3, is_playing: true },
      { id: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", salary: 5, nba_id: "1628378", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png", pts: 26.6, reb: 4.1, ast: 5.1, stl: 1.8, blk: 0.4, turnovers: 2.8, fgm: 9.2, fga: 20.8, ftm: 6.1, fta: 6.8, fantasy_points: 44.7, is_playing: true },
      { id: 33, name: "ANTHONY EDWARDS", team: "TIMBERWOLVES", position: "SG", salary: 5, nba_id: "1630162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png", pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, turnovers: 3.2, fgm: 9.1, fga: 20.8, ftm: 6.2, fta: 7.1, fantasy_points: 43.8, is_playing: true },
      
      // Small Forwards
      { id: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", salary: 5, nba_id: "2544", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png", pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, turnovers: 3.5, fgm: 9.8, fga: 19.4, ftm: 5.1, fta: 6.8, fantasy_points: 48.2, is_playing: true },
      { id: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", salary: 5, nba_id: "201142", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png", pts: 27.1, reb: 6.7, ast: 5.0, stl: 0.9, blk: 1.2, turnovers: 3.4, fgm: 9.8, fga: 18.8, ftm: 6.1, fta: 6.8, fantasy_points: 45.8, is_playing: true },
      { id: 63, name: "JAYSON TATUM", team: "CELTICS", position: "SF", salary: 5, nba_id: "1628369", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png", pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, turnovers: 2.9, fgm: 9.2, fga: 20.5, ftm: 6.8, fta: 7.6, fantasy_points: 46.7, is_playing: true },
      
      // Power Forwards
      { id: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", salary: 5, nba_id: "203507", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png", pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, turnovers: 3.4, fgm: 10.8, fga: 20.1, ftm: 8.1, fta: 11.2, fantasy_points: 58.9, is_playing: true },
      { id: 92, name: "ZION WILLIAMSON", team: "PELICANS", position: "PF", salary: 5, nba_id: "1629627", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png", pts: 22.9, reb: 5.8, ast: 5.0, stl: 1.1, blk: 0.6, turnovers: 3.4, fgm: 8.8, fga: 15.8, ftm: 4.8, fta: 7.1, fantasy_points: 38.7, is_playing: true },
      { id: 93, name: "PAOLO BANCHERO", team: "MAGIC", position: "PF", salary: 4, nba_id: "1631094", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png", pts: 20.0, reb: 6.9, ast: 3.7, stl: 0.9, blk: 0.8, turnovers: 3.2, fgm: 7.1, fga: 15.8, ftm: 5.1, fta: 6.2, fantasy_points: 35.2, is_playing: true },
      
      // Centers
      { id: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", salary: 5, nba_id: "203999", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png", pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.3, blk: 0.9, turnovers: 3.6, fgm: 10.2, fga: 18.2, ftm: 5.4, fta: 6.1, fantasy_points: 58.7, is_playing: true },
      { id: 122, name: "JOEL EMBIID", team: "76ERS", position: "C", salary: 5, nba_id: "203954", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png", pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, turnovers: 3.7, fgm: 11.8, fga: 22.4, ftm: 10.1, fta: 11.7, fantasy_points: 63.8, is_playing: true },
      { id: 123, name: "ANTHONY DAVIS", team: "LAKERS", position: "C", salary: 5, nba_id: "203076", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png", pts: 24.1, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, turnovers: 2.8, fgm: 9.1, fga: 17.2, ftm: 5.4, fta: 6.8, fantasy_points: 52.1, is_playing: true },
      
      // More players for variety
      { id: 4, name: "TRAE YOUNG", team: "HAWKS", position: "PG", salary: 4, nba_id: "1629027", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png", pts: 25.7, reb: 2.8, ast: 10.8, stl: 1.3, blk: 0.2, turnovers: 4.0, fgm: 8.1, fga: 19.3, ftm: 7.8, fta: 8.6, fantasy_points: 48.9, is_playing: true },
      { id: 5, name: "DAMIAN LILLARD", team: "BUCKS", position: "PG", salary: 4, nba_id: "203081", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png", pts: 24.3, reb: 4.4, ast: 7.0, stl: 1.0, blk: 0.3, turnovers: 2.8, fgm: 7.8, fga: 18.2, ftm: 6.8, fta: 7.3, fantasy_points: 42.1, is_playing: true },
      { id: 34, name: "JAYLEN BROWN", team: "CELTICS", position: "SG", salary: 5, nba_id: "1627759", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png", pts: 23.1, reb: 5.9, ast: 3.6, stl: 1.2, blk: 0.5, turnovers: 2.9, fgm: 8.4, fga: 18.1, ftm: 5.1, fta: 6.2, fantasy_points: 38.9, is_playing: true },
      { id: 64, name: "KAWHI LEONARD", team: "CLIPPERS", position: "SF", salary: 5, nba_id: "202695", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png", pts: 23.7, reb: 6.1, ast: 3.6, stl: 1.6, blk: 0.9, turnovers: 2.0, fgm: 8.8, fga: 17.1, ftm: 5.0, fta: 5.6, fantasy_points: 42.8, is_playing: true },
      { id: 94, name: "JULIUS RANDLE", team: "KNICKS", position: "PF", salary: 4, nba_id: "203944", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203944.png", pts: 24.0, reb: 9.2, ast: 5.0, stl: 0.6, blk: 0.3, turnovers: 3.4, fgm: 8.4, fga: 18.8, ftm: 6.4, fta: 8.1, fantasy_points: 42.8, is_playing: true },
      { id: 124, name: "VICTOR WEMBANYAMA", team: "SPURS", position: "C", salary: 5, nba_id: "1641705", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png", pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, turnovers: 3.7, fgm: 7.8, fga: 16.8, ftm: 4.8, fta: 6.1, fantasy_points: 55.2, is_playing: true },
    ];

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
