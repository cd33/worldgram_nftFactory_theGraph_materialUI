import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { setupContractsFixture } from "./utils";
import {
  WorldgramBase,
  NFTStorage,
  NFTFactory,
} from "../typechain-types";
import { ethers } from "hardhat";

const baseUri = "ipfs://XXX/";
const maxSupply = 100;
const publicSalePrice = ethers.parseEther("0.1");
const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // 2nd address hardhat

describe("WorldgramBase contract tests", async () => {
  let base: WorldgramBase,
    storage: NFTStorage,
    factory: NFTFactory,
    owner: SignerWithAddress,
    account1: SignerWithAddress,
    nftId: number,
    nftAddr: string;

  beforeEach("Setup", async () => {
    ({ base, storage, factory, owner, account1 } =
      await loadFixture(setupContractsFixture));

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
  });

  describe("Functions, variables and reverts onlyOnwer", function () {
    it("setNFTStorage", async function () {
      let nftStorage = await base.nftStorage();
      expect(nftStorage).to.equal(storage.target);

      await base.setNFTStorage(nftAddr);
      nftStorage = await base.nftStorage();
      expect(nftStorage).to.equal(nftAddr);

      await base.setNFTStorage(owner.address);
      nftStorage = await base.nftStorage();
      expect(nftStorage).to.equal(owner.address);

      await expect(
        base.connect(account1).setNFTStorage(nftAddr)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setNFTFactory", async function () {
      let nftFactory = await base.nftFactory();
      expect(nftFactory).to.equal(factory.target);

      await base.setNFTFactory(nftAddr);
      nftFactory = await base.nftFactory();
      expect(nftFactory).to.equal(nftAddr);

      await base.setNFTFactory(owner.address);
      nftFactory = await base.nftFactory();
      expect(nftFactory).to.equal(owner.address);

      await expect(
        base.connect(account1).setNFTFactory(nftAddr)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Reverts onlyOwner", function () {
    it("REVERT: newNFT() Not Owner", async function () {
      await expect(
        base
          .connect(account1)
          .newNFT(
            "Worldgram",
            "WGM",
            baseUri,
            maxSupply,
            publicSalePrice,
            recipient
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setWorldgramBaseSTORAGE() Not Owner", async function () {
      await expect(
        base.connect(account1).setWorldgramBaseSTORAGE(nftAddr)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setAddressSTORAGE() Not Owner", async function () {
      const data = ethers.keccak256(
        ethers.solidityPacked(["string", "uint256"], ["nft.addressContract", 3])
      );

      await expect(
        base.connect(account1).setAddressSTORAGE(data, owner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: deleteAddressSTORAGE() Not Owner", async function () {
      const data = ethers.keccak256(
        ethers.solidityPacked(
          ["string", "uint256"],
          ["nft.addressContract", nftId]
        )
      );
      await expect(
        base.connect(account1).deleteAddressSTORAGE(data)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setWorldgramBaseNFTFACTORY() Not Owner", async function () {
      await expect(
        base.connect(account1).setWorldgramBaseNFTFACTORY(nftAddr)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setNFTImplementationNFTFACTORY() Not Owner", async function () {
      await expect(
        base.connect(account1).setNFTImplementationNFTFACTORY(nftAddr)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: pause() Not Owner", async function () {
      await expect(base.connect(account1).pause(nftAddr)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("REVERT: unpause() Not Owner", async function () {
      await expect(base.connect(account1).unpause(nftAddr)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("REVERT: setWorldgramBaseNFT721() Not Owner", async function () {
      await expect(
        base.connect(account1).setWorldgramBaseNFT721(nftAddr, owner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setRecipient() Not Owner", async function () {
      await expect(
        base.connect(account1).setRecipient(nftAddr, owner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setPublicSalePrice() Not Owner", async function () {
      await expect(
        base.connect(account1).setPublicSalePrice(nftAddr, 2)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: setBaseUri() Not Owner", async function () {
      await expect(
        base.connect(account1).setBaseUri(nftAddr, "toto")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("REVERT: gift() Not Owner", async function () {
      await expect(
        base.connect(account1).gift(nftAddr, account1.address, 10)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
