// import { expect } from "chai";
// import { ethers } from "hardhat";
// import {
//   DistributionPool,
//   Kong,
//   Node,
//   ICamelotRouter,
//   IWETH9,
// } from "../typechain-types";
// import { moveBlocksByDays } from "../utils/moveBlocksByDays";
// import { BigNumber } from "ethers";
// import {
//   merkleRoot,
//   proofAddress4,
//   proofAddress5,
//   futurAddress,
//   marketingAddress,
//   balances,
//   fees,
//   swapAmount,
//   camelotRouter,
//   nodesPrice,
//   rewardPerDayPerType,
//   maxRewards,
//   boostAPR,
//   malusPeriodStaking,
//   feesChancesMeeting,
//   feesAmountMeeting,
//   feesAmountKong,
//   presalePrice,
//   presalePriceWhitelist,
//   maxNodePresale,
//   maxNodePresaleWhitelist,
//   url,
//   blockNumber,
// } from "../utils/variables-helper";
// import { reset, time } from "@nomicfoundation/hardhat-network-helpers";

// function chainlinkPrice(price: number, priceETH: number) {
//   const amount: number = (price * 10 ** 8) / priceETH;
//   const calcul: number = amount + amount / 10 ** 13;
//   return ethers.utils.parseUnits(calcul.toFixed(18).toString());
// }

// describe("KONG", function () {
//   let distributionPool: DistributionPool;
//   let kong: Kong;
//   let node: Node;
//   let camelotPair: string;
//   let camelotRouterContract: ICamelotRouter;
//   let weth: string;
//   let wethContract: IWETH9;
//   let priceETH: number;

//   beforeEach(async function () {
//     [
//       this.owner,
//       this.futureUsePool,
//       this.marketing,
//       this.user1, // not whitelisted
//       this.user2,
//       this.user3,
//       this.user4,
//     ] = await ethers.getSigners();
//     await reset(url, blockNumber); // Reset the mainnet fork

//     const DistributionPool = await ethers.getContractFactory(
//       "DistributionPool"
//     );
//     distributionPool = await DistributionPool.deploy();
//     await distributionPool.deployed();

//     const Kong = await ethers.getContractFactory("Kong");
//     kong = await Kong.deploy(
//       merkleRoot,
//       swapAmount,
//       camelotRouter,
//       [
//         distributionPool.address,
//         futurAddress,
//         marketingAddress,
//         this.owner.address,
//       ],
//       balances,
//       fees
//     );
//     await kong.deployed();

//     priceETH = parseInt((await kong.getLatestPrice()).toString());

//     const Node = await ethers.getContractFactory("Node");
//     node = await Node.deploy(
//       kong.address,
//       malusPeriodStaking,
//       rewardPerDayPerType,
//       feesChancesMeeting,
//       feesAmountMeeting,
//       feesAmountKong,
//       boostAPR,
//       maxRewards
//     );
//     await node.deployed();

//     await kong.setNodeManagement(node.address);

//     // On simule les gains des nodes PRESALES
//     await this.owner.sendTransaction({
//       to: kong.address,
//       value: ethers.utils.parseEther("75"),
//     });

//     let balanceKongContractKong = await ethers.provider.getBalance(
//       kong.address
//     );
//     await kong.boostReward(balanceKongContractKong);

//     // Création de la pool
//     await kong.setRouterAddress(camelotRouter);

//     camelotRouterContract = await ethers.getContractAt(
//       "ICamelotRouter",
//       camelotRouter
//     );
//     const factoryAddress = await camelotRouterContract.factory();
//     const camelotFactoryContract = await ethers.getContractAt(
//       "ICamelotFactory",
//       factoryAddress
//     );
//     weth = await camelotRouterContract.WETH();
//     wethContract = await ethers.getContractAt("IWETH9", weth);
//     camelotPair = await camelotFactoryContract.getPair(kong.address, weth);

//     await kong.setFeeExempts(camelotPair, true);

//     // Owner ajoute de la liquidité à la pool de liquidité Camelot BNA/WETH.
//     const ethAmount = ethers.utils.parseEther("75");
//     const tokenAmount = ethers.utils.parseEther((150_000).toString());
//     await kong.approve(camelotRouter, tokenAmount);

