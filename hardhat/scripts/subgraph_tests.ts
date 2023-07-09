import { ethers } from "hardhat";
import {
  baseUri,
  maxSupply,
  nft721,
  priceNFT,
  publicSalePrice,
  recipient,
  worldgramBase,
} from "../utils/variables-helper";

async function main() {
  let owner, account1, account2;
  [owner, account1, account2] = await ethers.getSigners();

  const base = await ethers.getContractAt("WorldgramBase", worldgramBase);
  const nft = await ethers.getContractAt("NFT721", nft721);

  // Creation of an NFT contracts
  let tx = await base.newNFT(
    "Worldgram",
    "WGM",
    baseUri,
    maxSupply,
    publicSalePrice,
    recipient
  );
  let receipt: any = await tx.wait();
  let nftId = receipt && receipt.logs[2].args[0];
  let nftAddr = receipt && receipt.logs[2].args[1];
  let nftCloneContract: any = nft.attach(nftAddr);

  // Purchase of NFT by owner, account1 and account2
  await nftCloneContract
    .connect(owner)
    .publicSaleMint(1, { value: priceNFT(1) });
  await nftCloneContract
    .connect(account1)
    .publicSaleMint(2, { value: priceNFT(2) });
  await nftCloneContract
    .connect(account2)
    .publicSaleMint(3, { value: priceNFT(3) });

  // Creation of a second NFT contract
  tx = await base.newNFT(
    "Toto",
    "TOT",
    baseUri,
    maxSupply,
    publicSalePrice,
    recipient
  );
  receipt = await tx.wait();
  nftId = receipt && receipt.logs[2].args[0];
  nftAddr = receipt && receipt.logs[2].args[1];
  nftCloneContract = nft.attach(nftAddr);

  // Purchase of NFT by account1 and account2
  await nftCloneContract
    .connect(account1)
    .publicSaleMint(5, { value: priceNFT(5) });
  await nftCloneContract
    .connect(account2)
    .publicSaleMint(8, { value: priceNFT(8) });

  // Creation of a third NFT contract
  tx = await base.newNFT(
    "Toto",
    "TOT",
    baseUri,
    maxSupply,
    publicSalePrice,
    recipient
  );
  receipt = await tx.wait();
  nftId = receipt && receipt.logs[2].args[0];
  nftAddr = receipt && receipt.logs[2].args[1];
  nftCloneContract = nft.attach(nftAddr);

  // Gift of NFT by owner, account1 and account2
  await base.gift(nftAddr, owner.address, 7);
  await base.gift(nftAddr, account1.address, 2);
  await base.gift(nftAddr, account2.address, 4);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
