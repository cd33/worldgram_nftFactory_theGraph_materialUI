// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { Wallet } from "ethers";
// import { MerkleTree } from "merkletreejs";
// import {
//   reset,
//   time,
//   setBalance,
// } from "@nomicfoundation/hardhat-network-helpers";
// import { moveBlocksByDays } from "../utils/moveBlocksByDays";
// import {
//   DistributionPool,
//   Kong,
//   Node,
//   ICamelotRouter,
//   IWETH9,
// } from "../typechain-types";
// import {
//   merkleRoot,
//   futurAddress,
//   marketingAddress,
//   balances,
//   fees,
//   swapAmount,
//   camelotRouter,
//   rewardPerDayPerType,
//   maxRewards,
//   boostAPR,
//   malusPeriodStaking,
//   feesChancesMeeting,
//   feesAmountMeeting,
//   feesAmountKong,
//   presalePrice,
//   presalePriceWhitelist,
//   url,
//   blockNumber,
// } from "../utils/variables-helper";

// function chainlinkPrice(price: number, priceETH: number) {
//   const amount: number = (price * 10 ** 8) / priceETH;
//   const calcul: number = amount + amount / 10 ** 13;
//   return ethers.utils.parseUnits(calcul.toFixed(18).toString());
// }

// describe("KONG SIMULATION", function () {
//   let distributionPool: DistributionPool;
//   let kong: Kong;
//   let node: Node;
//   let camelotPair: string;
//   let camelotRouterContract: ICamelotRouter;
//   let weth: string;
//   let wethContract: IWETH9;
//   let priceETH: number;
//   let signersPresaleWhitelist: Wallet[] = [];
//   let signersPresale: Wallet[] = [];
//   let signers: Wallet[] = [];

//   before(async function () {
//     [
//       this.owner,
//       this.futureUsePool,
//       this.marketing,
//       this.user1,
//       this.user2,
//       this.user3,
//       this.user4,
//     ] = await ethers.getSigners();
//     await reset(url, blockNumber); // Reset the mainnet fork

//     // Déploiement:
//     // * On mint toute la supply de 20 millions de BNA
//     // * J'en distribue une partie au futurePool, à distributionPool (pour les rewards), marketing et à l'owner
//     // cette argent servira pour alimenter la pool de liquidité Camelot BNA/WETH
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
//     // Une journée s'écoule
//     moveBlocksByDays(1);
//   });

//   // tests avec 1k users, achat chacuns nodes, attendre, checker rewards,
//   // retraits, tests argents, BREF DEROULEMENT COMPLET
//   describe("Simulation déroulement global", function () {
//     // L'étape suivante c'est lancer la présale Whitelist, on vend des nodes et on récolte des ETH.
//     // presale whitelist price : 2250$ en $ETH -> 35$ node à l'unité, soit 64 Nodes
//     it("Présale Whitelist", async function () {
//       await kong.setStep(1);

//       let addressArray: string[] = [];
//       let proofsArray: string[][] = [];
//       const startingBalance = ethers.utils.parseEther("10");

//       // Creation des 80 wallets
//       for (let i = 0; i < 80; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signersPresaleWhitelist.push(wallet);
//         addressArray.push(wallet.address.toString());
//       }

//       // On leur donne 10 ETH
//       const fundThem = async () => {
//         return Promise.all(
//           addressArray.map(async (wallet) => {
//             expect(
//               await setBalance(wallet, startingBalance)
//             ).to.changeEtherBalance(wallet, startingBalance);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       // On créer la merkle root et on les inscrit à la whitelist
//       const merkle = (tab: string[]) => {
//         const leaves = tab.map((address: string) =>
//           ethers.utils.keccak256(address)
//         );
//         const tree = new MerkleTree(leaves, ethers.utils.keccak256, {
//           sortPairs: true,
//         }); // Attention sortPairs et non sort (crossmint)
//         const root = tree.getHexRoot();

