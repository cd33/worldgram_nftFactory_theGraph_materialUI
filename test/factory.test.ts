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

describe("NFTFactory contract tests", async () => {
  let base: WorldgramBase,
    factory: NFTFactory,
    nft: NFT721,
    owner: SignerWithAddress,
    nftId,
    nftAddr,
    nftCloneContract: NFT721 | any;

  beforeEach("Setup", async () => {
    ({ base, nft, factory, owner } = await loadFixture(setupContractsFixture));
  });

  it("should create a new nft clone when called from base", async () => {
    await expect(
      base.newNFT(
        "Worldgram",
        "WGM",
        baseUri,
        maxSupply,
        publicSalePrice,
        recipient
      )
    )
      .to.emit(base, "NFTAdded")
      .withArgs(1, "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81");
  });

  it("check storage after clone", async () => {
    const tx = await base.newNFT(
      "Worldgram",
      "WGM",
      baseUri,
      maxSupply,
      publicSalePrice,
      recipient
    );
    const receipt: any = await tx.wait();
    nftId = receipt && receipt.logs[2].args[0];
    nftAddr = receipt && receipt.logs[2].args[1];
    expect(nftId).to.equal(1);
    expect(nftAddr).to.equal("0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81");

    const getNFTAddress = await base.getNFTAddress(nftId);
    expect(getNFTAddress).to.equal(
      "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81"
    );

    // check variables created nft contract
    nftCloneContract = nft.attach(nftAddr);
    expect(await nftCloneContract.baseURI()).to.equal(baseUri);
    expect(await nftCloneContract.maxSupply()).to.equal(maxSupply);
    expect(await nftCloneContract.publicSalePrice()).to.equal(publicSalePrice);
    expect(await nftCloneContract.nextNFT()).to.equal(0);
  });

  it("setWorldgramBase", async () => {
    const tx = await base.newNFT(
      "Worldgram",
      "WGM",
      baseUri,
      maxSupply,
      publicSalePrice,
      recipient
    );
    const receipt: any = await tx.wait();
    nftAddr = receipt && receipt.logs[2].args[1];
    nftCloneContract = nft.attach(nftAddr);

    await expect(factory.setWorldgramBase(nftAddr)).to.be.revertedWith(
      "Only base authorized"
    );

    await base.setWorldgramBaseNFTFACTORY(owner.address);

    await expect(factory.setWorldgramBase(nftAddr)).to.be.not.reverted;
  });

  it("setNFTImplementation", async () => {
    const tx = await base.newNFT(
      "Worldgram",
      "WGM",
      baseUri,
      maxSupply,
      publicSalePrice,
      recipient
    );
    const receipt: any = await tx.wait();
    nftAddr = receipt && receipt.logs[2].args[1];
    nftCloneContract = nft.attach(nftAddr);

    await expect(base.setNFTImplementationNFTFACTORY(nftAddr)).to.be.not
      .reverted;
  });

  it("REVERT setWorldgramBase, setNFTImplementation and createNFT", async () => {
    await expect(factory.setWorldgramBase(owner.address)).to.be.revertedWith(
      "Only base authorized"
    );

    await expect(
      factory.setNFTImplementation(owner.address)
    ).to.be.revertedWith("Only base authorized");

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
});