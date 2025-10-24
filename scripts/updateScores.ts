import hre from "hardhat";
const { ethers } = hre;
import fetch from 'node-fetch';

async function main() {
  const contractAddress = "0x0F9Eb62C5163414E0df3DECf9D2016E76B38b557";
  
  const NBAFantasy = await ethers.getContractFactory("NBAFantasy");
  const nbaFantasy = NBAFantasy.attach(contractAddress);
  
  console.log("Fetching latest NBA stats and updating scores...\n");
  
  // Example: Update Luka Doncic (ID: 1)
  // In real implementation, you'd fetch from NBA API
  
  // Mock stats for demonstration
  const playerStats = [
    { id: 1, pts: 28, reb: 8, ast: 9, stl: 1, blk: 0, to: 3 },  // Luka
    { id: 2, pts: 32, reb: 5, ast: 6, stl: 2, blk: 0, to: 4 },  // Curry
    // Add more...
  ];
  
  for (const stat of playerStats) {
    // Calculate fantasy points
    const fantasyPoints = Math.floor(
      (stat.pts * 1) + 
      (stat.reb * 1.2) + 
      (stat.ast * 1.5) + 
      (stat.stl * 3) + 
      (stat.blk * 3) + 
      (stat.to * -1)
    );
    
    console.log(`Updating Player ${stat.id}: ${fantasyPoints} fantasy points`);
    const tx = await nbaFantasy.updatePlayerScore(stat.id, fantasyPoints);
    await tx.wait();
    console.log(`✅ Updated!\n`);
  }
  
  console.log("All scores updated!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});