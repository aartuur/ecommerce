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
import Exit from "@mui/icons-material/ExitToAppOutlined"
import Cart from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu";
import Add from "@mui/icons-material/AddCircleOutline"
import { Link } from "react-router-dom";
import base64 from "base-64"
import Cookies from "js-cookie";
import { getCookieData } from "../App";
import ChatIcon from "@mui/icons-material/ChatOutlined"
export const ProfilePic = ({ size = 32, googleAvatar, normalAvatar, fontSize = 16 }) => {

  return (
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
};
const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLogged = Boolean(Cookies.get("SSDT"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("SSDT");
    window.location.reload();
  };

  const sessionCookie = isLogged && getCookieData(Cookies.get("SSDT"))
  const myId = sessionCookie?.id

  const googleAvatar = sessionCookie?.picture
  const normalAvatar = sessionCookie?.username?.slice(0, 2)?.toUpperCase()

  return (
    <AppBar position="static" color="primary" sx={{ color: "rgb(255, 255, 255)", background: "rgb(108, 145, 212)", width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white" }}>
          MyLogo
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isLogged ? (
              <>
                <Button color="inherit" component={Link} to="/carrello">
                  <Cart sx={{ mr: 1, scale: 0.8 }} /> Carrello
                </Button>
                <Button color="inherit" component={Link} to="/aggiungi-prodotto">
                  <Add sx={{ mr: 1, scale: 0.8 }} /> Prodotto
                </Button>
                <Button color="inherit" component={Link} to="/messaggi">
                  <ChatIcon sx={{ mr: 1 }} /> Messaggi
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  <Exit sx={{ mr: 1 }} /> Logout
                </Button>
                <Button component={Link} to={`/profile/${myId}`}>
                  <ProfilePic size={40} googleAvatar={googleAvatar} normalAvatar={normalAvatar} />
                </Button>
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
        )}

        {isMobile && (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {isLogged ? (
                <Box>
                  <MenuItem component={Link} to="/messaggi" onClick={handleMenuClose}>
                    <Button>
                      <ChatIcon sx={{ mr: 1 }} /> Messaggi
                    </Button>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Button>
                      <Exit sx={{ mr: 1 }} /> Logout
                    </Button>
                  </MenuItem>
                  <MenuItem component={Link} to="/carrello" onClick={handleMenuClose}>
                    <Button>
                      <Cart sx={{ mr: 1 }} /> Carrello
                    </Button>
                  </MenuItem>
                  <MenuItem component={Link} to={`/profile/${myId}`} onClick={handleMenuClose}>
                    <Button color="blue">
                      <ProfilePic size={28} googleAvatar={googleAvatar} normalAvatar={normalAvatar} /> Profile
                    </Button>
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                    Login
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/registrati">
                    Registrati
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;