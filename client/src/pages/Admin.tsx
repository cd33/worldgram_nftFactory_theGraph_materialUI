import { useState } from "react";
import useEthersProvider from "../context/useEthersProvider";
import { useAccount, usePublicClient } from "wagmi";
import { ethers } from "ethers";
import ContractBase from "../context/WorldgramBase.json";
import { toast } from "react-toastify";
import { Button, Container, Input, Stack, Typography } from "@mui/material";
import { useEthersSigner } from "../context/useEthersSigner";

export default function Admin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { worldgramBase } = useEthersProvider();
  const { isConnected } = useAccount();
  const provider = usePublicClient();
  const signer = useEthersSigner();

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [baseURI, setBaseURI] = useState<string>("");
  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [publicSalePrice, setPublicSalePrice] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>("");

  async function newNFT() {
    if (provider && signer) {
      setIsLoading(true);
      const contract = new ethers.Contract(
        worldgramBase,
        ContractBase.abi,
        signer
      );

      try {
        const transaction = await contract.newNFT(
          name,
          symbol,
          baseURI,
          maxSupply,
          publicSalePrice,
          recipient
        );
        await transaction.wait();
        toast.success("You have just created an NFT Contract !");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(String(error));
        }
        toast.error("Problems with created an NFT Contract");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Container>
      {!isConnected ? (
        <h1>Please connect your wallet</h1>
      ) : (
        <>
          <Typography
            variant="h5"
            sx={{
              mt: "20px",
            }}
          >
            Create a NFT Contract
          </Typography>
          <Stack justifyContent="center" alignItems="center">
            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Symbol"
              onChange={(e) => setSymbol(e.target.value)}
            />

            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Base URI"
              onChange={(e) => setBaseURI(e.target.value)}
            />

            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Max Supply"
              onChange={(e) => setMaxSupply(Number(e.target.value))}
            />

            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Public Sale Price (in Wei)"
              onChange={(e) => setPublicSalePrice(Number(e.target.value))}
            />

            <Input
              sx={{
                mr: "10px",
                my: "10px",
              }}
              placeholder="Recipient Address"
              onChange={(e) => setRecipient(e.target.value)}
            />

            <Button
              sx={{
                my: "10px",
                border: "1px solid #0E76FD",
                "&:focus": {
                  outline: "unset",
                },
              }}
              onClick={newNFT}
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Loading..." : "CREATE CONTRACT"}
            </Button>
          </Stack>
        </>
      )}
    </Container>
  );
}
