import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import base64 from "base-64";
import Cookies from "js-cookie";
import ImageIcon from "@mui/icons-material/Image";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";

const AggiungiProdotto = () => {
  const [formData, setFormData] = useState({
    Nome: "",
    Descrizione: "",
    Prezzo: "",
    image: null,
    pubblicatoDa: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const getCookieData = (cookie) => (cookie ? base64.decode(cookie) : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ssdt = JSON.parse(getCookieData(Cookies.get("SSDT")));
    const pubblicatoDa = Cookies.get("SSDT") ? ssdt.username : "guest";
    const profilePic = ssdt.picture ? ssdt.picture : false;

    const formDataToSend = new FormData();
    formDataToSend.append("Nome", formData.Nome);
    formDataToSend.append("Descrizione", formData.Descrizione);
    formDataToSend.append("Prezzo", formData.Prezzo);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("pubblicatoDa", pubblicatoDa);
    profilePic && formDataToSend.append("profilePic", profilePic);

    try {
      const response = await fetch(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/product/add-prod`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/")
      }
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiunta del prodotto");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0d47a1, #1e88e5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "#121212",
            color: "#fff",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#3f51b5" }}>
              Aggiungi un Nuovo Prodotto
            </Typography>
            <Typography variant="body2" color="gray">
              Inserisci i dettagli per vendere il tuo prodotto
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nome del Prodotto"
                  name="Nome"
                  value={formData.Nome}
                  onChange={handleChange}
                  required
                  variant="filled"
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{ style: { backgroundColor: "#1e1e1e", color: "#fff" } }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Prezzo (€)"
                  name="Prezzo"
                  value={formData.Prezzo}
                  onChange={handleChange}
                  type="number"
                  required
                  variant="filled"
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{ style: { backgroundColor: "#1e1e1e", color: "#fff" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrizione"
                  name="Descrizione"
                  value={formData.Descrizione}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="filled"
                  InputLabelProps={{ style: { color: "#90caf9" } }}
                  InputProps={{ style: { backgroundColor: "#1e1e1e", color: "#fff" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  onClick={() => document.getElementById("image-upload").click()}
                  sx={{
                    border: "2px dashed #00e676",
                    borderRadius: "16px",
                    height: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#1e1e1e",
                    flexDirection: "column",
                    width: "100%",
                    "&:hover": {
                      borderColor: "#69f0ae",
                    },
                  }}
                >
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      style={{ maxHeight: "100%", maxWidth: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: 40, color: "#90caf9" }} />
                      <Typography variant="body2" sx={{ color: "#90caf9", mt: 1 }}>
                        Seleziona un file
                      </Typography>
                    </>
                  )}
                </Box>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: "#1e88e5",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  Aggiungi Prodotto
                </Button>
              </Grid>
            </Grid>

          </form>
        </Paper>
      </Container>
    </Box >
  );
};

export default AggiungiProdotto;
