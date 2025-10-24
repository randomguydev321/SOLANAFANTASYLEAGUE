
import hre from "hardhat";
const ethers = hre.ethers;

async function main() {
  console.log("Deploying NBAFantasy contract to BSC Testnet...");

  const NBAFantasy = await ethers.getContractFactory("NBAFantasy");
  const nbaFantasy = await NBAFantasy.deploy();

  await nbaFantasy.waitForDeployment();

  const address = await nbaFantasy.getAddress();
  console.log("NBAFantasy deployed to:", address);
  console.log("\n🔥 SAVE THIS ADDRESS! You'll need it for everything.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});