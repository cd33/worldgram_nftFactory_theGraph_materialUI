import { useEffect, useState } from "react";
import axios from "axios";
import { getUserResponsesQuery } from "../context/queries";
import { useAccount } from "wagmi";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const MyNFTs = () => {
  const [infos, setInfos] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const loadUserInfos = async () => {
      setIsLoading(true);
      const endpoint = import.meta.env.VITE_GRAPH_QL_API;
      let response = await axios.post(
        endpoint!,
        getUserResponsesQuery(address)
      );

      if (response.data.data && response.data.data.users[0]) {
        response = JSON.parse(
          JSON.stringify(response.data.data.users[0].nftOwned)
        );
        setInfos(response);
      }
      setIsLoading(false);
    };

    address && loadUserInfos();
  }, [address]);

  if (!isConnected) {
    return <h1>Please connect your wallet</h1>;
  }
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
            My NFTs
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {infos.length === 0 && (
            <Container>
              <Typography variant="h4" align="center">
                You do not yet have an NFT
              </Typography>
            </Container>
          )}
          {infos &&
            infos.map((contract: any) => (
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
                      {contract.contract.name}
                    </Typography>
                    <Typography>ID#{contract.nftId}</Typography>
                    {/* <Typography>
                      Address: {contract.contract.address.substring(0, 20)}...
                    </Typography> */}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Link to={`/collection/${contract.contract.address}`}>
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
};

export default MyNFTs;
