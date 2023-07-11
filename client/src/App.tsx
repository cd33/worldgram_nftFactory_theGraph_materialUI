import "./App.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "./context/rainbow";
import { EthersProvider } from "./context/ethersProviderContext";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./pages/ErrorPage";
import MyNFTs from "./pages/MyNFTs";
import NFTCollection from "./pages/NFTCollection";

function App() {
  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
        <EthersProvider>
          <Routes>
            <Route element={<Navbar />}>
              <Route path="/" element={<Home />} />
              <Route path="/collection/:slug" element={<NFTCollection />} />
              <Route path="/mynfts" element={<MyNFTs />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </EthersProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