//     const { timestamp } = await ethers.provider.getBlock("latest");
//     await camelotRouterContract.addLiquidityETH(
//       kong.address,
//       tokenAmount,
//       0, // slippage is unavoidable
//       0, // slippage is unavoidable
//       this.owner.address,
//       timestamp + 1,
//       { value: ethAmount }
//     );

//     await kong.setSwapLiquify(true);
//     await kong.setStep(3);

//     // Owner récupère des WETH
//     await wethContract.deposit({ value: ethers.utils.parseEther("100") });

//     // transfer de owner vers user1 et user2 de WETH
//     const wethAmount = ethers.utils.parseEther("10");
//     await wethContract.transfer(this.user1.address, wethAmount);
//     await wethContract.transfer(this.user2.address, wethAmount);

//     // user 1 achète des BNA sur la pool, swap WETH to BNA
//     const path = [weth, kong.address];
//     await wethContract.connect(this.user1).approve(camelotRouter, wethAmount);
//     await wethContract.connect(this.user2).approve(camelotRouter, wethAmount);
//     const timestamp2 = await time.latest();
//     await camelotRouterContract
//       .connect(this.user1)
//       .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//         wethAmount,
//         wethAmount,
//         path,
//         this.user1.address,
//         "0x0000000000000000000000000000000000000000",
//         timestamp2 + 1
//       );
//     await camelotRouterContract
//       .connect(this.user2)
//       .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//         wethAmount,
//         wethAmount,
//         path,
//         this.user2.address,
//         "0x0000000000000000000000000000000000000000",
//         timestamp2 + 2
//       );
//   });

//   describe("Reverts", function () {
//     it("REVERT upgradeNode & stake, WrongType", async function () {
//       await expect(
//         kong.connect(this.user1).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "WrongType");
//       await expect(
//         kong.connect(this.user1).upgradeNode(1)
//       ).to.be.revertedWithCustomError(kong, "WrongType");

//       await expect(
//         kong.connect(this.user1).stake(0, 20)
//       ).to.be.revertedWithCustomError(kong, "WrongType");
//       await expect(
//         kong.connect(this.user1).stake(0, 50)
//       ).to.be.revertedWithCustomError(kong, "WrongType");
//     });

//     it("REVERT buyNodes, AmountNull", async function () {
//       await expect(
//         kong.connect(this.user1).buyNodes(0)
//       ).to.be.revertedWithCustomError(kong, "AmountNull");
//     });

//     it("REVERT upgradeNode, NodeStaked", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 15);

//       await expect(
//         kong.connect(this.user1).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "NodeStaked");
//     });

//     it("REVERT buyNodes & upgradeNode, NotEnoughKong", async function () {
//       await kong.connect(this.user1).buyNodes(1);

//       const balanceUser1 = await kong.balanceOf(this.user1.address);
//       await kong.connect(this.user1).transfer(this.user2.address, balanceUser1);

//       await expect(
//         kong.connect(this.user1).buyNodes(1)
//       ).to.be.revertedWithCustomError(kong, "NotEnoughKong");

//       await expect(
//         kong.connect(this.user1).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "NotEnoughKong");
//     });

//     it("REVERT OnlyOwner", async function () {
//       await expect(
//         kong.connect(this.user1).setNodeManagement(this.user1.address)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//       await expect(
//         kong.connect(this.user1).setNodesPrice([0, 2, 5])
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//       await expect(
//         node.connect(this.user1).setToken(this.user1.address)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//       await expect(
//         node.connect(this.user1).setMaxRewards(1)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//       await expect(
//         node.connect(this.user1).setStakingPeriod(1)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("REVERT OnlyKing WrongWay", async function () {
//       await expect(
//         node.connect(this.user1).buyNode(this.user1.address, true)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//       await expect(node.buyNode(this.owner.address, true)).to.be.not.reverted;
//       await expect(
//         node.connect(this.user1).upgradeNode(this.user1.address, 0)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//       await expect(
//         node.connect(this.user1).stake(0, this.user1.address, 0)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//       await expect(
//         node.connect(this.user1).unstake(0, this.user1.address)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//       await expect(
//         node.connect(this.user1).claimRewards(this.user1.address, 1)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//       await expect(
//         node.connect(this.user1).claimAllRewards(this.user1.address)
//       ).to.be.revertedWithCustomError(node, "WrongWay");
//     });

