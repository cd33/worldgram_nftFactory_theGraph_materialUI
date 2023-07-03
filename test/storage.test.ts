// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { setupContractsFixture } from "./utils";
// import { GarageStorage, Shop, CarFactory } from "../typechain-types";

// describe("GarageStorage", () => {
//   let garageStorage: GarageStorage,
//     shop: Shop,
//     carFactory: CarFactory,
//     owner;

//   before("Setup", async () => {
//     ({ garageStorage, shop, carFactory, owner } = await loadFixture(
//       setupContractsFixture
//     ));
//     await shop.setCarFactory(carFactory.address);
//   });

//   it("Set, Get and Delete", async () => {
//     let addressContract = await garageStorage.getAddress(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.addressContract", 1])
//       )
//     );
//     let available = await garageStorage.getBool(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.available", 1])
//       )
//     );
//     expect(addressContract).to.equal(
//       "0x0000000000000000000000000000000000000000"
//     );
//     expect(available).to.equal(false);

//     await garageStorage.setShop(owner.address);

//     const car = {
//       addressContract: owner.address,
//       available: true,
//     };

//     await garageStorage.setAddress(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.addressContract", 1])
//       ),
//       car.addressContract
//     );
//     await garageStorage.setBool(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.available", 1])
//       ),
//       car.available
//     );
//     addressContract = await garageStorage.getAddress(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.addressContract", 1])
//       )
//     );
//     available = await garageStorage.getBool(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.available", 1])
//       )
//     );
//     expect(addressContract).to.equal(car.addressContract);
//     expect(available).to.equal(car.available);

//     await garageStorage.deleteAddress(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.addressContract", 1])
//       )
//     );
//     await garageStorage.deleteBool(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.available", 1])
//       )
//     );

//     addressContract = await garageStorage.getAddress(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.addressContract", 1])
//       )
//     );
//     available = await garageStorage.getBool(
//       utils.keccak256(
//         utils.solidityPack(["string", "uint"], ["car.available", 1])
//       )
//     );
//     expect(addressContract).to.equal(
//       "0x0000000000000000000000000000000000000000"
//     );
//     expect(available).to.equal(false);
//   });
// });
