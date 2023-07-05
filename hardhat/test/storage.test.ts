import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { setupContractsFixture } from "./utils";
import { WorldgramBase, NFTStorage } from "../typechain-types";
import { ethers } from "hardhat";

const baseUri = "ipfs://XXX/";
const maxSupply = 100;
const publicSalePrice = ethers.parseEther("0.1");
const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // 2nd address hardhat

describe("Storage contract tests", async () => {
  let base: WorldgramBase,
    storage: NFTStorage,
    owner: SignerWithAddress,
    nftId: number;

  beforeEach("Setup", async () => {
    ({ base, storage, owner } = await loadFixture(setupContractsFixture));

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
  });

  it("Set, Get and Delete from base and in direct", async () => {
    const data = ethers.keccak256(
      ethers.solidityPacked(
        ["string", "uint256"],
        ["nft.addressContract", nftId]
      )
    );
    let addressContract = await storage.getAddressNFT(data);
    const addressContractFromBase = await base.getNFTAddress(nftId);
    expect(addressContract)
      .to.equal(addressContractFromBase)
      .to.equal("0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81");

    await base.setAddressSTORAGE(data, owner.address);
    addressContract = await storage.getAddressNFT(data);
    expect(addressContract).to.equal(owner.address);

    await base.deleteAddressSTORAGE(data);
    addressContract = await storage.getAddressNFT(data);
    expect(addressContract).to.equal(
      "0x0000000000000000000000000000000000000000"
    );

    await expect(storage.setAddressNFT(data, owner.address)).to.be.revertedWith(
      "Only base authorized"
    );
    await expect(storage.deleteAddressNFT(data)).to.be.revertedWith(
      "Only base authorized"
    );

    await base.setWorldgramBaseSTORAGE(owner.address);

    await storage.setAddressNFT(data, owner.address);
    addressContract = await storage.getAddressNFT(data);
    expect(addressContract).to.equal(owner.address);

    await storage.deleteAddressNFT(data);
    addressContract = await storage.getAddressNFT(data);
    expect(addressContract).to.equal(
      "0x0000000000000000000000000000000000000000"
    );
  });
});
