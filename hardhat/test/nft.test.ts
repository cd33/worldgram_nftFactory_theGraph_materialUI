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

const priceNFT = (amount: number) =>
  (amount * Number(publicSalePrice)).toString();

describe("NFT contract tests", async () => {
  let base: WorldgramBase,
    nft: NFT721,
    owner: SignerWithAddress,
    account1: SignerWithAddress,
    account2: SignerWithAddress,
    nftId: number,
    nftAddr: string,
    nftCloneContract: NFT721 | any;

  beforeEach("Setup", async () => {
    ({ base, nft, owner, account1, account2 } = await loadFixture(
      setupContractsFixture
    ));

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
    nftCloneContract = nft.attach(nftAddr);
  });

  describe("Setters, URI, Reverts...", function () {
    it("REVERT: Initializable: contract is already initialized", async () => {
      const getNFTAddress = await base.getNFTAddress(nftId);
      expect(getNFTAddress)
        .to.equal("0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81")
        .to.equal(nftAddr);

      await expect(
        nftCloneContract.initialize(
          "Worldgram",
          "WGM",
          baseUri,
          maxSupply,
          publicSalePrice,
          recipient,
          nftAddr
        )
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("pause, unpause and _beforeTokenTransfer", async () => {
      let isPaused = await nftCloneContract.paused();
      expect(isPaused).to.equal(false);

      await expect(
        nftCloneContract.publicSaleMint(1, {
          value: priceNFT(1),
        })
      ).to.be.not.reverted;

      await base.pause(nftAddr);
      isPaused = await nftCloneContract.paused();
      expect(isPaused).to.equal(true);

      await expect(
        nftCloneContract.publicSaleMint(1, {
          value: priceNFT(1),
        })
      ).to.be.revertedWith("Pausable: paused");

      await base.unpause(nftAddr);
      isPaused = await nftCloneContract.paused();
      expect(isPaused).to.equal(false);

      await expect(
        nftCloneContract.publicSaleMint(1, {
          value: priceNFT(1),
        })
      ).to.be.not.reverted;
    });

    it("setWorldgramBase", async () => {
      await expect(
        nftCloneContract.setWorldgramBase(nftAddr)
      ).to.be.revertedWith("Only base authorized");

      await base.setWorldgramBaseNFT721(nftAddr, owner.address);

      await expect(nftCloneContract.setWorldgramBase(nftAddr)).to.be.not
        .reverted;
    });

    it("setRecipient", async () => {
      await expect(
        nftCloneContract.setRecipient(owner.address)
      ).to.be.revertedWith("Only base authorized");

      await expect(base.setRecipient(nftAddr, owner.address)).to.be.not
        .reverted;
    });

    it("setPublicSalePrice()", async function () {
      let price = await nftCloneContract.publicSalePrice();
      expect(price).to.equal(publicSalePrice.toString());
      await base.setPublicSalePrice(nftAddr, 200);
      price = await nftCloneContract.publicSalePrice();
      expect(price).to.equal(200);
      await base.setPublicSalePrice(nftAddr, ethers.parseEther("1"));
      price = await nftCloneContract.publicSalePrice();
      expect(price).to.equal(ethers.parseEther("1"));
    });

    it("setBaseUri setBaseUri() Changements d'uri", async function () {
      let uri = await nftCloneContract.baseURI();
      expect(uri).to.equal(baseUri);
      await base.setBaseUri(nftAddr, "toto");
      uri = await nftCloneContract.baseURI();
      expect(uri).to.equal("toto");
    });

    it("REVERT: tokenURI() ERC721: invalid token ID", async function () {
      await expect(
        nftCloneContract.connect(account1).tokenURI(0)
      ).to.be.revertedWith("ERC721: invalid token ID");
      await expect(
        nftCloneContract.connect(account1).tokenURI(1)
      ).to.be.revertedWith("ERC721: invalid token ID");

      await nftCloneContract.connect(account1).publicSaleMint(2, {
        value: priceNFT(2),
      });
      expect(await nftCloneContract.connect(account1).tokenURI(1)).to.equal(
        baseUri + "1.json"
      );
      expect(await nftCloneContract.connect(account1).tokenURI(2)).to.equal(
        baseUri + "2.json"
      );

      await base.setBaseUri(nftAddr, "");
      expect(await nftCloneContract.connect(account1).tokenURI(1)).to.equal("");
    });
  });

  describe("PUBLIC SALE", function () {
    it("PublicSaleMint publicSaleMint() tests argents", async function () {
      let currentIdNFT = await nftCloneContract.nextNFT();
      expect(currentIdNFT).to.equal(0);

      let balanceAccount2NFT = await nftCloneContract.balanceOf(
        account2.address
      );
      expect(balanceAccount2NFT).to.equal(0);
      const balanceAccount2ETHBefore = await ethers.provider.getBalance(
        account2.address
      );
      // account1 is the recipient
      const balanceRecipientETHBefore = await ethers.provider.getBalance(
        account1.address
      );

      const mint = await nftCloneContract
        .connect(account2)
        .publicSaleMint(3, { value: priceNFT(3) });
      await mint.wait();

      currentIdNFT = await nftCloneContract.nextNFT();
      expect(currentIdNFT).to.equal(3);

      balanceAccount2NFT = await nftCloneContract.balanceOf(account2.address);
      expect(balanceAccount2NFT).to.equal(3);
      const balanceAccount2ETHAfter = await ethers.provider.getBalance(
        account2.address
      );
      const balanceRecipientETHAfter = await ethers.provider.getBalance(
        account1.address
      );
      expect(balanceAccount2ETHBefore).to.be.gt(balanceAccount2ETHAfter);
      expect(balanceRecipientETHBefore + BigInt(priceNFT(3))).to.be.equal(
        balanceRecipientETHAfter
      );
    });

    it("REVERT: publicSaleMint() Quantity must be greater than 0", async function () {
      await expect(nftCloneContract.publicSaleMint(0)).to.be.revertedWith(
        "Quantity must be greater than 0"
      );
    });

    it("REVERT: gift() Sold out", async function () {
      await nftCloneContract.publicSaleMint(100, { value: priceNFT(100) });
      await expect(
        nftCloneContract.publicSaleMint(1, { value: priceNFT(1) })
      ).to.be.revertedWith("Sold out");
    });

    it("REVERT: publicSaleMint() Not enough funds", async function () {
      await expect(
        nftCloneContract.publicSaleMint(3, {
          value: priceNFT(2),
        })
      ).to.be.revertedWith("Not enough funds");
    });
  });

  describe("GIFT", function () {
    it("Gift gift()", async function () {
      let balanceOwnerNFT = await nftCloneContract.balanceOf(account1.address);
      expect(balanceOwnerNFT).to.equal(0);

      await base.gift(nftAddr, account1.address, 3);

      balanceOwnerNFT = await nftCloneContract.balanceOf(account1.address);
      expect(balanceOwnerNFT).to.equal(3);
    });

    it("REVERT: gift() Zero address", async function () {
      await expect(
        base.gift(nftAddr, "0x0000000000000000000000000000000000000000", 3)
      ).to.be.revertedWith("Zero address");
    });

    it("REVERT: gift() Quantity must be greater than 0", async function () {
      await expect(base.gift(nftAddr, owner.address, 0)).to.be.revertedWith(
        "Quantity must be greater than 0"
      );
    });

    it("REVERT: gift() Sold out", async function () {
      await base.gift(nftAddr, account1.address, 100);
      await expect(base.gift(nftAddr, owner.address, 1)).to.be.revertedWith(
        "Sold out"
      );
    });
  });
});