//     it("REVERT NotStaked", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await expect(
//         kong.connect(this.user1).unstake(0)
//       ).to.be.revertedWithCustomError(node, "NotStaked");
//       await expect(
//         kong.connect(this.user1).claimRewards(0)
//       ).to.be.revertedWithCustomError(node, "NotStaked");
//       await expect(
//         node.connect(this.user1).getRewardsWithoutRandomFees(0)
//       ).to.be.revertedWithCustomError(node, "NotStaked");
//     });

//     it("REVERT AlreadyStaked", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 0);
//       await expect(
//         kong.connect(this.user1).stake(0, 0)
//       ).to.be.revertedWithCustomError(node, "AlreadyStaked");
//     });

//     it("REVERT RewardZero", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 0);
//       await expect(
//         kong.connect(this.user1).claimAllRewards()
//       ).to.be.revertedWithCustomError(node, "RewardZero");
//     });

//     it("REVERT NotOwnerNode", async function () {
//       await expect(
//         node.claimRewards(this.user1.address, 3)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");
//       await expect(
//         kong.connect(this.user1).claimRewards(3)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");

//       await kong.connect(this.user2).buyNodes(1);
//       await kong.connect(this.user2).stake(0, 0);

//       await expect(
//         kong.connect(this.user1).stake(0, 0)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");
//       await expect(
//         kong.connect(this.user1).unstake(0)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");

//       await expect(
//         kong.connect(this.user1).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "NotOwnerNode");

//       const zeroSigner = await ethers.getImpersonatedSigner(
//         "0x0000000000000000000000000000000000000000"
//       );
//       await this.user1.sendTransaction({
//         to: zeroSigner.address,
//         value: ethers.utils.parseEther("10"),
//       });
//       await expect(
//         kong.connect(zeroSigner).claimRewards(5)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");

//       await expect(
//         kong.connect(zeroSigner).claimAllRewards()
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");

//       await expect(
//         kong.connect(zeroSigner).stake(0, 0)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");
//       await expect(
//         kong.connect(zeroSigner).unstake(0)
//       ).to.be.revertedWithCustomError(node, "NotOwnerNode");
//       await expect(
//         kong.connect(zeroSigner).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "NotOwnerNode");
//     });

//     it("REVERT NotEnoughTime", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 15);
//       await expect(
//         node.getRewardsWithoutRandomFees(0)
//       ).to.be.revertedWithCustomError(node, "NotEnoughTime");
//     });

//     it("REVERT NodeDoesnotExist", async function () {
//       await expect(
//         node.getRewardsWithoutRandomFees(0)
//       ).to.be.revertedWithCustomError(node, "NodeDoesnotExist");
//     });

//     it("REVERT NotAllowedStakingPeriod", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 15);
//       await expect(
//         kong.connect(this.user1).claimRewards(0)
//       ).to.be.revertedWithCustomError(node, "NotAllowedStakingPeriod");
//     });

//     it("REVERT NotEnoughETH", async function () {
//       await kong.setStep(1);
//       await expect(
//         kong.connect(this.user3).buyNodesWhitelist(proofAddress5, 1)
//       ).to.be.revertedWithCustomError(kong, "NotEnoughETH");

//       await kong.setStep(2);
//       await expect(
//         kong.connect(this.user4).buyNodes(1)
//       ).to.be.revertedWithCustomError(kong, "NotEnoughETH");
//     });

//     it("REVERT NotWhitelisted", async function () {
//       await kong.setStep(1);
//       await expect(
//         kong.connect(this.user1).buyNodesWhitelist(proofAddress4, 1)
//       ).to.be.revertedWithCustomError(kong, "NotWhitelisted");
//     });

//     it("REVERT LengthMismatch", async function () {
//       await expect(
//         kong.setPeriodsStaking([0, 1, 2])
//       ).to.be.revertedWithCustomError(kong, "LengthMismatch");

//       await expect(
//         node.setRewardPerDayPerType([0, 1, 2, 3])
//       ).to.be.revertedWithCustomError(node, "LengthMismatch");

//       await expect(
//         node.setFeesChancesMeeting([0, 1, 2, 3])
//       ).to.be.revertedWithCustomError(node, "LengthMismatch");

//       await expect(
//         node.setFeesAmountMeeting([0, 1, 2, 3])
//       ).to.be.revertedWithCustomError(node, "LengthMismatch");

