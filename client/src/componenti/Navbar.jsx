import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExitIcon from "@mui/icons-material/ExitToAppOutlined";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { getCookieData } from "../App";
import logo from "../assets/logo.png"; // ✅ Import del logo

export const ProfilePic = ({ size = 32, googleAvatar, normalAvatar, fontSize = 16 }) => (
  <Avatar
    src={googleAvatar}
    sx={{
      width: size,
      height: size,
      bgcolor: "rgba(19, 16, 16, 0.3)",
      color: "#fff",
      fontSize,
      cursor: "pointer",
    }}
  >
    {!googleAvatar && normalAvatar}
  </Avatar>
);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLogged = Boolean(Cookies.get("SSDT"));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    Cookies.remove("SSDT");
    window.location.reload();
  };

  const sessionCookie = isLogged && getCookieData(Cookies.get("SSDT"));
  const myId = sessionCookie?.id;
  const googleAvatar = sessionCookie?.picture;
  const normalAvatar = sessionCookie?.username?.slice(0, 2)?.toUpperCase();

  return (
    <AppBar
      position="fixed"
      sx={{
        color: "#fff",
        backgroundColor: "rgb(108, 145, 212)",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">
          <Box sx={{ background: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={logo} alt="Logo" style={{ height: 40 }} /></Box>
        </Link>
        {!isMobile ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isLogged ? (
              <>
                <Button color="inherit" component={Link} to="/carrello">
                  <CartIcon sx={{ mr: 1 }} /> Carrello
                </Button>
                <Button color="inherit" component={Link} to="/aggiungi-prodotto">
                  <AddIcon sx={{ mr: 1 }} /> Prodotto
                </Button>
                <Button color="inherit" component={Link} to="/messaggi">
                  <ChatIcon sx={{ mr: 1 }} /> Messaggi
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  <ExitIcon sx={{ mr: 1 }} /> Logout
                </Button>
                <IconButton component={Link} to={`/profile/${myId}`}>
                  <ProfilePic size={40} googleAvatar={googleAvatar} normalAvatar={normalAvatar} />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/registrati">
                  Registrati
                </Button>
              </>
            )}
          </Box>
        ) : (
          <>
            <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {isLogged ? (
                <>
                  <MenuItem component={Link} to="/messaggi" onClick={handleMenuClose}>
                    <ChatIcon sx={{ mr: 1 }} /> Messaggi
                  </MenuItem>
                  <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                    <ExitIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                  <MenuItem component={Link} to="/carrello" onClick={handleMenuClose}>
                    <CartIcon sx={{ mr: 1 }} /> Carrello
                  </MenuItem>
                  <MenuItem component={Link} to={`/profile/${myId}`} onClick={handleMenuClose}>
                    <ProfilePic size={28} googleAvatar={googleAvatar} normalAvatar={normalAvatar} />
                    <Typography sx={{ ml: 1 }}>Profilo</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={Link} to="/registrati" onClick={handleMenuClose}>
                    Registrati
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
