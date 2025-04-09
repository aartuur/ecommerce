import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import base64 from "base-64"
import Cookies from "js-cookie"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const AggiungiProdotto = () => {
  const [formData, setFormData] = useState({
    Nome: "",
    Descrizione: "",
    Prezzo: "",
    image: null,
    pubblicatoDa: "",
  });

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
        image: file, // Memorizza il file selezionato
      }));
    }
  };

  const getCookieData = cookie => cookie ? base64.decode(cookie) : ""

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.parse(getCookieData(Cookies.get("SSDT"))))

    const pubblicatoDa = Cookies.get("SSDT") ? JSON.parse(getCookieData(Cookies.get("SSDT"))).username : "guest"

    const formDataToSend = new FormData();
    formDataToSend.append("Nome", formData.Nome);
    formDataToSend.append("Descrizione", formData.Descrizione);
    formDataToSend.append("Prezzo", formData.Prezzo);
    formDataToSend.append("image", formData.image); // Invia il file immagine
    formDataToSend.append("pubblicatoDa", pubblicatoDa);

    try {
      const response = await fetch("http://localhost:14577/product/add-prod", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Prodotto aggiunto con successo!");
      } else {
        alert(`Errore: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiunta del prodotto");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#0d47a1" }}>
            Aggiungi un Nuovo Prodotto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Inserisci i dettagli del prodotto qui sotto.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nome del Prodotto */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome del Prodotto"
                name="Nome"
                value={formData.Nome}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Descrizione del Prodotto */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrizione"
                name="Descrizione"
                value={formData.Descrizione}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Prezzo del Prodotto */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prezzo (€)"
                name="Prezzo"
                value={formData.Prezzo}
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
                }}
              />
            </Grid>

            {/* Upload Immagine */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<AddPhotoAlternateIcon />}
                sx={{ height: "40px" }}
              >
                Carica Immagine
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Immagine selezionata: {formData.image.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Pulsante di Invio */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Aggiungi Prodotto
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AggiungiProdotto;