//       await expect(
//         node.setFeesAmountKong([0, 1])
//       ).to.be.revertedWithCustomError(node, "LengthMismatch");

//       await expect(
//         node.setBoostAPR([0, 1, 2, 3])
//       ).to.be.revertedWithCustomError(node, "LengthMismatch");
//     });

//     it("REVERT MaxNodePresaleReached", async function () {
//       await kong.setStep(1);
//       await expect(
//         kong
//           .connect(this.user2)
//           .buyNodesWhitelist(proofAddress4, maxNodePresaleWhitelist + 1)
//       ).to.be.revertedWithCustomError(kong, "MaxNodePresaleReached");
//     });

//     it("REVERT WrongStep en fonction de toutes les steps", async function () {
//       await kong.setStep(0); // Pause
//       await expect(
//         kong.connect(this.user2).buyNodes(10)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).buyNodesWhitelist(proofAddress4, 10)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).stake(0, 15)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).unstake(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimRewards(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimAllRewards()
//       ).to.be.revertedWithCustomError(kong, "WrongStep");

//       await kong.setStep(1); // PresaleWhitelist
//       await expect(
//         kong.connect(this.user2).buyNodes(10)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).buyNodesWhitelist(proofAddress4, 10, {
//           value: chainlinkPrice(10 * presalePrice, priceETH),
//         })
//       ).to.be.not.reverted;
//       await expect(
//         kong.connect(this.user2).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).stake(0, 15)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).unstake(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimRewards(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimAllRewards()
//       ).to.be.revertedWithCustomError(kong, "WrongStep");

//       await kong.setStep(2); // Presale
//       await expect(
//         kong
//           .connect(this.user2)
//           .buyNodes(10, { value: chainlinkPrice(10 * presalePrice, priceETH) })
//       ).to.be.not.reverted;
//       await expect(
//         kong.connect(this.user2).buyNodesWhitelist(proofAddress4, 10)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).upgradeNode(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).stake(0, 15)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).unstake(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimRewards(0)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(
//         kong.connect(this.user2).claimAllRewards()
//       ).to.be.revertedWithCustomError(kong, "WrongStep");

//       await kong.setStep(3); // PublicSale
//       await expect(kong.connect(this.user2).buyNodes(10)).to.be.not.reverted;
//       await expect(
//         kong.connect(this.user2).buyNodesWhitelist(proofAddress4, 10)
//       ).to.be.revertedWithCustomError(kong, "WrongStep");
//       await expect(kong.connect(this.user2).upgradeNode(29)).to.be.not.reverted;
//       await expect(kong.connect(this.user2).stake(29, 0)).to.be.not.reverted;
//       await moveBlocksByDays(1);
//       await expect(kong.connect(this.user2).claimRewards(29)).to.be.not
//         .reverted;
//       await moveBlocksByDays(1);
//       await expect(kong.connect(this.user2).claimAllRewards()).to.emit(
//         kong,
//         "AllRewardsClaimed"
//       ).to.be.not.reverted;
//       await moveBlocksByDays(1);
//       await expect(kong.connect(this.user2).unstake(29)).to.be.not.reverted;
//     });
//   });

//   describe("Setters", function () {
//     it("setStep et sellingStep", async function () {
//       let step = await kong.sellingStep();
//       expect(step).to.equal(3);
//       await kong.setStep(1);
//       step = await kong.sellingStep();
//       expect(step).to.equal(1);
//       await kong.setStep(2);
//       step = await kong.sellingStep();
//       expect(step).to.equal(2);
//       await kong.setStep(3);
//       step = await kong.sellingStep();
//       expect(step).to.equal(3);
//       await kong.setStep(0);
//       step = await kong.sellingStep();
//       expect(step).to.equal(0);

//       await expect(kong.setStep(1)).to.emit(kong, "StepChanged");
//     });

//     it("setNodeManagement et node", async function () {
//       let nodeManagement = await kong.node();
//       expect(nodeManagement).to.equal(node.address);

//       await expect(kong.setNodeManagement(kong.address)).to.emit(
//         kong,
//         "NodeManagementChanged"
//       );

//       nodeManagement = await kong.node();
//       expect(nodeManagement).to.equal(kong.address);
//     });