//         addressArray.map((wallet) => {
//           const leaf = ethers.utils.keccak256(wallet);
//           const proof = tree.getHexProof(leaf);
//           proofsArray.push(proof);
//         });

//         expect(proofsArray.length).to.be.equal(80);
//         return root;
//       };
//       const root = merkle(addressArray);

//       await kong.setMerkleRoot(root);

//       // 30 users whitelistés achetent 64 nodes
//       const firstPartSigners = signersPresaleWhitelist.slice(0, 30);
//       const firstPartSignersBuyNodes = async () => {
//         return Promise.all(
//           firstPartSigners.map(async (wallet, i) => {
//             await kong.connect(wallet).buyNodesWhitelist(proofsArray[i], 64, {
//               value: chainlinkPrice(presalePriceWhitelist * 64, priceETH),
//             });
//           })
//         ).then(() => {
//           console.log("firstPartSignersBuyNodes done");
//         });
//       };
//       await firstPartSignersBuyNodes();

//       const balanceKongNodesFirstPartSigners =
//         await node.getTotalNodesPerType();
//       expect(balanceKongNodesFirstPartSigners[0]).to.be.equal(1920);

//       // 2 journées s'écoulent
//       moveBlocksByDays(2);

//       // 50 autres achètent un nombre aléatoire entre 1 et 64
//       let countRandoms: number = 0;
//       const secondPartSigners = signersPresaleWhitelist.slice(30);
//       const secondPartSignersBuyNodes = async () => {
//         return Promise.all(
//           secondPartSigners.map(async (wallet, i) => {
//             const randomValue = Math.floor(Math.random() * 64) + 1;
//             countRandoms += randomValue;
//             await kong
//               .connect(wallet)
//               .buyNodesWhitelist(proofsArray[i + 30], randomValue, {
//                 value: chainlinkPrice(
//                   presalePriceWhitelist * randomValue,
//                   priceETH
//                 ),
//               });
//           })
//         ).then(() => {
//           console.log("secondPartSignersBuyNodes done");
//         });
//       };
//       await secondPartSignersBuyNodes();

//       const balanceKongNodesSecondPartSigners =
//         await node.getTotalNodesPerType();
//       expect(balanceKongNodesSecondPartSigners[0]).to.be.equal(
//         balanceKongNodesFirstPartSigners[0].add(countRandoms)
//       );

//       // 3 journées s'écoulent
//       moveBlocksByDays(3);

//       const balanceETHContractKong = await ethers.provider.getBalance(
//         kong.address
//       );
//       expect(balanceETHContractKong.div(1e6)).to.be.greaterThanOrEqual(
//         chainlinkPrice(
//           presalePriceWhitelist *
//             balanceKongNodesSecondPartSigners[0].toNumber(),
//           priceETH
//         ).div(1e6)
//       );
//     });

//     // Puis, on fait une deuxième présale sans Whitelist, de nouveau on vend des nodes et on récolte des ETH.
//     // presale price : 1750$ en $ETH -> 40$ node à l'unite, soit 44 Nodes
//     it("Présale", async function () {
//       await kong.setStep(2);

//       const startingBalance = ethers.utils.parseEther("10");

//       // Creation des 100 wallets
//       for (let i = 0; i < 100; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signersPresale.push(wallet);
//       }

//       // On leur donne 10 ETH
//       const fundThem = async () => {
//         return Promise.all(
//           signersPresale.map(async (wallet) => {
//             expect(
//               await setBalance(wallet.address, startingBalance)
//             ).to.changeEtherBalance(wallet.address, startingBalance);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       // 20 users achetent 44 nodes
//       const firstPartSigners = signersPresale.slice(0, 20);
//       const firstPartSignersBuyNodes = async () => {
//         return Promise.all(
//           firstPartSigners.map(async (wallet) => {
//             await kong.connect(wallet).buyNodes(44, {
//               value: chainlinkPrice(presalePrice * 44, priceETH),
//             });
//           })
//         ).then(() => {
//           console.log("firstPartSignersBuyNodes done");
//         });
//       };
//       await firstPartSignersBuyNodes();

