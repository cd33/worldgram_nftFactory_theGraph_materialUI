import { useEffect, useState, useCallback } from "react";
import useEthersProvider from "../context/useEthersProvider";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import { FIRST5_QUESTIONS } from "../context/queries";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Home() {
  const [contracts, setContracts] = useState<any>([]);

  useEffect(() => {
    const loadContracts = async () => {
      const endpoint = import.meta.env.VITE_GRAPH_QL_API;
      let response = await axios.post(endpoint!, FIRST5_QUESTIONS);

      response = JSON.parse(JSON.stringify(response.data.data.nftcontracts));
      setContracts(response);
    };

    loadContracts();
  }, []);

  console.log("contracts :>> ", contracts);

  // const { owner } = useEthersProvider();
  // const { address, isConnected } = useAccount();
  // const provider = usePublicClient();

  // console.log('owner :>> ', owner);
  // console.log('address :>> ', address);
  // console.log('isConnected :>> ', isConnected);
  // console.log('provider :>> ', provider);
  // console.log('signer :>> ', signer);

  return (
    <main>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            NFT Collections
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Here are all the Worldgram NFT collections
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {contracts.map((contract: any) => (
            <Grid item key={contract.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    // 16:9
                    pt: "56.25%",
                  }}
                  image="https://source.unsplash.com/random?wallpapers"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {contract.name}
                  </Typography>
                  <Typography>
                    Address: {contract.address.substring(0, 20)}...
                  </Typography>
                  <Typography>Total Supply: {contract.totalSupply}</Typography>
                  <Typography>
                    {contract.isPaused
                      ? "Contract online"
                      : "Contract in pause"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button size="small">View Collection</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
    //   <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
    //     <Typography variant="h6" align="center" gutterBottom>
    //       Footer
    //     </Typography>
    //     <Typography
    //       variant="subtitle1"
    //       align="center"
    //       color="text.secondary"
    //       component="p"
    //     >
    //       Something here to give the footer a purpose!
    //     </Typography>
    //     <Typography variant="body2" color="text.secondary" align="center">
    //       {"Copyright © "}
    //       <Link color="inherit" href="https://mui.com/">
    //         Your Website
    //       </Link>{" "}
    //       {new Date().getFullYear()}
    //       {"."}
    //     </Typography>
    //   </Box>
  );
}
