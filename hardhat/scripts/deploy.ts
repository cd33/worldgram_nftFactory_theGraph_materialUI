import { ethers, network } from "hardhat";
import verify from "../utils/verify";

async function main() {
  const base = await ethers.deployContract("WorldgramBase", []);
  await base.waitForDeployment();
  console.log("WorldgramBase deployed at: ", base.target);

  const storage = await ethers.deployContract("NFTStorage", [base.target]);
  await storage.waitForDeployment();
  console.log("NFTStorage deployed at: ", storage.target);

  const nft = await ethers.deployContract("NFT721", []);
  await nft.waitForDeployment();
  console.log("NFT721 deployed at: ", nft.target);

  const factory = await ethers.deployContract("NFTFactory", [
    base.target,
    nft.target,
  ]);
  await factory.waitForDeployment();
  console.log("NFTFactory deployed at: ", factory.target);

  await base.setNFTStorage(storage.target);
  await base.setNFTFactory(factory.target);
  console.log("WorldgramBase setted")

  if (network.name === "sepolia") {
    console.log("Wait for 5 blocks...");
    let currentBlock = await ethers.provider.getBlockNumber();
    while (currentBlock + 5 > (await ethers.provider.getBlockNumber())) {}
    await verify(base.target.toString(), []);
    await verify(storage.target.toString(), [base.target]);
    await verify(nft.target.toString(), []);
    await verify(factory.target.toString(), [base.target, nft.target]);
    console.log("Worldgram, NFTStorage, NFT721 and NFTFactory Verified");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