//       // 15 journées s'écoulent
//       moveBlocksByDays(15);

//       // 80 restants achètent un nombre aléatoire entre 1 et 44
//       const secondPartSigners = signersPresale.slice(20);
//       const secondPartSignersBuyNodes = async () => {
//         return Promise.all(
//           secondPartSigners.map(async (wallet) => {
//             const randomValue = Math.floor(Math.random() * 44) + 1;
//             await kong.connect(wallet).buyNodes(randomValue, {
//               value: chainlinkPrice(presalePrice * randomValue, priceETH),
//             });
//           })
//         ).then(() => {
//           console.log("secondPartSignersBuyNodes done");
//         });
//       };
//       await secondPartSignersBuyNodes();

//       const balanceKongNodesSecondPartSigners =
//         await node.getTotalNodesPerType();
//       const balanceETHContractKong = await ethers.provider.getBalance(
//         kong.address
//       );
//       console.log(
//         "Nombre de node vendu après les deux présales :>> ",
//         balanceKongNodesSecondPartSigners
//       );
//       console.log(
//         "balanceETHContractKong :>> ",
//         ethers.utils.formatEther(balanceETHContractKong)
//       );

//       // 5 journées s'écoulent
//       moveBlocksByDays(5);
//     });

//     // On ferme les présales, owner récupère l'argent généré et ajoute la liquidité à la pool de liquidité Camelot BNA/WETH.
//     it("Création pool de liquidité Camelot BNA/WETH", async function () {
//       let balanceETHContractKong = await ethers.provider.getBalance(
//         kong.address
//       );
//       await kong.boostReward(balanceETHContractKong);

//       // Création de la pool
//       await kong.setRouterAddress(camelotRouter);

//       camelotRouterContract = await ethers.getContractAt(
//         "ICamelotRouter",
//         camelotRouter
//       );
//       const factoryAddress = await camelotRouterContract.factory();
//       const camelotFactoryContract = await ethers.getContractAt(
//         "ICamelotFactory",
//         factoryAddress
//       );
//       weth = await camelotRouterContract.WETH();
//       wethContract = await ethers.getContractAt("IWETH9", weth);
//       camelotPair = await camelotFactoryContract.getPair(kong.address, weth);

//       await kong.setFeeExempts(camelotPair, true);

//       // Owner ajoute de la liquidité à la pool de liquidité Camelot BNA/WETH.
//       const ethAmount = ethers.utils.parseEther("75");
//       const tokenAmount = ethers.utils.parseEther((150_000).toString());
//       await kong.approve(camelotRouter, tokenAmount);

//       const { timestamp } = await ethers.provider.getBlock("latest");
//       await camelotRouterContract.addLiquidityETH(
//         kong.address,
//         tokenAmount,
//         0, // slippage is unavoidable
//         0, // slippage is unavoidable
//         this.owner.address,
//         timestamp + 1,
//         { value: ethAmount }
//       );

//       // Je change team (précedemment owner) si besoin, dépend du deploiement
//       await kong.setTeam(this.user4.address);

//       // Met en route tous le système de swaps, fees and taxes
//       await kong.setSwapLiquify(true);
//     });

//     it("Users of Presale Whitelist unstake to get rewards", async function () {
//       await kong.setStep(3);
//       // J'abandonne mon droit d'owner
//       await kong.transferOwnership(this.user4.address);
//       await distributionPool.transferOwnership(this.user4.address);

//       // les users de la présale whitelist retirent leurs gains en UNSTAKE et les transforment en WETH
//       // const baseNonce = await ethers.provider.getTransactionCount(wallet.address)
//       const unstakePresaleWhitelist = async () => {
//         return Promise.all(
//           signersPresaleWhitelist.map(async (wallet) => {
//             const nodesBalance = (
//               await node.connect(wallet).getNodesDataOf(wallet.address)
//             )[0];

