import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import base64 from "base-64";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6200ea", // Viola acceso per i pulsanti
    },
    secondary: {
      main: "#03dac6", // Verde chiaro per gli accenti
    },
    background: {
      default: "#121212", // Sfondo scuro
      paper: "#1e1e1e", // Carta scura
    },
    text: {
      primary: "#ffffff", // Testo chiaro
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "1px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "1px",
        },
      },
    },
  },
});

const Registrati = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/oauth/callback`, {
        tokenId: credentialResponse.credential,
      });

      if (res.data.success) {
        const cookieData = base64.encode(JSON.stringify({ ...res.data.user, }));
        Cookies.set("SSDT", cookieData);
        navigate("/");
      } else {
        setError("Errore durante l'autenticazione con Google.");
      }
    } catch (err) {
      console.error("Errore durante il login con Google:", err);
      setError("Errore interno del server.");
    }
  };

  const handleGoogleFailure = () => {
    setError("Errore durante l'autenticazione con Google.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true); 

    try {
      const response = await axios.post(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/auth/registrati`, formData);

      if (response.status === 201) {
        const cookieData = base64.encode(
          JSON.stringify({ ...response?.data?.data, avatar: response?.data?.data?.username?.slice(0, 2) })
        );
        Cookies.set("SSDT", cookieData); 

        setSuccess(true);
        setFormData({ username: "", email: "", password: "" })
        setTimeout(() => {
          navigate("/");
        }, 1000); 
      }
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      setError(err.response?.data?.error || "Errore durante la registrazione.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 6,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
            Registrati
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Registrazione avvenuta con successo!</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                style: { borderRadius: "12px", backgroundColor: "#2e2e2e" },
              }}
              InputLabelProps={{
                style: { color: "#b0bec5" },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: { borderRadius: "12px", backgroundColor: "#2e2e2e" },
              }}
              InputLabelProps={{
                style: { color: "#b0bec5" },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                style: { borderRadius: "12px", backgroundColor: "#2e2e2e" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "secondary.main" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "#b0bec5" },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: "25px",
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "#3700b3",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Registrati"}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link href="/login" variant="body2" color="secondary.main" sx={{ textDecoration: "none" }}>
                Hai già un account? Accedi
              </Link>
            </Box>
            <GoogleOAuthProvider clientId="714603803383-29nq8c0fl34kvo93m63j33um0m6vq5h0.apps.googleusercontent.com">
              <Container maxWidth="sm">
                <Box sx={{ mt: 2 }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                  />
                </Box>
              </Container>
            </GoogleOAuthProvider>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Registrati