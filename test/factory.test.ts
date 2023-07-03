import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { setupContractsFixture } from "./utils";
import { WorldgramBase, NFTFactory, NFT721 } from "../typechain-types";
import { ethers } from "hardhat";

const baseUri = "ipfs://XXX/";
const maxSupply = 100;
const publicSalePrice = ethers.parseEther("0.1");
const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // 2nd address hardhat

describe.only("NFTFactory contract nft tests", async () => {
  let base: WorldgramBase,
    factory: NFTFactory,
    nft: NFT721,
    owner: SignerWithAddress,
    nftAddr,
    nftContract;

  beforeEach("Setup", async () => {
    ({ base, nft, factory, owner } = await loadFixture(setupContractsFixture));
  });

  it("should revert when not called by base", async () => {
    await expect(
      factory.createNFT(
        "Worldgram",
        "WGM",
        baseUri,
        maxSupply,
        publicSalePrice,
        recipient
      )
    ).to.be.revertedWith("Only base authorized");
  });

  it("should create a new nft clone when called from base", async () => {
    const tx = await base.newNFT(
      "Worldgram",
      "WGM",
      baseUri,
      maxSupply,
      publicSalePrice,
      recipient
    );
    const receipt = await tx.wait();
    // const nftId =
    //   receipt?.events &&
    //   receipt.events[2].args &&
    //   receipt.events[2].args._nftId;
    receipt && console.log("receipt :>> ", receipt);
    // const nftLib = await base.getNFT(nftId);
    // nftAddr = nftLib.addressContract;
    // nftContract = nft.attach(nftAddr);
    // const nftData = await nftContract.nftData();

    // expect(nftData.name).to.equal("Lambo");
    // expect(nftData.price).to.equal(200000);
    // expect(nftData.secondHand).to.equal(true);
    // expect(nftData.owner).to.equal(owner.address);
  });
});