//             return Promise.all(
//               nodesBalance.map(async (nodeId, j) => {
//                 await kong.connect(wallet).unstake(nodeId, { nonce: 1 + j });
//               })
//             );
//           })
//         ).then(() => {
//           console.log("unstakePresaleWhitelist done");
//         });
//       };
//       await unstakePresaleWhitelist();

//       const path2 = [kong.address, weth];
//       const getWETHPresaleWhitelist = async () => {
//         return Promise.all(
//           signersPresaleWhitelist.map(async (wallet, i) => {
//             const balanceBNA = await kong.balanceOf(wallet.address);
//             await kong.connect(wallet).approve(camelotRouter, balanceBNA);
//             const timestamp = await time.latest();
//             await camelotRouterContract
//               .connect(wallet)
//               .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//                 balanceBNA,
//                 0,
//                 path2,
//                 wallet.address,
//                 "0x0000000000000000000000000000000000000000",
//                 timestamp + i + 60
//               );
//           })
//         ).then(() => {
//           console.log("getWETHPresaleWhitelist done");
//         });
//       };
//       await getWETHPresaleWhitelist();

//       // 2 journées s'écoulent
//       moveBlocksByDays(2);
//     });

//     // On lance la publicSale (vente normal), les users peuvent acheter des nodes, les staker, unstaker et claim leurs rewards.
//     it("Public Sale part 1", async function () {
//       // // TESTS A SUPPRIMER
//       // // Pour ce passer de l'étape précedente
//       // await kong.setStep(3);
//       // const path2 = [kong.address, weth];
//       // const kongAmount = ethers.utils.parseEther("105000");
//       // await kong.connect(this.futureUsePool).approve(camelotRouter, kongAmount);
//       // const { timestamp } = await ethers.provider.getBlock("latest");
//       // await camelotRouterContract
//       //   .connect(this.futureUsePool)
//       //   .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//       //     kongAmount,
//       //     0,
//       //     path2,
//       //     this.futureUsePool.address,
//       //     "0x0000000000000000000000000000000000000000",
//       //     timestamp + 1
//       //   );
//       // // TESTS A SUPPRIMER

//       const startingBalance = ethers.utils.parseEther("11");

//       // Creation de 200 wallets
//       for (let i = 0; i < 200; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signers.push(wallet);
//       }

//       // On leur donne 11 ETH pour obtenir 10 WETH
//       const wethAmount = ethers.utils.parseEther("10");
//       const path = [weth, kong.address];
//       const fundThem = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             expect(
//               await setBalance(wallet.address, startingBalance)
//             ).to.changeEtherBalance(wallet, startingBalance);
//             await wethContract.connect(wallet).deposit({ value: wethAmount });
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       const balanceKongCamelotPairBefore = await kong.balanceOf(camelotPair);
//       const balanceKongContractKongBefore = await kong.balanceOf(kong.address);
//       const balanceKongDistributionPoolBefore = await kong.balanceOf(
//         distributionPool.address
//       );
//       const balanceWETHCamelotPairBefore = await wethContract.balanceOf(
//         camelotPair
//       );
//       const balanceETHContractKongBefore = await ethers.provider.getBalance(
//         kong.address
//       );
//       const balanceETHDistributionPoolBefore = await ethers.provider.getBalance(
//         distributionPool.address
//       );

