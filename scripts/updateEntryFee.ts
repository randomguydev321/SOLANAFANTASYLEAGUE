import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const contractAddress = "0xAEC81F920DF7a1880CDBE2585fA103F5b75099c3";
  
  const NBAFantasy = await ethers.getContractFactory("NBAFantasy");
  const nbaFantasy = NBAFantasy.attach(contractAddress);
  
  console.log("Updating entry fee to 0.1 BNB...");
  
  const newFee = ethers.parseEther("0.1"); // 0.1 BNB
  const tx = await nbaFantasy.setEntryFee(newFee);
  await tx.wait();
  
  console.log("✅ Entry fee updated to 0.1 BNB!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});