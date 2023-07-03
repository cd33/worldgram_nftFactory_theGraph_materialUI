// import { expect } from "chai";
// import { ethers, network } from "hardhat";
// import {
//   loadFixture,
//   time,
//   setBalance,
// } from "@nomicfoundation/hardhat-network-helpers";
// import { days } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration";
// import { Wallet } from "ethers";

// describe("Compute tests", async () => {
//   let bayesERC20: BayesERC20,
//     delphyaBase: DelphyaBase,
//     question: Question,
//     questionClone: Question,
//     delphyaPool: DelphyaPool,
//     delphyaScore: DelphyaScore;

//   beforeEach("Setup", async () => {
//     ({
//       bayesERC20,
//       delphyaBase,
//       delphyaPool,
//       question,
//       delphyaScore,
//       owner,
//       account1,
//     } = await loadFixture(setupContractsFixture));
//     // let endTimestamp = (await time.latest()) + days(90);

//     await bayesERC20.approve(
//       delphyaPool.address,
//       ethers.utils.parseUnits((1e6).toString())
//     );
//     await delphyaPool.stake(ethers.utils.parseUnits((1e6).toString()));

//     await delphyaBase.giftNFT(owner.address);
//     await delphyaBase.giftNFT(account1.address);
//   });

//   describe("Simulations All Process, Lets go !", async () => {
//     // it("test move time and block", async () => {
//     //   const blockNumberBefore = await ethers.provider.getBlockNumber();
//     //   const dateBefore = (await ethers.provider.getBlock(blockNumberBefore))
//     //     .timestamp;
//     //   // console.log("before blockNumber :>> ", blockNumberBefore);
//     //   // console.log("before date :>> ", dateBefore);
//     //   await moveTimeAndBlocks(daysToSeconds(2)); // sur mumbai environ 1 block toutes les 2 secondes
//     //   const blockNumberAfter = await ethers.provider.getBlockNumber();
//     //   const dateAfter = (await ethers.provider.getBlock(blockNumberAfter))
//     //     .timestamp;
//     //   // console.log("after blockNumber :>> ", blockNumberAfter);
//     //   // console.log("after date :>> ", dateAfter);
//     //   expect(blockNumberAfter).to.be.equal(
//     //     blockNumberBefore + daysToSeconds(2) / 2
//     //   );
//     //   expect(dateAfter + 1).to.be.equal(dateBefore + daysToSeconds(2));
//     // });

//     it("1 user autre que owner", async () => {
//       const endTimestamp = (await time.latest()) + days(90);
//       const endTimestamp2 = (await time.latest()) + days(100);

//       const tx = await delphyaBase.newQuestion(
//         "question test",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt = await tx.wait();
//       const questiontx = receipt.events && receipt.events[3].args;
//       const questionId = questiontx?._questionId;
//       const questionAddress = questiontx?._questionAddress;
//       console.log("questionAddress :>> ", questionAddress);

//       await delphyaBase.validateQuestion(questionAddress, questionId);

//       await delphyaBase
//         .connect(account1)
//         .answerQuestion(questionAddress, [40, 60]);

//       await delphyaBase.proposeQuestionResolution(
//         0,
//         endTimestamp2,
//         questionAddress
//       );

//       // On avance de 10 jours
//       await time.increase(days(10));

//       await delphyaBase.validateQuestionResolution(questionAddress);

//       const scoring1 = await delphyaScore.getQuestionScoring(questionAddress);
//       console.log("scoring q1", scoring1);

//       // On avance de 10 jours
//       await time.increase(days(10));

//       await delphyaBase
//         .connect(account1)
//         .engraveAnswersForQuestion(questionAddress);
//       const average1 = await delphyaScore.getQuestionDailyAverages(
//         questionAddress
//       );
//       console.log("average q1 after 1", average1);

//       // On avance de 20 jours
//       await time.increase(days(20));

//       await delphyaBase.endQuestionScoringCeremony(questionAddress);

//       // On avance de 30 jours
//       await time.increase(days(30));