//       // les 100 premiers users transforment leurs WETH en BNA
//       const firstPartSigners = signers.slice(0, 100);
//       const wethAmountToBNA = ethers.utils.parseEther("0.4");
//       const getBanana = async () => {
//         return Promise.all(
//           firstPartSigners.map(async (wallet, i) => {
//             await wethContract
//               .connect(wallet)
//               .approve(
//                 camelotRouter,
//                 wethAmountToBNA.mul(100 + i * 3).div(100)
//               );
//             const timestamp = await time.latest();
//             await camelotRouterContract
//               .connect(wallet)
//               .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//                 wethAmountToBNA.mul(100 + i * 3).div(100),
//                 wethAmountToBNA,
//                 path,
//                 wallet.address,
//                 "0x0000000000000000000000000000000000000000",
//                 timestamp + i + 60
//               );
//           })
//         ).then(() => {
//           console.log("getBanana done");
//         });
//       };
//       await getBanana();

//       // les 100 premiers users achètent un nombre aléatoire entre 1 et 15
//       const signersBuyNodes = async () => {
//         return Promise.all(
//           firstPartSigners.map(async (wallet, i) => {
//             // i == 99 &&
//             //   console.log(
//             //     "signersBuyNodes last wallet balances",
//             //     await kong.balanceOf(wallet.address)
//             //   );
//             const randomValue = Math.floor(Math.random() * 15) + 1;
//             await kong.connect(wallet).buyNodes(randomValue);
//           })
//         ).then(() => {
//           console.log("secondPartSignersBuyNodes done");
//         });
//       };
//       await signersBuyNodes();

//       // 5 journées s'écoulent
//       moveBlocksByDays(5);

//       const balanceKongCamelotPairAfter = await kong.balanceOf(camelotPair);
//       const balanceKongContractKongAfter = await kong.balanceOf(kong.address);
//       const balanceKongDistributionPoolAfter = await kong.balanceOf(
//         distributionPool.address
//       );
//       const balanceWETHCamelotPairAfter = await wethContract.balanceOf(
//         camelotPair
//       );
//       const balanceETHContractKongAfter = await ethers.provider.getBalance(
//         kong.address
//       );
//       const balanceETHDistributionPoolAfter = await ethers.provider.getBalance(
//         distributionPool.address
//       );
//       expect(balanceKongCamelotPairAfter).to.be.lt(
//         balanceKongCamelotPairBefore
//       );
//       expect(balanceWETHCamelotPairAfter).to.be.gt(
//         balanceWETHCamelotPairBefore
//       );
//       expect(balanceKongContractKongAfter).to.be.lt(
//         balanceKongContractKongBefore
//       );
//       expect(balanceETHContractKongAfter).to.be.gt(
//         balanceETHContractKongBefore
//       );
//       expect(balanceKongDistributionPoolAfter).to.be.gt(
//         balanceKongDistributionPoolBefore
//       );
//       expect(balanceETHDistributionPoolAfter).to.be.gt(
//         balanceETHDistributionPoolBefore
//       );
//     });

//     it("Users of Presale unstake to get rewards", async function () {
//       // les users de la présale non whitelistés retirent leurs gains en UNSTAKE et les transforment en WETH
//       const unstakePresale = async () => {
//         return Promise.all(
//           signersPresale.map(async (wallet) => {
//             const nodesBalance = (
//               await node.connect(wallet).getNodesDataOf(wallet.address)
//             )[0];

//             const baseNonce = await ethers.provider.getTransactionCount(
//               wallet.address
//             );
//             return Promise.all(
//               nodesBalance.map(async (nodeId, j) => {
//                 await kong
//                   .connect(wallet)
//                   .unstake(nodeId, { nonce: baseNonce + j });
//               })
//             );
//           })
//         ).then(() => {
//           console.log("unstakePresale done");
//         });
//       };
//       await unstakePresale();

//       const path2 = [kong.address, weth];
//       const getWETHPresale = async () => {
//         return Promise.all(
//           signersPresale.map(async (wallet, i) => {
//             const balanceBNA = await kong.balanceOf(wallet.address);
//             await kong.connect(wallet).approve(camelotRouter, balanceBNA);
//             const timestamp = await time.latest();
//             await camelotRouterContract
//               .connect(wallet)
//               .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//                 balanceBNA,
//                 0,
//                 path2,
//                 wallet.address,
//                 "0x0000000000000000000000000000000000000000",
//                 timestamp + i + 60
//               );
//           })
//         ).then(() => {
//           console.log("getWETHPresale done");
//         });
//       };
//       await getWETHPresale();

