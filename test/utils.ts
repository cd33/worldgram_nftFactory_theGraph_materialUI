import { ethers } from "hardhat";

export const setupContractsFixture = async () => {
  let owner, account1, account2, account3;
  [owner, account1, account2, account3] = await ethers.getSigners();

  const base = await ethers.deployContract("WorldgramBase", []);
  await base.waitForDeployment();

  const storage = await ethers.deployContract("NFTStorage", [base.target]);
  await storage.waitForDeployment();

  const nft = await ethers.deployContract("NFT721", [base.target]);
  await nft.waitForDeployment();

  const factory = await ethers.deployContract("NFTFactory", [
    base.target,
    nft.target,
  ]);
  await factory.waitForDeployment();

  await base.setNFTStorage(storage.target);
  await base.setNFTFactory(factory.target);

  return {
    storage,
    base,
    nft,
    factory,
    owner,
    account1,
    account2,
    account3,
  };
};