//       await delphyaBase.connect(account1).computeQuestionScore(questionAddress);
//       const q1score1 = await delphyaScore.getForecaster(
//         questionAddress,
//         account1.address
//       );
//       console.log("score1 q1", q1score1);
//     });

//     it("2 users with 2 questions until 2025", async () => {
//       const endTimestamp = (await time.latest()) + days(700);
//       let endTimestamp2 = (await time.latest()) + days(730);

//       const tx = await delphyaBase.newQuestion(
//         "question test",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt = await tx.wait();
//       const questiontx = receipt.events && receipt.events[3].args;
//       const questionId = questiontx?._questionId;
//       const questionAddress = questiontx?._questionAddress;

//       const tx2 = await delphyaBase.newQuestion(
//         "question test 2",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt2 = await tx2.wait();
//       const question2 = receipt2.events && receipt2.events[3].args;
//       const questionId2 = question2?._questionId;
//       const questionAddress2 = question2?._questionAddress;

//       await delphyaBase.validateQuestion(questionAddress, questionId);
//       await delphyaBase.validateQuestion(questionAddress2, questionId2);

//       await delphyaBase.answerQuestion(questionAddress, [70, 30]);
//       await delphyaBase
//         .connect(account1)
//         .answerQuestion(questionAddress, [40, 60]);

//       await delphyaBase.proposeQuestionResolution(
//         0,
//         endTimestamp2,
//         questionAddress
//       );

//       // On avance de 10 jours
//       await time.increase(days(10));

//       await delphyaBase.validateQuestionResolution(questionAddress);

//       // On avance de 10 jours
//       await time.increase(days(10));

//       await delphyaBase.engraveAnswersForQuestion(questionAddress);
//       await delphyaBase
//         .connect(account1)
//         .engraveAnswersForQuestion(questionAddress);

//       // On avance de 20 jours
//       await time.increase(days(20));

//       await delphyaBase.endQuestionScoringCeremony(questionAddress);

//       // On avance de 30 jours
//       await time.increase(days(30));

//       await delphyaBase.computeQuestionScore(questionAddress);
//       await delphyaBase.connect(account1).computeQuestionScore(questionAddress);
//     });

//     it("50 participants, 10 questions, 100 days", async () => {
//       let arrayAddressesQuestions: any[] = [];
//       let signers: Wallet[] = [];
//       let arrayAddressesWallet: string[] = [];
//       const endTimestamp = (await time.latest()) + days(90);
//       const endTimestamp2 = (await time.latest()) + days(100);
//       const numberOfQuestions = 10;
//       const numberOfUsers = 50;

//       console.log("New Questions...");
//       for (let i = 0; i < numberOfQuestions; ++i) {
//         const tx = await delphyaBase.newQuestion(
//           "question test",
//           endTimestamp,
//           [0, 1]
//         );
//         const receipt = await tx.wait();
//         const questiontx = receipt.events && receipt.events[3].args;
//         const questionId = questiontx?._questionId;
//         const questionAddress = questiontx?._questionAddress;

//         arrayAddressesQuestions.push(questionAddress);
//         await delphyaBase.validateQuestion(questionAddress, questionId);
//       }

//       // Creation des wallets
//       for (let i = 0; i < numberOfUsers; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signers.push(wallet);
//         arrayAddressesWallet.push(wallet.address.toString());
//       }

//       // On leur donne 100 MATIC et gift NFT
//       const fundThem = async () => {
//         return Promise.all(
//           arrayAddressesWallet.map(async (wallet) => {
//             await setBalance(wallet, ethers.utils.parseEther("100"));
//             await delphyaBase.giftNFT(wallet);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       // ANSWERS
//       const walletsAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             let answers: number[][] = [];
//             for (let i = 0; i < numberOfQuestions; ++i) {
//               const randomNumber = randomNumberAnswer();
//               const firstValue = 100 - randomNumber;
//               answers.push([firstValue, randomNumber]);
//             }
//             await delphyaBase
//               .connect(wallet)
//               .answerQuestionBatch(arrayAddressesQuestions, answers);
//           })
//         ).then(() => {
//           console.log("walletsAnswer done");
//         });
//       };
//       await walletsAnswer();

