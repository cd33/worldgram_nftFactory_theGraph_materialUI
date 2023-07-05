import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@typechain/hardhat";

const SEPOLIA_TESTNET_ALCHEMY = process.env.SEPOLIA_TESTNET_ALCHEMY || "";
const PRIVATE_KEY_TEST = process.env.PRIVATE_KEY_TEST || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_TESTNET_ALCHEMY,
      accounts: [PRIVATE_KEY_TEST],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN,
  },
  gasReporter: {
    enabled: false,
  },
};

export default config;
