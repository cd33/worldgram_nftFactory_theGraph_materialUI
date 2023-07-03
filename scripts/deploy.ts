import { ethers, network } from "hardhat";
import verify from "../utils/verify";

async function main() {
  const baseUri = "ipfs://XXX/";

  // 1 storage
  // 2 base avec la lib
  // 3 nft
  // 4 factory

  const worldgram = await ethers.deployContract("Worldgram721", [baseUri]);
  await worldgram.waitForDeployment();
  console.log(`Worldgram deployed to ${worldgram.target}`);

  if (network.name === "sepolia") {
    console.log("Verifying Worldgram...");
    // Wait for 5 blocks
    let currentBlock = await ethers.provider.getBlockNumber();
    while (currentBlock + 5 > (await ethers.provider.getBlockNumber())) {}
    await verify(worldgram.target.toString(), [baseUri]);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