//       // 2 journées s'écoulent
//       moveBlocksByDays(2);
//     });

//     it("Public Sale part 2", async function () {
//       // // TESTS A SUPPRIMER
//       // // Pour ce passer de l'étape précedente
//       // const path2 = [kong.address, weth];
//       // const kongAmount = ethers.utils.parseEther("74000");
//       // await kong.connect(this.futureUsePool).approve(camelotRouter, kongAmount);
//       // const { timestamp } = await ethers.provider.getBlock("latest");
//       // await camelotRouterContract
//       //   .connect(this.futureUsePool)
//       //   .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//       //     kongAmount,
//       //     0,
//       //     path2,
//       //     this.futureUsePool.address,
//       //     "0x0000000000000000000000000000000000000000",
//       //     timestamp + 1
//       //   );
//       // // TESTS A SUPPRIMER

//       // On répète l'opération
//       // les 20 suivants achètent un nombre aléatoire entre 30 et 40
//       const wethAmount = ethers.utils.parseEther("5");
//       const path = [weth, kong.address];
//       const secondPartSigners = signers.slice(100, 120);
//       const getBanana2 = async () => {
//         return Promise.all(
//           secondPartSigners.map(async (wallet, i) => {
//             await wethContract
//               .connect(wallet)
//               .approve(camelotRouter, wethAmount);
//             const timestamp = await time.latest();
//             await camelotRouterContract
//               .connect(wallet)
//               .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//                 wethAmount,
//                 wethAmount,
//                 path,
//                 wallet.address,
//                 "0x0000000000000000000000000000000000000000",
//                 timestamp + i + 1
//               );
//           })
//         ).then(() => {
//           console.log("getBanana done");
//         });
//       };
//       await getBanana2();

//       const signersBuyNodes2 = async () => {
//         return Promise.all(
//           secondPartSigners.map(async (wallet, i) => {
//             // (i == 1 || i == 19) &&
//             //   console.log(
//             //     "signersBuyNodes2 first and last wallet balances",
//             //     await kong.balanceOf(wallet.address)
//             //   );
//             const randomValue = Math.floor(Math.random() * 11) + 30;
//             await kong.connect(wallet).buyNodes(randomValue);
//           })
//         ).then(() => {
//           console.log("secondPartSignersBuyNodes done");
//         });
//       };
//       await signersBuyNodes2();

//       // 1 journée s'écoule
//       moveBlocksByDays(1);

//       // les derniers users achètent un nombre aléatoire entre 1 et 5
//       const wethAmount2 = ethers.utils.parseEther("0.5");
//       const thirdPartSigners = signers.slice(120);
//       const getBanana3 = async () => {
//         return Promise.all(
//           thirdPartSigners.map(async (wallet, i) => {
//             await wethContract
//               .connect(wallet)
//               .approve(camelotRouter, wethAmount2.mul(100 + i * 2).div(100));
//             const timestamp = await time.latest();
//             await camelotRouterContract
//               .connect(wallet)
//               .swapExactTokensForTokensSupportingFeeOnTransferTokens(
//                 wethAmount2.mul(100 + i * 2).div(100),
//                 wethAmount2,
//                 path,
//                 wallet.address,
//                 "0x0000000000000000000000000000000000000000",
//                 timestamp + i + 60
//               );
//           })
//         ).then(() => {
//           console.log("getBanana done");
//         });
//       };
//       await getBanana3();