//     it("setDistributionPool et distributionPool", async function () {
//       let distrib = await kong.distributionPool();
//       expect(distrib).to.equal(distributionPool.address);

//       await expect(kong.setDistributionPool(this.user4.address)).to.emit(
//         kong,
//         "DistributionPoolChanged"
//       );

//       distrib = await kong.distributionPool();
//       expect(distrib).to.equal(this.user4.address);
//     });

//     it("setFutureUsePool et futureUsePool", async function () {
//       let futur = await kong.futureUsePool();
//       expect(futur).to.equal(futurAddress);

//       await expect(kong.setFutureUsePool(this.user4.address)).to.emit(
//         kong,
//         "FutureUsePoolChanged"
//       );

//       futur = await kong.futureUsePool();
//       expect(futur).to.equal(this.user4.address);
//     });

//     it("setMarketing et marketing", async function () {
//       let marketing = await kong.marketing();
//       expect(marketing).to.equal(marketingAddress);

//       await expect(kong.setMarketing(this.user4.address)).to.emit(
//         kong,
//         "MarketingChanged"
//       );

//       marketing = await kong.marketing();
//       expect(marketing).to.equal(this.user4.address);
//     });

//     it("setTeam et team", async function () {
//       let team = await kong.team();
//       expect(team).to.equal(this.owner.address);

//       await expect(kong.setTeam(this.user4.address)).to.emit(
//         kong,
//         "TeamChanged"
//       );

//       team = await kong.team();
//       expect(team).to.equal(this.user4.address);
//     });

//     it("setTeamFee et teamFee", async function () {
//       let team = await kong.teamFee();
//       expect(team).to.equal(fees[0]);

//       await kong.setTeamFee(50);

//       team = await kong.teamFee();
//       expect(team).to.equal(50);
//     });

//     it("setRewardsFee et rewardsFee", async function () {
//       let rw = await kong.rewardsFee();
//       expect(rw).to.equal(fees[1]);

//       await kong.setRewardsFee(50);

//       rw = await kong.rewardsFee();
//       expect(rw).to.equal(50);
//     });

//     it("setLiquidityPoolFee et liquidityPoolFee", async function () {
//       let liquid = await kong.liquidityPoolFee();
//       expect(liquid).to.equal(fees[2]);

//       await kong.setLiquidityPoolFee(50);

//       liquid = await kong.liquidityPoolFee();
//       expect(liquid).to.equal(50);
//     });

//     it("setRewardSwapFee et rewardSwapFee", async function () {
//       let rs = await kong.rewardSwapFee();
//       expect(rs).to.equal(fees[3]);

//       await kong.setRewardSwapFee(50);

//       rs = await kong.rewardSwapFee();
//       expect(rs).to.equal(50);
//     });

//     it("setPumpDumpTax et pumpDumpTax", async function () {
//       let pump = await kong.pumpDumpTax();
//       expect(pump).to.equal(fees[4]);

//       await kong.setPumpDumpTax(50);

//       pump = await kong.pumpDumpTax();
//       expect(pump).to.equal(50);
//     });

//     it("setSellTax et sellTax", async function () {
//       let sell = await kong.sellTax();
//       expect(sell).to.equal(fees[5]);

//       await kong.setSellTax(50);

//       sell = await kong.sellTax();
//       expect(sell).to.equal(50);
//     });

//     it("setTransferTax et transferTax", async function () {
//       let trans = await kong.transferTax();
//       expect(trans).to.equal(fees[6]);

//       await kong.setTransferTax(50);

//       trans = await kong.transferTax();
//       expect(trans).to.equal(50);
//     });

//     it("setSwapLiquify et swapLiquify", async function () {
//       let sl = await kong.swapLiquify();
//       expect(sl).to.equal(true);

//       await kong.setSwapLiquify(false);

//       sl = await kong.swapLiquify();
//       expect(sl).to.equal(false);
//     });

//     it("setSwapTokensAmount et swapTokensAmount", async function () {
//       let sa = await kong.swapTokensAmount();
//       expect(sa).to.equal(ethers.utils.parseEther(swapAmount.toString()));

//       await kong.setSwapTokensAmount(10);

//       sa = await kong.swapTokensAmount();
//       expect(sa).to.equal(ethers.utils.parseEther("10"));
//     });

