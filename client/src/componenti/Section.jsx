import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import img from "../assets/bg.jpg"; // Assicurati di avere un'immagine valida

// Crea un tema personalizzato con palette di grigio scuro e azzurro
const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: "#0d47a1", // Azzurro scuro
    },
    secondary: {
      main: "#212121", // Grigio molto scuro
    },
    background: {
      default: "#f5f5f5", // Sfondo chiaro
    },
    text: {
      primary: "#333333", // Testo scuro
    },
  },
};

const Section = () => {
  return (
    <Container
      sx={{
        mt: 8,
        mb: 8,
        backgroundColor: "#f5f5f5",
        padding: "7rem",
        backgroundImage: `url(${img})`, 
        backgroundSize: "cover",
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        //background:"rgba(0,0,0,.2)",
        scale:"115% 1",
        mt:8
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{translate:"20px 0"}}>
        {/* Colonna Sinistra: Testo */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, textAlign: "left" }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: "rgba(160, 193, 255, 0.7)" }}>
            Il social network di e-commerce
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "rgba(255,255,255,.7)", mt: 2 }}>
            Vendi qualsiasi tipo di cosa: da servizi a prodotti usati ad automobili o addirittura immobili. Connettiti con migliaia di utenti per scambiarvi informazioni sui vostri prodotti e formate una vera e propria <b>rete</b>
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Scopri di più
            </Button>
            <Button variant="outlined" color="primary">
              Contattaci
            </Button>
          </Box>
        </Box>

        {/* Colonna Destra: Immagine (non necessaria, poiché l'immagine è già sfondo) */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, ml: { xs: 0, md: 4 } }}>
          {/* Questa colonna non serve più, ma puoi mantenerla vuota se desideri */}
        </Box>
      </Box>
    </Container>
  );
};

export default Section;