//       const signersBuyNodes3 = async () => {
//         return Promise.all(
//           thirdPartSigners.map(async (wallet, i) => {
//             // i % 10 == 0 &&
//             //   console.log(
//             //     "signersBuyNodes3 wallet balances",
//             //     await kong.balanceOf(wallet.address)
//             //   );
//             const randomValue = Math.floor(Math.random() * 5) + 1;
//             await kong.connect(wallet).buyNodes(randomValue);
//           })
//         ).then(() => {
//           console.log("thirdPartSignersBuyNodes done");
//         });
//       };
//       await signersBuyNodes3();

//       const balanceKongNodesSigners = await node.getTotalNodesPerType();
//       console.log(
//         "Nombre de node vendu après les deux présales et public sale :>> ",
//         balanceKongNodesSigners
//       );

//       // 10 journées s'écoulent
//       moveBlocksByDays(10);
//     });

//     it("Stake and Claim rewards", async function () {
//       const balanceKongCamelotPairBefore = await kong.balanceOf(camelotPair);
//       const balanceWETHCamelotPairBefore = await wethContract.balanceOf(
//         camelotPair
//       );
//       const balanceKongDistributionPoolBefore = await kong.balanceOf(
//         distributionPool.address
//       );

//       const stakePublicSale = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             const nodesBalance = (
//               await node.connect(wallet).getNodesDataOf(wallet.address)
//             )[0];

//             const baseNonce = await ethers.provider.getTransactionCount(
//               wallet.address
//             );
//             return Promise.all(
//               nodesBalance.map(async (nodeId, j) => {
//                 await kong
//                   .connect(wallet)
//                   .stake(nodeId, 0, { nonce: baseNonce + j });
//               })
//             );
//           })
//         ).then(() => {
//           console.log("stakePublicSale done");
//         });
//       };
//       await stakePublicSale();

//       // 20 journées s'écoulent
//       moveBlocksByDays(20);

//       const claimAllRewardsPublicSale = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             await kong.connect(wallet).claimAllRewards();
//           })
//         ).then(() => {
//           console.log("claimAllRewards Public Sale done");
//         });
//       };
//       await claimAllRewardsPublicSale();

//       const balanceKongCamelotPairAfter = await kong.balanceOf(camelotPair);
//       const balanceWETHCamelotPairAfter = await wethContract.balanceOf(
//         camelotPair
//       );
//       const balanceKongDistributionPoolAfter = await kong.balanceOf(
//         distributionPool.address
//       );
//       expect(balanceKongCamelotPairAfter).to.be.gt(
//         balanceKongCamelotPairBefore
//       );
//       expect(balanceWETHCamelotPairAfter).to.be.lt(
//         balanceWETHCamelotPairBefore
//       );

//       expect(balanceKongDistributionPoolAfter).to.be.lt(
//         balanceKongDistributionPoolBefore
//       );
//     });

//     it("boostRewards", async function () {
//       const balanceETHContractKongBefore = await ethers.provider.getBalance(
//         kong.address
//       );
//       const balanceETHDistributionPoolBefore = await ethers.provider.getBalance(
//         distributionPool.address
//       );
//       const balanceETHUser4Before = await ethers.provider.getBalance(
//         this.user4.address
//       );
//       expect(balanceETHContractKongBefore).to.be.gt(0);
//       expect(balanceETHDistributionPoolBefore).to.be.gt(0);

//       await kong
//         .connect(this.user4)
//         .boostReward(ethers.utils.parseEther("1000"));
//       await distributionPool
//         .connect(this.user4)
//         .boostReward(ethers.utils.parseEther("1000"));

//       const balanceETHContractKongAfter = await ethers.provider.getBalance(
//         kong.address
//       );
//       const balanceETHDistributionPoolAfter = await ethers.provider.getBalance(
//         distributionPool.address
//       );
//       const balanceETHUser4After = await ethers.provider.getBalance(
//         this.user4.address
//       );
//       expect(balanceETHContractKongAfter).to.be.equal(0);
//       expect(balanceETHDistributionPoolAfter).to.be.equal(0);
//       expect(balanceETHUser4After).to.be.gt(balanceETHUser4Before);
//     });
//   });
// });
