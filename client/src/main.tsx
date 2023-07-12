import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "./context/rainbow";
import { EthersProvider } from "./context/ethersProviderContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={wagmiClient}>
        <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
          <EthersProvider>
            <App />
          </EthersProvider>
        </RainbowKitProvider>
      </WagmiConfig>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
