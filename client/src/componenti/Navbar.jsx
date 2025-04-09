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
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import base64 from "base-64"
import Cookies from "js-cookie";

// Componente per la Foto Profilo
const ProfilePic = ({ size = 32 }) => {

  const encodedData = Cookies.get("SSDT");
  const data = encodedData ? JSON.parse(base64.decode(encodedData)) : "user"

  const initials = data.username.slice(0, 2).toUpperCase();

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: "rgba(255,255,255,.3)",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
      }}
    >
      {initials}
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

  return (
    <AppBar position="static" color="primary" sx={{ width: "100%", position: "fixed", top: 0, left: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white" }}>
          MyLogo
        </Typography>

        {/* Navigazione Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/home">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              Contact
            </Button>
            {isLogged ? (
              <>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
                <ProfilePic size={40} /> {/* Foto profilo */}
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

        {/* Menu Mobile */}
        {isMobile && (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose} component={Link} to="/home">
                Home
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/about">
                About
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/contact">
                Contact
              </MenuItem>
              {isLogged ? (
                <Box>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <MenuItem>
                    <ProfilePic size={32} /> {/* Foto profilo */}
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