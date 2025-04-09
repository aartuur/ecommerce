import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookies from "js-cookie"
import base64 from "base-64"

const Registrati = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:14577/auth/registrati", formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({ username: "", email: "", password: "" });
        
        const cookieData = base64.encode(JSON.stringify(response.data.data))
        cookies.set("SSDT",cookieData)     // seSSion DaTa
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante la registrazione.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", }}>
        <Typography variant="h4" gutterBottom>
          Registrati
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Registrazione avvenuta con successo!</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Registrati
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Registrati;