//     it("setFeeExempts et feeExempts", async function () {
//       let fe = await kong.feeExempts(this.user1.address);
//       expect(fe).to.equal(false);

//       await kong.setFeeExempts(this.user1.address, true);

//       fe = await kong.feeExempts(this.user1.address);
//       expect(fe).to.equal(true);
//     });

//     it("setPresalePriceWhitelist et presalePriceWhitelist", async function () {
//       let price = await kong.presalePriceWhitelist();
//       expect(price).to.equal(presalePriceWhitelist);

//       await expect(kong.setPresalePriceWhitelist(10)).to.emit(
//         kong,
//         "PresalePriceWhitelistChanged"
//       );

//       price = await kong.presalePriceWhitelist();
//       expect(price).to.equal(10);
//     });

//     it("setPresalePrice et presalePrice", async function () {
//       let price = await kong.presalePrice();
//       expect(price).to.equal(presalePrice);

//       await expect(kong.setPresalePrice(10)).to.emit(
//         kong,
//         "PresalePriceChanged"
//       );

//       price = await kong.presalePrice();
//       expect(price).to.equal(10);
//     });

//     it("setMaxNodePresaleWhitelist et maxNodePresaleWhitelist", async function () {
//       let price = await kong.maxNodePresaleWhitelist();
//       expect(price).to.equal(maxNodePresaleWhitelist);

//       await expect(kong.setMaxNodePresaleWhitelist(5)).to.emit(
//         kong,
//         "MaxNodePresaleWhitelistChanged"
//       );

//       price = await kong.maxNodePresaleWhitelist();
//       expect(price).to.equal(5);
//     });

//     it("setMaxNodePresale et maxNodePresale", async function () {
//       let price = await kong.maxNodePresale();
//       expect(price).to.equal(maxNodePresale);

//       await expect(kong.setMaxNodePresale(5)).to.emit(
//         kong,
//         "MaxNodePresaleChanged"
//       );

//       price = await kong.maxNodePresale();
//       expect(price).to.equal(5);
//     });

//     it("setNodesPrice et nodePrice", async function () {
//       let nodePrice = await kong.nodesPrice();
//       expect(nodePrice).to.equal(nodesPrice);

//       await expect(kong.setNodesPrice(1)).to.emit(kong, "NodesPriceChanged");

//       nodePrice = await kong.nodesPrice();
//       expect(nodePrice).to.equal(1);
//     });

//     it("setPeriodsStaking et periodsStaking", async function () {
//       await expect(kong.setPeriodsStaking([10, 20, 30, 40])).to.emit(
//         kong,
//         "PeriodsStakingChanged"
//       );
//     });

//     it("setToken et token", async function () {
//       let token = await node.kong();
//       expect(token).to.equal(kong.address);

//       await node.setToken(node.address);

//       token = await node.kong();
//       expect(token).to.equal(node.address);
//     });

//     it("setMalusPeriodStaking et malusPeriodStaking", async function () {
//       let malus = await node.malusPeriodStaking();
//       expect(malus).to.equal(malusPeriodStaking);

//       await expect(node.setMalusPeriodStaking(5)).to.emit(
//         node,
//         "MalusPeriodStakingChanged"
//       );

//       malus = await node.malusPeriodStaking();
//       expect(malus).to.equal(5);
//     });

//     it("setMaxRewards et maxRewards", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 0);

//       await moveBlocksByDays(150);
//       let reward = await node.getRewardsWithoutRandomFees(0);
//       expect(reward[0]).to.equal(BigNumber.from(maxRewards));

//       await expect(node.setMaxRewards(100)).to.emit(node, "MaxRewardsChanged");

//       reward = await node.getRewardsWithoutRandomFees(0);
//       expect(reward[0]).to.equal(BigNumber.from(100));
//     });

//     it("setRewardPerDayPerType et rewardPerDayPerType", async function () {
//       let rpdpt = await node.getRewardPerDayPerType();
//       expect(rpdpt[0]).to.equal(rewardPerDayPerType[0]);
//       expect(rpdpt[1]).to.equal(rewardPerDayPerType[1]);
//       expect(rpdpt[2]).to.equal(rewardPerDayPerType[2]);

//       await expect(node.setRewardPerDayPerType([5, 10, 20])).to.emit(
//         node,
//         "RewardPerDayPerTypeChanged"
//       );

