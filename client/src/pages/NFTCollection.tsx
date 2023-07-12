import { useEffect, useState } from "react";
import axios from "axios";
import useEthersProvider from "../context/useEthersProvider";
import { useAccount, usePublicClient } from "wagmi";
import { ethers } from "ethers";
import Contract721 from "../context/NFT721.json";
import ContractBase from "../context/WorldgramBase.json";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getNftContractByAddress } from "../context/queries";
import { Button, Container, Input, Stack, Typography } from "@mui/material";
import Counter from "../components/Counter";
import { useEthersSigner } from "../context/useEthersSigner";

const NFTCollection = () => {
  const params = useParams();
  const slug = params.slug || "";
  const [data, setData] = useState<any>([]);
  const [isLoadingSubgraph, setIsLoadingSubgraph] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { owner, worldgramBase } = useEthersProvider();
  const { address, isConnected } = useAccount();
  const provider = usePublicClient();
  const signer = useEthersSigner();

  const [counterNFT, setCounterNFT] = useState<number>(1);
  const [counterGift, setCounterGift] = useState<number>(0);
  const [giftAddress, setGiftAddress] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      const endpoint = import.meta.env.VITE_GRAPH_QL_API;
      try {
        let response = await axios.post(
          endpoint!,
          getNftContractByAddress(slug)
        );

        if (response.data.data && response.data.data.nftcontracts[0]) {
          response = JSON.parse(
            JSON.stringify(response.data.data.nftcontracts[0])
          );
          setData(response);
        }
      } catch (err) {
        toast.error("Problems with subgraph");
      } finally {
        setIsLoadingSubgraph(false);
      }
    };

    loadUserData();
  }, [slug]);

  async function publicSaleMint() {
    if (provider && signer && counterNFT) {
      setIsLoading(true);
      const contract = new ethers.Contract(slug, Contract721.abi, signer);
      const value = counterNFT * data.publicSalePrice;

      try {
        const overrides = {
          from: address,
          value,
        };
        const transaction = await contract.publicSaleMint(
          counterNFT,
          overrides
        );
        await transaction.wait();
        toast.success("You have just purchased NFT !");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        toast.error("Problems with your NFT purchase");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function gift() {
    if (provider && signer) {
      setIsLoading(true);
      const contract = new ethers.Contract(
        worldgramBase,
        ContractBase.abi,
        signer
      );

      try {
        const transaction = await contract.gift(
          slug,
          giftAddress,
          counterGift
        );
        await transaction.wait();
        toast.success("You have just gifted an NFT !");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        toast.error("Problems with your gift");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function pause() {
    if (signer) {
      setIsLoading(true);
      const contract = new ethers.Contract(
        worldgramBase,
        ContractBase.abi,
        signer
      );

      try {
        const transaction = await contract.pause(slug);
        await transaction.wait();
        toast.success("The contract is in pause");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        toast.error("Problems with the contract");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function unpause() {
    if (signer) {
      setIsLoading(true);
      const contract = new ethers.Contract(
        worldgramBase,
        ContractBase.abi,
        signer
      );

      try {
        const transaction = await contract.unpause(slug);
        await transaction.wait();
        toast.success("The contract is online");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        toast.error("Problems with the contract");
      } finally {
        setIsLoading(false);
      }
    }
  }

  if (isLoadingSubgraph) {
    return (
      <Container>
        <h1>Loading...</h1>
      </Container>
    );
  }
  if (data.length === 0) {
    return (
      <Container>
        <h1>Not Found ☹️</h1>
        <Typography>This collection doesn't exist</Typography>
      </Container>
    );
  } else {
    return (
      <Container>
        {!isConnected ? (
          <h1>Please connect your wallet</h1>
        ) : (
          <>
            {data.isPaused ? (
              <>
                <h1>Contract {data.name} in Pause</h1>
                <Typography>
                  Please wait for the owner to change the state of the contract
                </Typography>
              </>
            ) : (
              <>
                <h1>{data.name}</h1>

                <Typography>
                  Supply: {data.totalSupply}/{data.maxSupply}
                </Typography>

                <Container maxWidth="sm">
                  <Typography
                    variant="h5"
                    sx={{
                      mt: "20px",
                    }}
                  >
                    Number of nfts desired
                  </Typography>
                  <Counter
                    setCounter={setCounterNFT}
                    sx={{
                      my: "10px",
                    }}
                  />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography
                      sx={{
                        mr: "20px",
                      }}
                    >
                      Price : {ethers.formatEther(counterNFT * Number(data.publicSalePrice))} ETH
                    </Typography>
                    <Button
                      sx={{
                        my: "10px",
                        border: "1px solid #0E76FD",
                        "&:focus": {
                          outline: "unset",
                        },
                      }}
                      onClick={publicSaleMint}
                      disabled={isLoading ? true : false}
                    >
                      {isLoading ? "Loading..." : "PUBLIC MINT ETH"}
                    </Button>
                  </Stack>
                </Container>
              </>
            )}
            {/* ADMIN */}
            {address && owner === address && (
              <Container
                maxWidth="sm"
                sx={{
                  mt: "50px",
                }}
              >
                <Typography variant="h2">ADMIN</Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: "20px",
                  }}
                >
                  GIFT
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }}>
                  <Input
                    sx={{
                      my: "10px",
                    }}
                    placeholder="Address"
                    onChange={(e) => setGiftAddress(e.target.value)}
                  />

                  <Counter
                    setCounter={setCounterGift}
                    sx={{
                      my: "10px",
                    }}
                  />

                  <Button
                    sx={{
                      my: "10px",
                      border: "1px solid #0E76FD",
                      "&:focus": {
                        outline: "unset",
                      },
                    }}
                    onClick={gift}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading ? "Loading..." : "GIFT"}
                  </Button>
                </Stack>

                <Typography
                  variant="h5"
                  sx={{
                    mt: "50px",
                  }}
                >
                  PAUSE & UNPAUSE
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>
                    The contract is {data.isPaused ? "in pause" : "online"}
                  </Typography>
                  <Button
                    sx={{
                      ml: "20px",
                      my: "10px",
                      border: "1px solid #0E76FD",
                      "&:focus": {
                        outline: "unset",
                      },
                    }}
                    onClick={data.isPaused ? unpause : pause}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading
                      ? "Loading..."
                      : data.isPaused
                      ? "UNPAUSE"
                      : "PAUSE"}
                  </Button>
                </Stack>
              </Container>
            )}
            {/* FIN ADMIN */}
          </>
        )}
      </Container>
    );
  }
};

export default NFTCollection;