//       // On avance de 10 jours
//       await time.increase(days(10));

//       console.log(
//         "proposeQuestionResolution and validateQuestionResolution..."
//       );
//       for (const address of arrayAddressesQuestions) {
//         await delphyaBase.proposeQuestionResolution(0, endTimestamp2, address);
//         await delphyaBase.validateQuestionResolution(address);
//       }

//       // On avance de 10 jours
//       await time.increase(days(10));

//       console.log("walletsEngraveAnswer...");
//       let numberOfWalletEngraved = 0;
//       const walletsEngraveAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             return Promise.all(
//               arrayAddressesQuestions.map(async (address, i) => {
//                 await delphyaBase
//                   .connect(wallet)
//                   .engraveAnswersForQuestion(address, { nonce: 1 + i });
//               })
//             ).then(() => {
//               numberOfWalletEngraved++;
//               console.log(
//                 "Number Of Wallet Engraved: ",
//                 numberOfWalletEngraved
//               );
//             });
//           })
//         );
//       };
//       await walletsEngraveAnswer();

//       // On avance de 20 jours
//       await time.increase(days(20));

//       console.log("endQuestionScoringCeremony...");
//       for (const address of arrayAddressesQuestions) {
//         await delphyaBase.endQuestionScoringCeremony(address);
//       }

//       // On avance de 30 jours
//       await time.increase(days(30));

//       console.log("walletsComputeScores...");
//       let numberOfWalletComputed = 0;
//       const walletsComputeScores = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             return Promise.all(
//               arrayAddressesQuestions.map(async (address, i) => {
//                 await delphyaBase
//                   .connect(wallet)
//                   .computeQuestionScore(address, { nonce: 11 + i });
//               })
//             ).then(() => {
//               numberOfWalletComputed++;
//               console.log(
//                 "Number Of Wallet Computed: ",
//                 numberOfWalletComputed
//               );
//             });
//           })
//         );
//       };
//       await walletsComputeScores();
//     });

//     it("100 users, 1 question, les personne changent de réponse tous les jours, 365 days", async () => {
//       let signers: Wallet[] = [];
//       let arrayAddressesWallet: string[] = [];
//       const numberOfDays = 365;
//       const endTimestamp = (await time.latest()) + days(numberOfDays);
//       const numberOfUsers = 100;

//       const tx = await delphyaBase.newQuestion(
//         "question test",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt = await tx.wait();
//       const questiontx = receipt.events && receipt.events[3].args;
//       const questionId = questiontx?._questionId;
//       const questionAddress = questiontx?._questionAddress;

//       await delphyaBase.validateQuestion(questionAddress, questionId);

//       // Creation des wallets
//       for (let i = 0; i < numberOfUsers; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signers.push(wallet);
//         arrayAddressesWallet.push(wallet.address.toString());
//       }

//       // On leur donne 100 MATIC et gift NFT
//       const fundThem = async () => {
//         return Promise.all(
//           arrayAddressesWallet.map(async (wallet) => {
//             await setBalance(wallet, ethers.utils.parseEther("100"));
//             await delphyaBase.giftNFT(wallet);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       console.log("walletsAnswer...");
//       const walletsAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             const randomNumber = randomNumberAnswer();
//             const firstValue = 100 - randomNumber;
//             await delphyaBase
//               .connect(wallet)
//               .answerQuestion(questionAddress, [firstValue, randomNumber]);
//           })
//         ).then(async () => {
//           await time.increase(days(1));
//         });
//       };
//       for (let i = 0; i < numberOfDays; ++i) {
//         i % 5 === 0 && console.log("Day #", i);
//         await walletsAnswer();
//       }

//       // // TESTS
//       // questionClone = question.attach(questionAddress);
//       // const answersToto = await questionClone.getAnswers(arrayAddressesWallet[0])
//       // console.log('answersToto :>> ', answersToto);

//       console.log("proposeQuestionResolution...");
//       await delphyaBase.proposeQuestionResolution(
//         0,
//         endTimestamp,
//         questionAddress
//       );

