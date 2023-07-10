import "@rainbow-me/rainbowkit/styles.css";

// import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [publicProvider()]
);

const projectId = "WorldGram";

// const { connectors } = getDefaultWallets({
//     appName: 'WorldGram',
//     projectId,
//     chains
//   });

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      injectedWallet({ chains }),
      walletConnectWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

export const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
