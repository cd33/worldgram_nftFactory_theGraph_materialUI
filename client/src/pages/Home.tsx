import { useEffect, useState } from "react";
import axios from "axios";
import { NFT_CONTRACTS } from "../context/queries";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  const [contracts, setContracts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadContracts = async () => {
      setIsLoading(true);
      const endpoint = import.meta.env.VITE_GRAPH_QL_API;
      let response = await axios.post(endpoint!, NFT_CONTRACTS);

      response = JSON.parse(JSON.stringify(response.data.data.nftcontracts));
      setContracts(response);
      setIsLoading(false);
    };

    loadContracts();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <h1>Loading...</h1>
      </Container>
    );
  }
  return (
    <main>
      <Box
        sx={{
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
                      ? "Contract in pause"
                      : "Contract online"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Link to={`/collection/${contract.address}`}>
                    <Button size="small">View Collection</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
