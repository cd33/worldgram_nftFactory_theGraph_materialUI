import { ethers } from "hardhat";
import { worldgramBase } from "../utils/variables-helper";

async function main() {
  let owner, account1, account2;
  [owner, account1, account2] = await ethers.getSigners();
  // owner		a1		  c7	=8
  // acount1	a2	b5	c2	=9
  // account2	a3	b8	c4	=15
  //          =6  =13 =13

  const worldgramNFTAddress = "0xd8058efe0198ae9dd7d563e1b4938dcbc86a1f81";
  const totoNFTAddress = "0x6d544390eb535d61e196c87d6b9c80dcd8628acd";
  const fooNFTAddress = "0xb1ede3f5ac8654124cb5124adf0fd3885cbdd1f7";

  const base = await ethers.getContractAt("WorldgramBase", worldgramBase);
  const nftWorldgram = await ethers.getContractAt(
    "NFT721",
    worldgramNFTAddress
  );
  const nftToto = await ethers.getContractAt("NFT721", totoNFTAddress);
  const nftFoo = await ethers.getContractAt("NFT721", fooNFTAddress);

  // owner give his Worldgram NFT to account1
  await nftWorldgram.transferFrom(owner, account1, 1);
  // owner give his Foo NFT 6 and 7 to account1
  await nftFoo.transferFrom(owner, account1, 6);
  await nftFoo.transferFrom(owner, account1, 7);

  // account1 give his Toto NFT 1 to 5 to account2
  await nftToto.connect(account1).transferFrom(account1, account2, 1);
  await nftToto.connect(account1).transferFrom(account1, account2, 2);
  await nftToto.connect(account1).transferFrom(account1, account2, 3);
  await nftToto.connect(account1).transferFrom(account1, account2, 4);
  await nftToto.connect(account1).transferFrom(account1, account2, 5);
  // account1 give his Foo NFT 7 and 8 to account2
  await nftFoo.connect(account1).transferFrom(account1, account2, 7);
  await nftFoo.connect(account1).transferFrom(account1, account2, 8);

  // account2 give his Foo NFT 7 to owner
  await nftFoo.connect(account2).transferFrom(account2, owner, 7);

  await base.pause(worldgramNFTAddress);
  await base.pause(totoNFTAddress);
  await base.pause(fooNFTAddress);

  // await base.unpause(worldgramNFTAddress)
  // await base.unpause(totoNFTAddress)
  // await base.unpause(fooNFTAddress)

  //  owner				      c6	=6
  // acount1		a3		  c2	=5
  // account2	  a3	b13	c5	=21
  // 		        =6	=13	=13
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
