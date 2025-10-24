import { ethers } from 'ethers';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = "0x0F9Eb62C5163414E0df3DECf9D2016E76B38b557";
const CONTRACT_ABI = [
  "function updatePlayerScore(uint256 playerId, uint256 points) external"
];

const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Map your player IDs to NBA API player IDs
const NBA_PLAYER_MAP = {
  // Point Guards
  1: "1629029",   // Luka Doncic
  2: "201939",    // Stephen Curry
  3: "1628983",   // Shai Gilgeous-Alexander
  4: "1629027",   // Trae Young
  5: "203081",    // Damian Lillard
  6: "1629630",   // Ja Morant
  7: "1630169",   // Tyrese Haliburton
  8: "1630163",   // LaMelo Ball
  9: "1628368",   // De'Aaron Fox
  10: "1629636",  // Darius Garland
  
  // Shooting Guards
  31: "1626164",  // Devin Booker
  32: "1628378",  // Donovan Mitchell
  33: "1630162",  // Anthony Edwards
  34: "1627759",  // Jaylen Brown
  35: "203897",   // Zach LaVine
  36: "201942",   // DeMar DeRozan
  37: "203078",   // Bradley Beal
  
  // Small Forwards
  61: "2544",     // LeBron James
  62: "201142",   // Kevin Durant
  63: "1628369",  // Jayson Tatum
  64: "202695",   // Kawhi Leonard
  65: "202710",   // Jimmy Butler
  66: "202331",   // Paul George
  
  // Power Forwards
  91: "203507",   // Giannis Antetokounmpo
  92: "1629627",  // Zion Williamson
  93: "1631094",  // Paolo Banchero
  94: "203944",   // Julius Randle
  
  // Centers
  121: "203999",  // Nikola Jokic
  122: "203954",  // Joel Embiid
  123: "203076",  // Anthony Davis
  124: "1641705", // Victor Wembanyama
  125: "1628389", // Bam Adebayo
  126: "1627734", // Domantas Sabonis
  127: "1626157", // Karl-Anthony Towns
  
  // Add all 150 players...
};

// Fetch player stats from NBA API
async function fetchPlayerStats(nbaPlayerId) {
  try {
    const today = new Date();
    const season = today.getMonth() >= 9 ? `${today.getFullYear()}-${(today.getFullYear() + 1).toString().slice(-2)}` : `${today.getFullYear() - 1}-${today.getFullYear().toString().slice(-2)}`;
    
    // NBA Stats API endpoint for player game log
    const url = `https://stats.nba.com/stats/playergamelog?PlayerID=${nbaPlayerId}&Season=${season}&SeasonType=Regular%20Season`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://stats.nba.com/',
        'Origin': 'https://stats.nba.com',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch stats for player ${nbaPlayerId}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const statsData = data as any;
    if (statsData.resultSets && statsData.resultSets[0].rowSet.length > 0) {
      // Get most recent game (first row)
      const lastGame = statsData.resultSets[0].rowSet[0];
      const headers = statsData.resultSets[0].headers;
      // Find indices for each stat
      const ptsIndex = headers.indexOf('PTS');
      const rebIndex = headers.indexOf('REB');
      const astIndex = headers.indexOf('AST');
      const stlIndex = headers.indexOf('STL');
      const blkIndex = headers.indexOf('BLK');
      const toIndex = headers.indexOf('TOV');
      const stats = {
        pts: lastGame[ptsIndex] || 0,
        reb: lastGame[rebIndex] || 0,
        ast: lastGame[astIndex] || 0,
        stl: lastGame[stlIndex] || 0,
        blk: lastGame[blkIndex] || 0,
        to: lastGame[toIndex] || 0
      };
      // Calculate fantasy points
      // Formula: PTS + (REB * 1.2) + (AST * 1.5) + (STL * 3) + (BLK * 3) + (TO * -1)
      const fantasyPoints = Math.floor(
        stats.pts + 
        (stats.reb * 1.2) + 
        (stats.ast * 1.5) + 
        (stats.stl * 3) + 
        (stats.blk * 3) + 
        (stats.to * -1)
      );
      return { ...stats, fantasyPoints };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching stats for player ${nbaPlayerId}:`, error.message);
    return null;
  }
}

// Check if there are live games today
async function getLiveGames() {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const url = `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
    
    const response = await fetch(url);
    const data = await response.json();
    const scoreboardData = data as any;
    if (scoreboardData.scoreboard && scoreboardData.scoreboard.games) {
      const liveGames = scoreboardData.scoreboard.games.filter((game: any) => 
        game.gameStatus === 2 // 2 = Live
      );
      return liveGames.length > 0 ? liveGames : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching live games:', error.message);
    return [];
  }
}

// Update all player scores on blockchain
async function updateAllScores() {
  console.log('\n🔄 Starting score update cycle...');
  console.log(`Time: ${new Date().toLocaleString()}`);
  
  const liveGames = await getLiveGames();
  console.log(`📊 Live games: ${liveGames.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [playerId, nbaId] of Object.entries(NBA_PLAYER_MAP)) {
    try {
      console.log(`\nFetching stats for Player ID ${playerId} (NBA ID: ${nbaId})...`);
      
      const stats = await fetchPlayerStats(nbaId);
      
      if (stats) {
        console.log(`  Stats: ${stats.pts} PTS, ${stats.reb} REB, ${stats.ast} AST, ${stats.stl} STL, ${stats.blk} BLK, ${stats.to} TO`);
        console.log(`  Fantasy Points: ${stats.fantasyPoints}`);
        
        // Update on blockchain
        console.log(`  Updating on-chain...`);
        const tx = await contract.updatePlayerScore(playerId, stats.fantasyPoints, {
          gasLimit: 100000
        });
        
        const receipt = await tx.wait();
        console.log(`  ✅ Updated! Gas used: ${receipt.gasUsed.toString()}`);
        
        successCount++;
      } else {
        console.log(`  ⚠️ No recent stats found`);
      }
      
      // Rate limiting - wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`  ❌ Error updating player ${playerId}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Update Summary:`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  Total: ${Object.keys(NBA_PLAYER_MAP).length}`);
  console.log(`\n⏰ Next update in ${liveGames.length > 0 ? '5 minutes' : '1 hour'}...\n`);
}

// Main execution
async function main() {
  console.log('🏀 NBA Fantasy Stats Updater Started!');
  console.log(`Contract: ${CONTRACT_ADDRESS}`);
  console.log(`Network: BSC Testnet\n`);
  
  // Initial update
  await updateAllScores();
  
  // Schedule updates
  // - Every 5 minutes when there are live games
  // - Every 1 hour otherwise
  setInterval(async () => {
    const liveGames = await getLiveGames();
    const interval = liveGames.length > 0 ? 5 * 60 * 1000 : 60 * 60 * 1000;
    
    await updateAllScores();
  }, 5 * 60 * 1000); // Check every 5 minutes
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});