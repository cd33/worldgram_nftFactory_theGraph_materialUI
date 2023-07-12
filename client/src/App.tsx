import "./App.css";
import { useAccount } from "wagmi";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ErrorPage from "./pages/ErrorPage";
import MyNFTs from "./pages/MyNFTs";
import NFTCollection from "./pages/NFTCollection";
import useEthersProvider from "./context/useEthersProvider";

function App() {
  const { owner } = useEthersProvider();
  const { address } = useAccount();
  const isAdmin = owner === address;

  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/collection/:slug" element={<NFTCollection />} />
        <Route path="/mynfts" element={<MyNFTs />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
