import * as React from "react";
import useEthersProvider from "../context/useEthersProvider";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Outlet, Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

const pages = [
  { name: "Collections", path: "/" },
  { name: "My NFTs", path: "/mynfts" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { owner } = useEthersProvider();
  const { address } = useAccount();

  if (address === owner && pages.length === 2) {
    pages.push({ name: "Admin", path: "/admin" });
  }

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              href="/"
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link key={page.name} to={page.path}>
                  <Button
                    // onClick={handleCloseNavMenu}
                    sx={{ mr: 3, color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
            </Box>

            <ConnectButton />
          </Toolbar>
        </Container>
      </AppBar>
      
      <div style={{minHeight: "100vh"}}>
        <Outlet />
      </div>

      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright © "}
          <Link
            style={{ color: "rgb(0 0 0 / 80%)" }}
            to="https://github.com/cd33"
          >
            cd33
          </Link>
          {" 2023."}
        </Typography>
      </Box>
    </>
  );
}
export default ResponsiveAppBar;
