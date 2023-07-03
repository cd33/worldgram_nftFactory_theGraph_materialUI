// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { Worldgram721 } from "../typechain-types/contracts";

// describe("Worldgram721", function () {
//   let worldgram: Worldgram721;

//   const baseURI = "ipfs://XXX/";
//   const MAX_SUPPLY = 1000;
//   const publicSalePrice = Number(ethers.parseEther("0.1"));

//   const priceNFT = (amount: number) => (amount * publicSalePrice).toString();

//   beforeEach(async function () {
//     [this.owner, this.investor, this.user] = await ethers.getSigners(); // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 et 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
//     worldgram = await ethers.deployContract("Worldgram721", [baseURI]);
//     await worldgram.waitForDeployment();
//   });

//   describe("PUBLIC SALE", function () {
//     it("PublicSaleMint publicSaleMint() tests argents", async function () {
//       await worldgram.setStep(1);
//       let balanceUserNFT = await worldgram.balanceOf(this.user.address);
//       expect(balanceUserNFT).to.equal(0);
//       const balanceUserETHBefore = await ethers.provider.getBalance(
//         this.user.address
//       );
//       const balanceInvestorETHBefore = await ethers.provider.getBalance(
//         this.investor.address
//       );

//       const mint = await worldgram
//         .connect(this.user)
//         .publicSaleMint(1, { value: priceNFT(1) });
//       await mint.wait();

//       balanceUserNFT = await worldgram.balanceOf(this.user.address);
//       expect(balanceUserNFT).to.equal(1);
//       const balanceUserETHAfter = await ethers.provider.getBalance(
//         this.user.address
//       );
//       const balanceInvestorETHAfter = await ethers.provider.getBalance(
//         this.investor.address
//       );
//       expect(balanceUserETHBefore).to.be.gt(balanceUserETHAfter);
//       expect(balanceInvestorETHBefore).to.be.lt(balanceInvestorETHAfter);
//     });

//     it("REVERT: publicSaleMint() Not active", async function () {
//       await expect(
//         worldgram.publicSaleMint(1, { value: priceNFT(1) })
//       ).to.be.revertedWith("Public sale not active");
//     });

//     it("REVERT: publicSaleMint() Quantity must be greater than 0", async function () {
//       await worldgram.setStep(1);
//       await expect(worldgram.publicSaleMint(0)).to.be.revertedWith(
//         "Quantity must be greater than 0"
//       );
//     });

//     // it("REVERT: publicSaleMint() & gift() Sold out et tests de balances", async function () {
//     //   await worldgram.setStep(1);
//     //   let currentIdNFT = await worldgram.nextNFT();
//     //   expect(currentIdNFT).to.equal(0);
//     //   let balanceOwnerNFT = await worldgram.balanceOf(this.owner.address);
//     //   expect(balanceOwnerNFT).to.equal(0);

//     //   for (let i = 0; i < 50; i++) {
//     //     await worldgram.publicSaleMint(100, {
//     //       value: priceNFT(100),
//     //     });
//     //   }
//     //   currentIdNFT = await worldgram.nextNFT();
//     //   expect(currentIdNFT).to.equal(5000);
//     //   balanceOwnerNFT = await worldgram.balanceOf(this.owner.address);
//     //   expect(balanceOwnerNFT).to.equal(5000);

//     //   await expect(
//     //     worldgram
//     //       .connect(this.user)
//     //       .publicSaleMint(1, { value: priceNFT(1) })
//     //   ).to.be.revertedWith("Sold out");

//     //   await expect(worldgram.gift(this.investor.address, 3)).to.be.revertedWith(
//     //     "Sold out"
//     //   );
//     // });

//     it("REVERT: publicSaleMint() Not enough money", async function () {
//       await worldgram.setStep(1);
//       await expect(
//         worldgram.publicSaleMint(3, {
//           value: ethers.parseEther("0.00000005"),
//         })
//       ).to.be.revertedWith("Not enough funds");
//     });
//   });

//   describe("GIFT", function () {
//     it("Gift gift()", async function () {
//       let balanceOwnerNFT = await worldgram.balanceOf(this.owner.address);
//       expect(balanceOwnerNFT).to.equal(0);

