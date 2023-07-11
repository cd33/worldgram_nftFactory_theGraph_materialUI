import { useEffect, useState } from "react";
import axios from "axios";
import useEthersProvider from "../context/useEthersProvider";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import Contract721 from "../context/NFT721.json";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getNftContractByAddress } from "../context/queries";
import { Button, Container, Typography } from "@mui/material";
import Counter from "../components/Counter";

const NFTCollection = () => {
  const params = useParams();
  const slug = params.slug || "";
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { owner } = useEthersProvider();
  const { address, isConnected } = useAccount();
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();

  const [counterNFT, setCounterNFT] = useState<number>(1);
  const [basketETH, setBasketETH] = useState<number>(0);
  const [counterGift, setCounterGift] = useState<number>(0);
  const [giftAddress, setGiftAddress] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      const endpoint = import.meta.env.VITE_GRAPH_QL_API;
      let response = await axios.post(endpoint!, getNftContractByAddress(slug));

      if (response.data.data && response.data.data.nftcontracts[0]) {
        response = JSON.parse(
          JSON.stringify(response.data.data.nftcontracts[0])
        );
        setData(response);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [slug]);

  async function publicSaleMint(_quantity: number) {
    if (provider && signer && basketETH) {
      setIsLoading(true);
      const contract = new ethers.Contract(slug, Contract721.abi, signer);

      console.log("basketETH.toString() :>> ", basketETH.toString());

      try {
        const overrides = {
          from: address,
          value: ethers.parseEther(basketETH.toString()),
        };
        const transaction = await contract.publicSaleMint(_quantity, overrides);
        await transaction.wait();
        setIsLoading(false);
        toast.success("You have just purchased an NFT !");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        setIsLoading(false);
        toast.error("Problems with your NFT purchase, please try again later");
      }
    }
  }

  async function gift(_to: string, _quantity: number) {
    if (provider && signer) {
      setIsLoading(true);
      const contract = new ethers.Contract(slug, Contract721.abi, signer);

      try {
        const overrides = {
          from: address,
        };
        const transaction = await contract.gift(_to, _quantity, overrides);
        await transaction.wait();
        setIsLoading(false);
        toast.success("You have just gifted an NFT !");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        setIsLoading(false);
        toast.error("Problems with your gift, please try again later");
      }
    }
  }

  console.log("data :>> ", data);
  if (isLoading) {
    return (
      <Container>
        <h1>Loading...</h1>
      </Container>
    );
  }
  if (data.length == 0) {
    return (
      <Container>
        <h1>Not Found ☹️</h1>
        <Typography>This collection doesn't exist</Typography>
      </Container>
    );
  } else {
    if (!data.isPaused) {
      return (
        <Container>
          <h1>Contract {data.name} in Pause</h1>
          <Typography>
            Please wait for the owner to change the state of the contract
          </Typography>
        </Container>
      );
    }
    return (
      <Container>
        {!isConnected ? (
          <h1>Please connect your wallet</h1>
        ) : (
          <>
            <h1>{data.name}</h1>

            <Typography>
              Supply: {data.totalSupply}/{data.maxSupply}
            </Typography>

            {/* <div className="flex flex-col items-center justify-center mb-12">
              <p className="text-xl mb-2">How many NFTs do you want ?</p>

              <Counter
                counter={counterNFT}
                setCounter={setCounterNFT}
                start={1}
                limit={sellingStep === 1 ? 3 : 100}
              />

              <div className="flex items-center justify-center my-12">
                <p className="text-base mr-8">
                  Price : {counterNFT * publicSalePrice} USDT or {basketETH} ETH
                </p>
                <Button
                  onClick={() => publicSaleMint(counterNFT)}
                  label={isLoading ? "Loading..." : "PUBLIC MINT ETH"}
                  disabled={isLoading ? true : false}
                />
              </div>
            </div> */}

            {/* ADMIN */}
            {address && owner === address && (
              <>
                <p className="text-2xl text-red-500 my-12">ADMIN</p>

                <div className="flex items-center justify-center mb-12">
                  <input
                    placeholder="Address"
                    onChange={(e) => setGiftAddress(e.target.value)}
                    className="relative block overflow-hidden rounded-lg border border-gray-200 px-3 py-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  />

                  <Counter
                    counter={counterGift}
                    setCounter={setCounterGift}
                    start={1}
                    limit={100}
                  />

                  <Button
                    onClick={() => gift(giftAddress, counterGift)}
                    label={isLoading ? "Loading..." : "GIFT"}
                    disabled={isLoading ? true : false}
                  />
                </div>

                {/* <div className="flex items-center justify-center mb-12">
              <input
                placeholder="Merkle Root"
                onChange={(e) => setNewMerkleRoot(e.target.value)}
                className="relative block overflow-hidden rounded-lg border border-gray-200 px-3 py-3 mr-8 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              />

              <Button
                onClick={() => setMerkleRoot(newMerkleRoot)}
                label={isLoading ? "Loading..." : "SET MERKLEROOT"}
                disabled={isLoading ? true : false}
              />
            </div> */}
              </>
            )}
            {/* FIN ADMIN */}
          </>
        )}
      </Container>
    );
  }
};

export default NFTCollection;
