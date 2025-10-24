// Import NBA Players to Database
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://solanafantasyleague_user:N2JoE73LIqQUZmznhtyndIUtE6QY6H9o@dpg-d3trvdu3jp1c7399behg-a.frankfurt-postgres.render.com/solanafantasyleague',
  ssl: { rejectUnauthorized: false }
});

// All 150 NBA Players with real positions and salaries
const PLAYERS = [
  // POINT GUARDS (PG) - SALARY 1-5
  { id: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", salary: 5, nba_id: "1629029", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png" },
  { id: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", salary: 5, nba_id: "201939", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png" },
  { id: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", salary: 5, nba_id: "1628983", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png" },
  { id: 4, name: "TRAE YOUNG", team: "HAWKS", position: "PG", salary: 4, nba_id: "1629027", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png" },
  { id: 5, name: "DAMIAN LILLARD", team: "BUCKS", position: "PG", salary: 4, nba_id: "203081", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png" },
  { id: 6, name: "JA MORANT", team: "GRIZZLIES", position: "PG", salary: 4, nba_id: "1629630", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629630.png" },
  { id: 7, name: "TYRESE HALIBURTON", team: "PACERS", position: "PG", salary: 4, nba_id: "1630169", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630169.png" },
  { id: 8, name: "LAMELO BALL", team: "HORNETS", position: "PG", salary: 4, nba_id: "1630163", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630163.png" },
  { id: 9, name: "DE'AARON FOX", team: "KINGS", position: "PG", salary: 4, nba_id: "1628368", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628368.png" },
  { id: 10, name: "DARIUS GARLAND", team: "CAVALIERS", position: "PG", salary: 3, nba_id: "1629636", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629636.png" },
  { id: 11, name: "JALEN BRUNSON", team: "KNICKS", position: "PG", salary: 3, nba_id: "1628973", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png" },
  { id: 12, name: "DEJOUNTE MURRAY", team: "HAWKS", position: "PG", salary: 3, nba_id: "1627749", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627749.png" },
  { id: 13, name: "FRED VANVLEET", team: "ROCKETS", position: "PG", salary: 3, nba_id: "1627832", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627832.png" },
  { id: 14, name: "TYRESE MAXEY", team: "76ERS", position: "PG", salary: 3, nba_id: "1630178", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630178.png" },
  { id: 15, name: "CHRIS PAUL", team: "WARRIORS", position: "PG", salary: 2, nba_id: "101108", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/101108.png" },
  { id: 16, name: "KYLE LOWRY", team: "76ERS", position: "PG", salary: 2, nba_id: "200768", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/200768.png" },
  { id: 17, name: "MIKE CONLEY", team: "TIMBERWOLVES", position: "PG", salary: 2, nba_id: "201144", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201144.png" },
  { id: 18, name: "DENNIS SCHRODER", team: "NETS", position: "PG", salary: 2, nba_id: "203471", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203471.png" },
  { id: 19, name: "COLLIN SEXTON", team: "JAZZ", position: "PG", salary: 2, nba_id: "1629012", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629012.png" },
  { id: 20, name: "COBY WHITE", team: "BULLS", position: "PG", salary: 2, nba_id: "1629632", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629632.png" },
  
  // SHOOTING GUARDS (SG) - SALARY 1-5
  { id: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", salary: 5, nba_id: "1626164", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png" },
  { id: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", salary: 5, nba_id: "1628378", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png" },
  { id: 33, name: "ANTHONY EDWARDS", team: "TIMBERWOLVES", position: "SG", salary: 5, nba_id: "1630162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png" },
  { id: 34, name: "JAYLEN BROWN", team: "CELTICS", position: "SG", salary: 5, nba_id: "1627759", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png" },
  { id: 35, name: "ZACH LAVINE", team: "BULLS", position: "SG", salary: 4, nba_id: "203897", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203897.png" },
  { id: 36, name: "DEMAR DEROZAN", team: "BULLS", position: "SG", salary: 4, nba_id: "201942", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201942.png" },
  { id: 37, name: "BRADLEY BEAL", team: "SUNS", position: "SG", salary: 4, nba_id: "203078", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203078.png" },
  { id: 38, name: "TYLER HERRO", team: "HEAT", position: "SG", salary: 3, nba_id: "1629639", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629639.png" },
  { id: 39, name: "DESMOND BANE", team: "GRIZZLIES", position: "SG", salary: 3, nba_id: "1630217", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630217.png" },
  { id: 40, name: "JORDAN CLARKSON", team: "JAZZ", position: "SG", salary: 3, nba_id: "203903", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203903.png" },
  { id: 41, name: "CJ MCCOLLUM", team: "PELICANS", position: "SG", salary: 3, nba_id: "203468", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203468.png" },
  { id: 42, name: "KLAY THOMPSON", team: "WARRIORS", position: "SG", salary: 3, nba_id: "202691", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png" },
  { id: 43, name: "ANFERNEE SIMONS", team: "TRAIL BLAZERS", position: "SG", salary: 3, nba_id: "1629014", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629014.png" },
  { id: 44, name: "AUSTIN REAVES", team: "LAKERS", position: "SG", salary: 2, nba_id: "1630559", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630559.png" },
  { id: 45, name: "JALEN GREEN", team: "ROCKETS", position: "SG", salary: 3, nba_id: "1630224", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630224.png" },
  { id: 46, name: "RJ BARRETT", team: "RAPTORS", position: "SG", salary: 2, nba_id: "1629628", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629628.png" },
  { id: 47, name: "JORDAN HAWKINS", team: "PELICANS", position: "SG", salary: 2, nba_id: "1641712", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" },
  { id: 48, name: "DERRICK WHITE", team: "CELTICS", position: "SG", salary: 2, nba_id: "1628401", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628401.png" },
  { id: 49, name: "GARY TRENT JR", team: "BUCKS", position: "SG", salary: 2, nba_id: "1629018", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629018.png" },
  { id: 50, name: "BUDDY HIELD", team: "WARRIORS", position: "SG", salary: 2, nba_id: "1627741", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627741.png" },
  
  // SMALL FORWARDS (SF) - SALARY 1-5
  { id: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", salary: 5, nba_id: "2544", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png" },
  { id: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", salary: 5, nba_id: "201142", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png" },
  { id: 63, name: "JAYSON TATUM", team: "CELTICS", position: "SF", salary: 5, nba_id: "1628369", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png" },
  { id: 64, name: "KAWHI LEONARD", team: "CLIPPERS", position: "SF", salary: 5, nba_id: "202695", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png" },
  { id: 65, name: "JIMMY BUTLER", team: "HEAT", position: "SF", salary: 4, nba_id: "202710", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png" },
  { id: 66, name: "PAUL GEORGE", team: "76ERS", position: "SF", salary: 4, nba_id: "202331", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png" },
  { id: 67, name: "LAURI MARKKANEN", team: "JAZZ", position: "SF", salary: 4, nba_id: "1628374", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628374.png" },
  { id: 68, name: "FRANZ WAGNER", team: "MAGIC", position: "SF", salary: 3, nba_id: "1630532", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630532.png" },
  { id: 69, name: "SCOTTIE BARNES", team: "RAPTORS", position: "SF", salary: 3, nba_id: "1630567", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png" },
  { id: 70, name: "BRANDON INGRAM", team: "PELICANS", position: "SF", salary: 4, nba_id: "1627742", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627742.png" },
  { id: 71, name: "OG ANUNOBY", team: "KNICKS", position: "SF", salary: 3, nba_id: "1628384", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628384.png" },
  { id: 72, name: "MIKAL BRIDGES", team: "NETS", position: "SF", salary: 3, nba_id: "1628969", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628969.png" },
  { id: 73, name: "DE'ANDRE HUNTER", team: "HAWKS", position: "SF", salary: 2, nba_id: "1629631", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629631.png" },
  { id: 74, name: "HERBERT JONES", team: "PELICANS", position: "SF", salary: 2, nba_id: "1630529", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630529.png" },
  { id: 75, name: "ANDREW WIGGINS", team: "WARRIORS", position: "SF", salary: 2, nba_id: "203952", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203952.png" },
  { id: 76, name: "KELDON JOHNSON", team: "SPURS", position: "SF", salary: 2, nba_id: "1629640", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629640.png" },
  { id: 77, name: "DILLON BROOKS", team: "ROCKETS", position: "SF", salary: 2, nba_id: "1628415", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628415.png" },
  { id: 78, name: "BOGDAN BOGDANOVIC", team: "HAWKS", position: "SF", salary: 2, nba_id: "203992", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203992.png" },
  { id: 79, name: "HARRISON BARNES", team: "KINGS", position: "SF", salary: 2, nba_id: "203084", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203084.png" },
  { id: 80, name: "KELLY OUBRE JR", team: "76ERS", position: "SF", salary: 2, nba_id: "1626162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626162.png" },
  
  // POWER FORWARDS (PF) - SALARY 1-5
  { id: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", salary: 5, nba_id: "203507", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png" },
  { id: 92, name: "ZION WILLIAMSON", team: "PELICANS", position: "PF", salary: 5, nba_id: "1629627", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png" },
  { id: 93, name: "PAOLO BANCHERO", team: "MAGIC", position: "PF", salary: 4, nba_id: "1631094", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png" },
  { id: 94, name: "JULIUS RANDLE", team: "KNICKS", position: "PF", salary: 4, nba_id: "203944", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203944.png" },
  { id: 95, name: "JAREN JACKSON JR", team: "GRIZZLIES", position: "PF", salary: 4, nba_id: "1628991", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628991.png" },
  { id: 96, name: "JABARI SMITH JR", team: "ROCKETS", position: "PF", salary: 3, nba_id: "1631095", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631095.png" },
  { id: 97, name: "JOHN COLLINS", team: "JAZZ", position: "PF", salary: 3, nba_id: "1628381", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628381.png" },
  { id: 98, name: "EVAN MOBLEY", team: "CAVALIERS", position: "PF", salary: 4, nba_id: "1630596", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630596.png" },
  { id: 99, name: "PASCAL SIAKAM", team: "PACERS", position: "PF", salary: 4, nba_id: "1627783", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627783.png" },
  { id: 100, name: "TOBIAS HARRIS", team: "PISTONS", position: "PF", salary: 2, nba_id: "202699", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202699.png" },
  { id: 101, name: "JERAMI GRANT", team: "TRAIL BLAZERS", position: "PF", salary: 3, nba_id: "203924", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203924.png" },
  { id: 102, name: "AARON GORDON", team: "NUGGETS", position: "PF", salary: 3, nba_id: "203932", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203932.png" },
  { id: 103, name: "KYLE KUZMA", team: "WIZARDS", position: "PF", salary: 2, nba_id: "1628398", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628398.png" },
  { id: 104, name: "KEEGAN MURRAY", team: "KINGS", position: "PF", salary: 2, nba_id: "1631093", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631093.png" },
  { id: 105, name: "DRAYMOND GREEN", team: "WARRIORS", position: "PF", salary: 2, nba_id: "203110", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203110.png" },
  { id: 106, name: "PJ WASHINGTON", team: "MAVERICKS", position: "PF", salary: 2, nba_id: "1629023", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629023.png" },
  { id: 107, name: "JALEN WILLIAMS", team: "THUNDER", position: "PF", salary: 3, nba_id: "1631116", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631116.png" },
  { id: 108, name: "JONATHAN KUMINGA", team: "WARRIORS", position: "PF", salary: 2, nba_id: "1630228", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630228.png" },
  { id: 109, name: "TREY MURPHY III", team: "PELICANS", position: "PF", salary: 2, nba_id: "1630530", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630530.png" },
  { id: 110, name: "BOBBY PORTIS", team: "BUCKS", position: "PF", salary: 2, nba_id: "1626171", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626171.png" },
  
  // CENTERS (C) - SALARY 1-5
  { id: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", salary: 5, nba_id: "203999", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png" },
  { id: 122, name: "JOEL EMBIID", team: "76ERS", position: "C", salary: 5, nba_id: "203954", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png" },
  { id: 123, name: "RUDY GOBERT", team: "TIMBERWOLVES", position: "C", salary: 4, nba_id: "203497", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203497.png" },
  { id: 124, name: "BAM ADEBAYO", team: "HEAT", position: "C", salary: 4, nba_id: "1628389", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628389.png" },
  { id: 125, name: "DOMANTAS SABONIS", team: "KINGS", position: "C", salary: 4, nba_id: "1627734", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627734.png" },
  { id: 126, name: "KARL-ANTHONY TOWNS", team: "TIMBERWOLVES", position: "C", salary: 4, nba_id: "1626157", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626157.png" },
  { id: 127, name: "CLINT CAPELA", team: "HAWKS", position: "C", salary: 3, nba_id: "203991", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203991.png" },
  { id: 128, name: "MYLES TURNER", team: "PACERS", position: "C", salary: 3, nba_id: "1626167", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626167.png" },
  { id: 129, name: "BROOK LOPEZ", team: "BUCKS", position: "C", salary: 3, nba_id: "201572", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201572.png" },
  { id: 130, name: "JONAS VALANCIUNAS", team: "PELICANS", position: "C", salary: 3, nba_id: "202685", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202685.png" },
  { id: 131, name: "WENDELL CARTER JR", team: "MAGIC", position: "C", salary: 2, nba_id: "1628976", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628976.png" },
  { id: 132, name: "MITCHELL ROBINSON", team: "KNICKS", position: "C", salary: 2, nba_id: "1629011", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629011.png" },
  { id: 133, name: "JARRETT ALLEN", team: "CAVALIERS", position: "C", salary: 2, nba_id: "1628386", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628386.png" },
  { id: 134, name: "DANIEL GAFFORD", team: "MAVERICKS", position: "C", salary: 2, nba_id: "1629655", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629655.png" },
  { id: 135, name: "MASON PLUMLEE", team: "CLIPPERS", position: "C", salary: 2, nba_id: "203486", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203486.png" },
  { id: 136, name: "KEVON LOONEY", team: "WARRIORS", position: "C", salary: 2, nba_id: "1626172", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626172.png" },
  { id: 137, name: "ROBERT WILLIAMS III", team: "TRAIL BLAZERS", position: "C", salary: 2, nba_id: "1629057", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629057.png" },
  { id: 138, name: "NICOLAS CLAXTON", team: "NETS", position: "C", salary: 2, nba_id: "1629651", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629651.png" },
  { id: 139, name: "ZACH COLLINS", team: "SPURS", position: "C", salary: 2, nba_id: "1628380", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628380.png" },
  { id: 140, name: "CHRISTIAN WOOD", team: "LAKERS", position: "C", salary: 2, nba_id: "1626174", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626174.png" }
];

async function importPlayers() {
  try {
    console.log('Starting player import...');
    
    // Clear existing players
    await pool.query('DELETE FROM players');
    console.log('Cleared existing players');
    
    // Insert all players
    for (const player of PLAYERS) {
      await pool.query(
        `INSERT INTO players (id, name, team, position, salary, nba_id, photo) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [player.id, player.name, player.team, player.position, player.salary, player.nba_id, player.photo]
      );
    }
    
    console.log(`Successfully imported ${PLAYERS.length} players to database`);
    
    // Initialize player stats with zeros
    for (const player of PLAYERS) {
      await pool.query(
        `INSERT INTO player_stats (player_id, game_date, pts, reb, ast, stl, blk, "to", fgm, fga, ftm, fta, fantasy_points, is_playing)
         VALUES ($1, CURRENT_DATE, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false)
         ON CONFLICT (player_id, game_date) DO NOTHING`,
        [player.id]
      );
    }
    
    console.log('Initialized player stats');
    
  } catch (error) {
    console.error('Error importing players:', error);
  } finally {
    await pool.end();
  }
}

importPlayers();
