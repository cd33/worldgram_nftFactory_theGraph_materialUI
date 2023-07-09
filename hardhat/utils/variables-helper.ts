// // sepolia
// export const worldgramBase = "0xFDCcE9b656a7a8dDcDa8aDd0B978C1991690d2E4"
// export const nftStorage = "0xD9C239AaF1681e0819d3F7FEf929Cfef92034A91"
// export const nft721 = "0x33801fECd9181Aaabb85e007e4607a86088a5117"
// export const nftFactory = "0xdE8860F8E20ce1445f7bF31927dD16888bB02e90"

// local
export const worldgramBase = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const nftStorage = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const nft721 = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
export const nftFactory = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";

export const baseUri = "ipfs://XXX/";
export const maxSupply = 100;
export const publicSalePrice = 100000000000000;
export const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // 2nd address hardhat

export const priceNFT = (amount: number) =>
  (amount * Number(publicSalePrice)).toString();
