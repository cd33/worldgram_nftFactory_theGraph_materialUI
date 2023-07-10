import "./App.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "./context/rainbow";
import { EthersProvider } from "./context/ethersProviderContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

function App() {
  const notify = () => toast("Wow so easy!");
  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
        <EthersProvider>
          <>
            <Navbar />
            <button onClick={notify}>Notify!</button>
            <ToastContainer />
          </>
        </EthersProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
