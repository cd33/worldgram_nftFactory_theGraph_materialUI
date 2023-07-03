// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { setupContractsFixture } from "./utils";
// import { WorldgramBase, NFT721 } from "../typechain-types";

// describe("DelphyaBase contract nft tests", async () => {
//   let base: WorldgramBase,
//     nft: NFT721,
//     owner: SignerWithAddress,
//     account1: SignerWithAddress;

//   before("Setup", async () => {
//     ({ base, nft, owner, account1 } = await loadFixture(setupContractsFixture));
//   });

//   it("should store a new nft", async () => {
//     await expect(base.newnft("lambo", 150000, false))
//       .to.emit(base, "nftAdded")
//       .withArgs(1, "0x856e4424f806D16E8CBC702B3c0F2ede5468eae5");
//   });

//   it("should retrieve by id a newly created nft", async () => {
//     const tx = await base.newnft("lambo", 150000, false);
//     const receipt = await tx.wait();
//     const events = receipt.events && receipt.events[2].args;
//     expect(events?._nftId).to.equal(2);
//     expect(events?._nftAddress).to.equal(
//       "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
//     );
//     const nft = await base.getnft(2);
//     expect(nft.addressContract).to.equal(
//       "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
//     );
//     expect(nft.available).to.equal(true);
//   });

//   it("buynft() should become new owner", async () => {
//     const nftContract = nft.attach(
//       "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
//     );
//     let nftData = await nftContract.nftData();
//     expect(nftData.owner).to.equal(owner.address);

//     await base
//       .connect(account1)
//       .buynft("0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3", 2);

//     nftData = await nftContract.nftData();
//     expect(nftData.owner).to.equal(account1.address);
//     const nftLib = await base.getnft(2);
//     expect(nftLib.addressContract).to.equal(
//       "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"
//     );
//     expect(nftLib.available).to.equal(false);
//   });
// });
