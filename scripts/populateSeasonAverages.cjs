// Script to populate database with real 2025-26 season averages
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to calculate fantasy points
const calculateFantasyPoints = (pts, reb, ast, stl, blk, turnovers) => {
  return pts + (reb * 1.2) + (ast * 1.5) + (stl * 3) + (blk * 3) - (turnovers * 1);
};

// Fetch player season averages from NBA API
async function fetchPlayerSeasonAverages(nbaPlayerId) {
  try {
    const season = '2025-26';
    const url = `https://stats.nba.com/stats/playerdashboardbyyearoveryear?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=${nbaPlayerId}&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&VsConference=&VsDivision=`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://stats.nba.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      },
      timeout: 10000
    });
    
    const data = response.data;
    if (data.resultSets && data.resultSets[0] && data.resultSets[0].rowSet.length > 0) {
      const seasonStats = data.resultSets[0].rowSet[0];
      const headers = data.resultSets[0].headers;

      const getStat = (header) => {
        const index = headers.indexOf(header);
        return index !== -1 ? parseFloat(seasonStats[index]) || 0 : 0;
      };

      const stats = {
        pts: getStat('PTS'),
        reb: getStat('REB'),
        ast: getStat('AST'),
        stl: getStat('STL'),
        blk: getStat('BLK'),
        turnovers: getStat('TOV'),
        fgm: getStat('FGM'),
        fga: getStat('FGA'),
        ftm: getStat('FTM'),
        fta: getStat('FTA'),
        gamesPlayed: getStat('GP'),
        minutes: getStat('MIN'),
        isPlaying: getStat('GP') > 0
      };
      
      const fantasyPoints = calculateFantasyPoints(stats.pts, stats.reb, stats.ast, stats.stl, stats.blk, stats.turnovers);
      return { ...stats, fantasyPoints };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching season averages for player ${nbaPlayerId}:`, error.message);
    return null;
  }
}

// Main function to populate season averages
async function populateSeasonAverages() {
  try {
    console.log('🏀 Starting to populate REAL 2025-26 season averages...');
    
    // Get all players from database
    const playersResult = await pool.query('SELECT * FROM players ORDER BY id');
    const players = playersResult.rows;
    
    console.log(`Found ${players.length} players to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const player of players) {
      try {
        console.log(`Fetching season averages for ${player.name} (NBA ID: ${player.nba_id})...`);
        
        const seasonAverages = await fetchPlayerSeasonAverages(player.nba_id);
        
        if (seasonAverages && seasonAverages.gamesPlayed > 0) {
          // Update player with real season averages
          await pool.query(
            `UPDATE players SET 
             pts = $1, reb = $2, ast = $3, stl = $4, blk = $5, turnovers = $6,
             fgm = $7, fga = $8, ftm = $9, fta = $10, fantasy_points = $11, is_playing = $12
             WHERE id = $13`,
            [
              seasonAverages.pts,
              seasonAverages.reb,
              seasonAverages.ast,
              seasonAverages.stl,
              seasonAverages.blk,
              seasonAverages.turnovers,
              seasonAverages.fgm,
              seasonAverages.fga,
              seasonAverages.ftm,
              seasonAverages.fta,
              seasonAverages.fantasyPoints,
              seasonAverages.isPlaying,
              player.id
            ]
          );
          
          console.log(`✅ Updated ${player.name}: ${seasonAverages.pts} PTS, ${seasonAverages.fantasyPoints.toFixed(1)} FP`);
          updatedCount++;
        } else {
          console.log(`⚠️ No season data for ${player.name} (${player.nba_id})`);
          errorCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error updating ${player.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎯 Season averages population completed!`);
    console.log(`✅ Successfully updated: ${updatedCount} players`);
    console.log(`❌ Errors: ${errorCount} players`);
    console.log(`📊 Total processed: ${players.length} players`);
    
  } catch (error) {
    console.error('Error in populateSeasonAverages:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
populateSeasonAverages();