//       const mint = await worldgram.gift(this.owner.address, 3);
//       await mint.wait();

//       balanceOwnerNFT = await worldgram.balanceOf(this.owner.address);
//       expect(balanceOwnerNFT).to.equal(3);
//     });

//     it("REVERT: gift() Zero address", async function () {
//       await expect(
//         worldgram.gift("0x0000000000000000000000000000000000000000", 3)
//       ).to.be.revertedWith("Zero address");
//     });

//     it("REVERT: gift() Quantity must be greater than 0", async function () {
//       await expect(worldgram.gift(this.owner.address, 0)).to.be.revertedWith(
//         "Quantity must be greater than 0"
//       );
//     });

//     it("REVERT: gift() Not Owner", async function () {
//       await expect(
//         worldgram.connect(this.investor).gift(this.investor.address, 10)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });
//   });

//   describe("Setters, URI, receive", function () {
//     it("SetStep setStep() Changements de steps sellingStep()", async function () {
//       let step = await worldgram.sellingStep();
//       expect(step).to.equal(0);
//       await worldgram.setStep(1);
//       step = await worldgram.sellingStep();
//       expect(step).to.equal(1);
//       await worldgram.setStep(0);
//       step = await worldgram.sellingStep();
//       expect(step).to.equal(0);
//     });

//     it("REVERT: setStep() Not Owner", async function () {
//       await expect(
//         worldgram.connect(this.investor).setStep(1)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("setBaseUri setBaseUri() Changements d'uri", async function () {
//       let uri = await worldgram.baseURI();
//       expect(uri).to.equal(baseURI);
//       await worldgram.setBaseUri("toto");
//       uri = await worldgram.baseURI();
//       expect(uri).to.equal("toto");
//     });

//     it("REVERT: setBaseUri() Not Owner", async function () {
//       await expect(
//         worldgram.connect(this.investor).setBaseUri("toto")
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("REVERT: tokenURI() NFT doesn't exist", async function () {
//       await expect(
//         worldgram.connect(this.investor).tokenURI(0)
//       ).to.be.revertedWith("NFT doesn't exist");
//       await expect(
//         worldgram.connect(this.investor).tokenURI(1)
//       ).to.be.revertedWith("NFT doesn't exist");
//       await worldgram.setStep(1);
//       await worldgram.connect(this.investor).publicSaleMint(2, {
//         value: priceNFT(2),
//       });
//       expect(await worldgram.connect(this.investor).tokenURI(1)).to.equal(
//         baseURI + "1.json"
//       );
//       expect(await worldgram.connect(this.investor).tokenURI(2)).to.equal(
//         baseURI + "2.json"
//       );

//       await worldgram.setBaseUri("");
//       expect(await worldgram.connect(this.investor).tokenURI(1)).to.equal("");
//     });

//     it("setPublicSalePrice()", async function () {
//       let price = await worldgram.publicSalePrice();
//       expect(price).to.equal(publicSalePrice.toString());
//       await worldgram.setPublicSalePrice(200);
//       price = await worldgram.publicSalePrice();
//       expect(price).to.equal(200);
//       await worldgram.setPublicSalePrice(ethers.parseEther("1"));
//       price = await worldgram.publicSalePrice();
//       expect(price).to.equal(ethers.parseEther("1"));
//     });

//     it("REVERT: setPublicSalePrice() Not Owner", async function () {
//       await expect(
//         worldgram.connect(this.investor).setPublicSalePrice(2)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Not allowing receiving ETH outside minting functions, Only if you mint", async function () {
//       const balanceContractETHBefore = await ethers.provider.getBalance(
//         worldgram.target
//       );

//       await expect(
//         this.owner.sendTransaction({
//           to: worldgram.target,
//           value: ethers.parseEther("10"),
//         })
//       ).to.be.revertedWith("Only if you mint");

//       const balanceContractETHAfter = await ethers.provider.getBalance(
//         worldgram.target
//       );
//       expect(balanceContractETHBefore)
//         .to.equal(balanceContractETHAfter)
//         .to.equal(0);
//     });
//   });
// });
