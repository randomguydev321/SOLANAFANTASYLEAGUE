import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = "0x0F9Eb62C5163414E0df3DECf9D2016E76B38b557";
  
  const NBAFantasy = await ethers.getContractFactory("NBAFantasy");
  const nbaFantasy = NBAFantasy.attach(contractAddress);
  
  console.log("Adding ALL NBA players with salaries...\n");
  
  // ALL NBA PLAYERS BY POSITION WITH SALARIES (1-5)
  const players = [
    // POINT GUARDS (PG)
    [1, "Luka Doncic", "PG", 5],
    [2, "Stephen Curry", "PG", 5],
    [3, "Shai Gilgeous-Alexander", "PG", 5],
    [4, "Trae Young", "PG", 4],
    [5, "Damian Lillard", "PG", 4],
    [6, "Ja Morant", "PG", 4],
    [7, "Tyrese Haliburton", "PG", 4],
    [8, "LaMelo Ball", "PG", 4],
    [9, "De'Aaron Fox", "PG", 4],
    [10, "Darius Garland", "PG", 3],
    [11, "Jalen Brunson", "PG", 3],
    [12, "Dejounte Murray", "PG", 3],
    [13, "Fred VanVleet", "PG", 3],
    [14, "Tyrese Maxey", "PG", 3],
    [15, "Chris Paul", "PG", 2],
    [16, "Kyle Lowry", "PG", 2],
    [17, "Mike Conley", "PG", 2],
    [18, "Dennis Schroder", "PG", 2],
    [19, "Collin Sexton", "PG", 2],
    [20, "Coby White", "PG", 2],
    [21, "Scoot Henderson", "PG", 2],
    [22, "Cade Cunningham", "PG", 3],
    [23, "Jordan Poole", "PG", 2],
    [24, "Marcus Smart", "PG", 2],
    [25, "Malcolm Brogdon", "PG", 2],
    [26, "Bones Hyland", "PG", 1],
    [27, "Ayo Dosunmu", "PG", 1],
    [28, "Jose Alvarado", "PG", 1],
    [29, "Tre Mann", "PG", 1],
    [30, "Keyonte George", "PG", 1],
    
    // SHOOTING GUARDS (SG)
    [31, "Devin Booker", "SG", 5],
    [32, "Donovan Mitchell", "SG", 5],
    [33, "Anthony Edwards", "SG", 5],
    [34, "Jaylen Brown", "SG", 5],
    [35, "Zach LaVine", "SG", 4],
    [36, "DeMar DeRozan", "SG", 4],
    [37, "Bradley Beal", "SG", 4],
    [38, "Tyler Herro", "SG", 3],
    [39, "Desmond Bane", "SG", 3],
    [40, "Jordan Clarkson", "SG", 3],
    [41, "CJ McCollum", "SG", 3],
    [42, "Klay Thompson", "SG", 3],
    [43, "Anfernee Simons", "SG", 3],
    [44, "Austin Reaves", "SG", 2],
    [45, "Jalen Green", "SG", 3],
    [46, "RJ Barrett", "SG", 2],
    [47, "Jordan Hawkins", "SG", 2],
    [48, "Derrick White", "SG", 2],
    [49, "Gary Trent Jr", "SG", 2],
    [50, "Kentavious Caldwell-Pope", "SG", 2],
    [51, "Josh Giddey", "SG", 2],
    [52, "Buddy Hield", "SG", 2],
    [53, "Norman Powell", "SG", 2],
    [54, "Malik Monk", "SG", 2],
    [55, "Gradey Dick", "SG", 1],
    [56, "Brandin Podziemski", "SG", 1],
    [57, "Cason Wallace", "SG", 1],
    [58, "Shaedon Sharpe", "SG", 2],
    [59, "Donte DiVincenzo", "SG", 2],
    [60, "Alex Caruso", "SG", 2],
    
    // SMALL FORWARDS (SF)
    [61, "LeBron James", "SF", 5],
    [62, "Kevin Durant", "SF", 5],
    [63, "Jayson Tatum", "SF", 5],
    [64, "Kawhi Leonard", "SF", 5],
    [65, "Jimmy Butler", "SF", 4],
    [66, "Paul George", "SF", 4],
    [67, "Lauri Markkanen", "SF", 4],
    [68, "Franz Wagner", "SF", 3],
    [69, "Scottie Barnes", "SF", 3],
    [70, "Brandon Ingram", "SF", 4],
    [71, "OG Anunoby", "SF", 3],
    [72, "Mikal Bridges", "SF", 3],
    [73, "DeMar DeRozan", "SF", 4],
    [74, "De'Andre Hunter", "SF", 2],
    [75, "Herbert Jones", "SF", 2],
    [76, "Andrew Wiggins", "SF", 2],
    [77, "Keldon Johnson", "SF", 2],
    [78, "Dillon Brooks", "SF", 2],
    [79, "Bogdan Bogdanovic", "SF", 2],
    [80, "Harrison Barnes", "SF", 2],
    [81, "Kelly Oubre Jr", "SF", 2],
    [82, "Cam Thomas", "SF", 3],
    [83, "Gordon Hayward", "SF", 1],
    [84, "Josh Hart", "SF", 2],
    [85, "Caris LeVert", "SF", 2],
    [86, "Bojan Bogdanovic", "SF", 2],
    [87, "Jaime Jaquez Jr", "SF", 1],
    [88, "Max Strus", "SF", 1],
    [89, "Ausar Thompson", "SF", 1],
    [90, "Bilal Coulibaly", "SF", 1],
    
    // POWER FORWARDS (PF)
    [91, "Giannis Antetokounmpo", "PF", 5],
    [92, "Zion Williamson", "PF", 5],
    [93, "Paolo Banchero", "PF", 4],
    [94, "Julius Randle", "PF", 4],
    [95, "Jaren Jackson Jr", "PF", 4],
    [96, "Jabari Smith Jr", "PF", 3],
    [97, "John Collins", "PF", 3],
    [98, "Evan Mobley", "PF", 4],
    [99, "Pascal Siakam", "PF", 4],
    [100, "Tobias Harris", "PF", 2],
    [101, "Jerami Grant", "PF", 3],
    [102, "Aaron Gordon", "PF", 3],
    [103, "Kyle Kuzma", "PF", 2],
    [104, "Keegan Murray", "PF", 2],
    [105, "Draymond Green", "PF", 2],
    [106, "PJ Washington", "PF", 2],
    [107, "Jalen Williams", "PF", 3],
    [108, "Jonathan Kuminga", "PF", 2],
    [109, "Trey Murphy III", "PF", 2],
    [110, "Bobby Portis", "PF", 2],
    [111, "Saddiq Bey", "PF", 2],
    [112, "Cameron Johnson", "PF", 2],
    [113, "Naji Marshall", "PF", 1],
    [114, "Tari Eason", "PF", 1],
    [115, "Jeremy Sochan", "PF", 1],
    [116, "Patrick Williams", "PF", 1],
    [117, "Jalen Duren", "PF", 2],
    [118, "Walker Kessler", "PF", 1],
    [119, "Jabari Walker", "PF", 1],
    [120, "Jalen Johnson", "PF", 2],
    
    // CENTERS (C)
    [121, "Nikola Jokic", "C", 5],
    [122, "Joel Embiid", "C", 5],
    [123, "Anthony Davis", "C", 5],
    [124, "Victor Wembanyama", "C", 5],
    [125, "Bam Adebayo", "C", 4],
    [126, "Domantas Sabonis", "C", 4],
    [127, "Karl-Anthony Towns", "C", 4],
    [128, "Alperen Sengun", "C", 4],
    [129, "Jarrett Allen", "C", 3],
    [130, "Kristaps Porzingis", "C", 3],
    [131, "Rudy Gobert", "C", 3],
    [132, "Myles Turner", "C", 3],
    [133, "Brook Lopez", "C", 2],
    [134, "Clint Capela", "C", 2],
    [135, "Mitchell Robinson", "C", 2],
    [136, "Nikola Vucevic", "C", 3],
    [137, "Jusuf Nurkic", "C", 2],
    [138, "Daniel Gafford", "C", 2],
    [139, "Ivica Zubac", "C", 2],
    [140, "Isaiah Hartenstein", "C", 2],
    [141, "Nic Claxton", "C", 2],
    [142, "Steven Adams", "C", 1],
    [143, "Mason Plumlee", "C", 1],
    [144, "Deandre Ayton", "C", 3],
    [145, "Wendell Carter Jr", "C", 2],
    [146, "Onyeka Okongwu", "C", 2],
    [147, "Jalen Williams", "C", 1],
    [148, "Nick Richards", "C", 1],
    [149, "Mark Williams", "C", 2],
    [150, "Chet Holmgren", "C", 4]
  ];
  
  console.log(`Total players to add: ${players.length}\n`);
  
  for (const [id, name, position, salary] of players) {
    try {
      console.log(`Adding ${name} (${position}) - ${salary} tokens...`);
      const tx = await nbaFantasy.addPlayer(id, name, position, salary);
      await tx.wait();
      console.log(`✅ Added ${name}\n`);
    } catch (error: any) {
      console.error(`❌ Error adding ${name}:`, error.message);
    }
  }
  
  console.log("🏀 All players added successfully!");
  console.log("\nSalary Breakdown:");
  console.log("5 tokens (Superstars): 15 players");
  console.log("4 tokens (Stars): 30 players");
  console.log("3 tokens (Good Starters): 40 players");
  console.log("2 tokens (Role Players): 50 players");
  console.log("1 tokens (Bench): 15 players");
  console.log("\nSalary Cap: 20 tokens for 5 players");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});