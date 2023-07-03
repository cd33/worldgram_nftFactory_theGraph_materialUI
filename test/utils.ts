import { ethers } from "hardhat";

export const setupContractsFixture = async () => {
  let owner, account1, account2, account3;
  [owner, account1, account2, account3] = await ethers.getSigners();

  // BASE EN PREMIER

  // 1 storage
  const storage = await ethers.deployContract("NFTStorage", []);
  await storage.waitForDeployment();

  // 2 base avec la lib
  // const library = await ethers.deployContract("NFTStorageLibrary", []);
  // await library.waitForDeployment();

  // const LibraryContract = await ethers.getContractFactory("NFTStorageLibrary");
  // const library = await LibraryContract.deploy();

  // const WorldgramBase = await ethers.getContractFactory("WorldgramBase", {
  //   libraries: {
  //     LibraryContract: library.target,
  //   },
  // });
  // const worldgramBase = await WorldgramBase.deploy(storage.target);
  // const base = await ethers.getContractAt(
  //   "WorldgramBase",
  //   worldgramBase.target
  // );

  const base = await ethers.deployContract("WorldgramBase", [storage.target]);
  await base.waitForDeployment();

  // 3 nft
  const nft = await ethers.deployContract("NFT721", [base.target]);
  await nft.waitForDeployment();

  // 4 factory
  console.log('base.target, :>> ', base.target, nft.target);
  const factory = await ethers.deployContract("NFTFactory", [
    base.target,
    nft.target,
  ]);
  await factory.waitForDeployment();

  await base.setWorldgramBaseSTORAGE(base.target);
  await base.setNFTFactory(nft.target);

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
