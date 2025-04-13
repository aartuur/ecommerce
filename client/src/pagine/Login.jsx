import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
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

// Crea un tema scuro personalizzato
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Blu chiaro per i pulsanti
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
  },
});

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Mostra/Nascondi password
  const [loading, setLoading] = useState(false); // Stato di caricamento
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true); // Attiva lo stato di caricamento

    try {
      const response = await axios.post("http://localhost:14577/auth/login", formData);

      if (response.status === 200) {
        const cookieData = base64.encode(JSON.stringify({...response?.data?.data,avatar:response?.data?.data?.username?.slice(0,2)}))        
        Cookies.set("SSDT",cookieData)     // seSSion DaTa

        // Reindirizza alla home
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 500); // Ritardo per mostrare il messaggio di successo
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      setError(err.response?.data?.error || "Credenziali non valide.");
    } finally {
      setLoading(false); // Disattiva lo stato di caricamento
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
            Accedi
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Login avvenuto con successo!</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: { borderRadius: "10px", backgroundColor: "#2e2e2e" },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                style: { borderRadius: "10px", backgroundColor: "#2e2e2e" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "primary.main" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
                borderRadius: "20px",
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "#4fc3f7", // Cambia colore al passaggio del mouse
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Accedi"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;