//       console.log("validateQuestionResolution...");
//       await delphyaBase.validateQuestionResolution(questionAddress);

//       console.log("walletsEngraveAnswer...");
//       const walletsEngraveAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             await delphyaBase
//               .connect(wallet)
//               .engraveAnswersForQuestion(questionAddress);
//           })
//         );
//       };
//       await walletsEngraveAnswer();

//       // // TESTS
//       // const average1 = await delphyaScore.getQuestionDailyAverages(
//       //   questionAddress
//       // );
//       // console.log("average q1 after 1", average1);
//       // const yo = await delphyaScore.getForecaster(
//       //   questionAddress,
//       //   arrayAddressesWallet[0]
//       // );
//       // console.log("yo :>> ", yo);
//       // const scoring1 = await delphyaScore.getQuestionScoring(questionAddress);
//       // console.log("scoring1", scoring1);
//       // const toto1 = await delphyaScore.getPercentageVerifiedAnswer(
//       //   questionAddress,
//       //   arrayAddressesWallet[0]
//       // );
//       // console.log("toto1 :>> ", toto1);
//       // const toto2 = await delphyaScore.getPercentageVerifiedAnswer(
//       //   questionAddress,
//       //   arrayAddressesWallet[1]
//       // );
//       // console.log("toto2 :>> ", toto2);

//       console.log("endQuestionScoringCeremony...");
//       await delphyaBase.endQuestionScoringCeremony(questionAddress);

//       console.log("walletsComputeScores...");
//       const walletsComputeScores = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             await delphyaBase
//               .connect(wallet)
//               .computeQuestionScore(questionAddress);
//           })
//         ).then(() => {
//           console.log("walletsComputeScores done");
//         });
//       };
//       await walletsComputeScores();
//     });

//     it("50 users, 1 question, 10 réponses différentes par user, 730 days", async () => {
//       let signers: Wallet[] = [];
//       let arrayAddressesWallet: string[] = [];
//       const numberOfDays = 730;
//       const numberOfAnswers = 10;
//       const endTimestamp = (await time.latest()) + days(numberOfDays);
//       const numberOfUsers = 50;

//       const tx = await delphyaBase.newQuestion(
//         "question test",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt = await tx.wait();
//       const questiontx = receipt.events && receipt.events[3].args;
//       const questionId = questiontx?._questionId;
//       const questionAddress = questiontx?._questionAddress;

//       await delphyaBase.validateQuestion(questionAddress, questionId);

//       // Creation des wallets
//       for (let i = 0; i < numberOfUsers; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signers.push(wallet);
//         arrayAddressesWallet.push(wallet.address.toString());
//       }

//       // On leur donne 100 MATIC et gift NFT
//       const fundThem = async () => {
//         return Promise.all(
//           arrayAddressesWallet.map(async (wallet) => {
//             await setBalance(wallet, ethers.utils.parseEther("100"));
//             await delphyaBase.giftNFT(wallet);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       console.log("walletsAnswer...");
//       const walletsAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             const randomNumber = randomNumberAnswer();
//             const firstValue = 100 - randomNumber;
//             await delphyaBase
//               .connect(wallet)
//               .answerQuestion(questionAddress, [firstValue, randomNumber]);
//           })
//         ).then(async () => {
//           await time.increase(days(numberOfDays / numberOfAnswers));
//         });
//       };
//       for (let i = 0; i < numberOfAnswers; ++i) {
//         console.log("Answer #", i);
//         await walletsAnswer();
//       }

//       // // TESTS
//       // questionClone = question.attach(questionAddress);
//       // const answersToto = await questionClone.getAnswers(
//       //   arrayAddressesWallet[0]
//       // );
//       // console.log("answersToto :>> ", answersToto);

//       console.log("proposeQuestionResolution...");
//       await delphyaBase.proposeQuestionResolution(
//         0,
//         endTimestamp,
//         questionAddress
//       );

//       console.log("validateQuestionResolution...");
//       await delphyaBase.validateQuestionResolution(questionAddress);

