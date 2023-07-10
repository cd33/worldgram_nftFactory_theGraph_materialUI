import "./App.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "./context/rainbow";
import { EthersProvider } from "./context/ethersProviderContext";
import { toast } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const notify = () => toast("Wow so easy!");
  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
        <EthersProvider>
          <Routes>
            <Route element={<Navbar />}>
              <Route path="/" element={<Home />} />
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