//       rpdpt = await node.getRewardPerDayPerType();
//       expect(rpdpt[0]).to.equal(5);
//       expect(rpdpt[1]).to.equal(10);
//       expect(rpdpt[2]).to.equal(20);
//     });

//     it("setFeesChancesMeeting", async function () {
//       await expect(node.setFeesChancesMeeting([5, 10, 20])).to.emit(
//         node,
//         "FeesChancesMeetingChanged"
//       );
//     });

//     it("setFeesAmountMeeting", async function () {
//       await expect(node.setFeesAmountMeeting([5, 10, 20])).to.emit(
//         node,
//         "FeesAmountMeetingChanged"
//       );
//     });

//     it("setFeesAmountKong", async function () {
//       await expect(node.setFeesAmountKong([5, 10, 20, 40])).to.emit(
//         node,
//         "FeesAmountKongChanged"
//       );
//     });

//     it("setBoostAPR", async function () {
//       await expect(node.setBoostAPR([5, 10, 20])).to.emit(
//         node,
//         "BoostAPRChanged"
//       );
//     });

//     it("setStakingPeriod et stakingPeriod", async function () {
//       await kong.connect(this.user1).buyNodes(1);
//       await kong.connect(this.user1).stake(0, 0);
//       await moveBlocksByDays(200);
//       let reward = await node.getRewardsWithoutRandomFees(0);

//       expect(reward[0]).to.equal(BigNumber.from(maxRewards));

//       const month = 60 * 60 * 24 * 30;
//       await expect(node.setStakingPeriod(month)).to.emit(
//         node,
//         "StakingPeriodChanged"
//       );

//       reward = await node.getRewardsWithoutRandomFees(0);
//       expect(reward[0]).to.equal(BigNumber.from(6 * rewardPerDayPerType[0]));
//     });
//   });

//   describe("boostReward, retrait ETH Kong", function () {
//     it("Should get rich", async function () {
//       await this.user1.sendTransaction({
//         to: kong.address,
//         value: ethers.utils.parseEther("100"),
//       });

//       const balanceOwner1 = await ethers.provider.getBalance(
//         this.owner.address
//       );
//       let balanceKong = await ethers.provider.getBalance(kong.address);
//       expect(balanceKong).to.equal(ethers.utils.parseEther("100"));

//       await kong.boostReward(ethers.utils.parseEther("20"));

//       const balanceOwner2 = await ethers.provider.getBalance(
//         this.owner.address
//       );
//       balanceKong = await ethers.provider.getBalance(kong.address);
//       expect(balanceKong).to.equal(ethers.utils.parseEther("80"));
//       expect(balanceOwner1).to.be.lt(balanceOwner2);

//       await kong.boostReward(ethers.utils.parseEther("10000"));

//       const balanceOwner3 = await ethers.provider.getBalance(
//         this.owner.address
//       );
//       balanceKong = await ethers.provider.getBalance(kong.address);
//       expect(balanceKong).to.equal(0);
//       expect(balanceOwner2).to.be.lt(balanceOwner3);
//     });
//   });

//   // // *******************************************************************************************************************
//   // // *******************************************************************************************************************
//   // // *******************************************************************************************************************
//   // // claimRewards: avoir le require Max supply exceeded et voir si lastClaimTime reste modifié
//   // let nodeData = await node.nodesById(0)
//   // expect(nodeData.lastClaimTime).to.equal(0);
//   // await expect().to.be.revertedWith("Max supply exceeded")
//   // await expect(kong.connect(this.user3).claimRewards(0)).to.be.revertedWithCustomError(kong, "MaxSupplyExceeded")
//   // nodeData = await node.nodesById(0)
//   // expect(nodeData.lastClaimTime).to.equal(0);

//   // // buyNode: Wrong type voir si le user est débité
//   // let balanceUser3Kong = await ethers.provider.getBalance(this.user3.address);
//   // console.log("balanceUser3Kong :>> ", balanceUser3Kong);
//   // await expect(kong.connect(this.user3).buyNode(5)).to.be.revertedWith("Wrong type");
//   // balanceUser3Kong = await ethers.provider.getBalance(this.user3.address);
//   // console.log("balanceUser3Kong :>> ", balanceUser3Kong);

//   // // Revert confirmé: buyNodeBatch avec values negatives (ex: _amounts=[5,-2])
// });