//       console.log("walletsEngraveAnswer...");
//       const walletsEngraveAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet, i) => {
//             await delphyaBase
//               .connect(wallet)
//               .engraveAnswersForQuestion(questionAddress);
//           })
//         );
//       };
//       await walletsEngraveAnswer();

//       console.log("endQuestionScoringCeremony...");
//       await delphyaBase.endQuestionScoringCeremony(questionAddress);

//       console.log("walletsComputeScores...");
//       const walletsComputeScores = async () => {
//         return Promise.all(
//           signers.map(async (wallet, i) => {
//             await delphyaBase
//               .connect(wallet)
//               .computeQuestionScore(questionAddress);
//           })
//         ).then(() => {
//           console.log("walletsComputeScores done");
//         });
//       };
//       await walletsComputeScores();
//     });

//     it("500 users, 1 question, 20 réponses différentes par user, 366 days", async () => {
//       let signers: Wallet[] = [];
//       let arrayAddressesWallet: string[] = [];
//       const numberOfDays = 366;
//       const numberOfAnswers = 20;
//       const endTimestamp = (await time.latest()) + days(numberOfDays);
//       const numberOfUsers = 500;

//       const tx = await delphyaBase.newQuestion(
//         "question test",
//         endTimestamp,
//         [0, 1]
//       );
//       const receipt = await tx.wait();
//       const questiontx = receipt.events && receipt.events[3].args;
//       const questionId = questiontx?._questionId;
//       const questionAddress = questiontx?._questionAddress;

//       await delphyaBase.validateQuestion(questionAddress, questionId);

//       // Creation des wallets
//       for (let i = 0; i < numberOfUsers; i++) {
//         let wallet = ethers.Wallet.createRandom().connect(ethers.provider);
//         signers.push(wallet);
//         arrayAddressesWallet.push(wallet.address.toString());
//       }

//       // On leur donne 100 MATIC et gift NFT
//       const fundThem = async () => {
//         return Promise.all(
//           arrayAddressesWallet.map(async (wallet) => {
//             await setBalance(wallet, ethers.utils.parseEther("100"));
//             await delphyaBase.giftNFT(wallet);
//           })
//         ).then(() => {
//           console.log("fundThem done");
//         });
//       };
//       await fundThem();

//       console.log("walletsAnswer...");
//       const walletsAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             const randomNumber = randomNumberAnswer();
//             const firstValue = 100 - randomNumber;
//             await delphyaBase
//               .connect(wallet)
//               .answerQuestion(questionAddress, [firstValue, randomNumber]);
//           })
//         ).then(async () => {
//           await time.increase(days(numberOfDays / numberOfAnswers));
//         });
//       };
//       for (let i = 0; i < numberOfAnswers; ++i) {
//         console.log("Answer #", i);
//         await walletsAnswer();
//       }

//       // // TESTS
//       // questionClone = question.attach(questionAddress);
//       // const answersToto = await questionClone.getAnswers(
//       //   arrayAddressesWallet[0]
//       // );
//       // console.log("answersToto :>> ", answersToto);

//       console.log("proposeQuestionResolution...");
//       await delphyaBase.proposeQuestionResolution(
//         0,
//         endTimestamp,
//         questionAddress
//       );

//       console.log("validateQuestionResolution...");
//       await delphyaBase.validateQuestionResolution(questionAddress);

//       console.log("walletsEngraveAnswer...");
//       const walletsEngraveAnswer = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             await delphyaBase
//               .connect(wallet)
//               .engraveAnswersForQuestion(questionAddress);
//           })
//         );
//       };
//       await walletsEngraveAnswer();

//       console.log("endQuestionScoringCeremony...");
//       await delphyaBase.endQuestionScoringCeremony(questionAddress);

//       console.log("walletsComputeScores...");
//       const walletsComputeScores = async () => {
//         return Promise.all(
//           signers.map(async (wallet) => {
//             await delphyaBase
//               .connect(wallet)
//               .computeQuestionScore(questionAddress);
//           })
//         ).then(() => {
//           console.log("walletsComputeScores done");
//         });
//       };
//       await walletsComputeScores();
//     });
//   });
// });
