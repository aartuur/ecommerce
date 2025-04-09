import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, Avatar, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { red } from "@mui/material/colors";

const Prodotto = ({ prodotto }) => {
  const { Nome, Descrizione, Prezzo, pubblicatoDa, Commenti, nPreferiti,image } = prodotto;

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      {/* Immagine del Prodotto */}
      <CardMedia
        component="img"
        height="194"
        image={image} // Sostituisci con l'immagine reale del prodotto
        alt={Nome}
        sx={{ objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      />

      {/* Contenuto del Prodotto */}
      <CardContent sx={{ padding: 2 }}>
        {/* Nome del Prodotto */}
        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 600, color: "#333" }}>
          {Nome}
        </Typography>

        {/* Descrizione del Prodotto */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {Descrizione}
        </Typography>

        {/* Prezzo */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d47a1" }}>
            €{Prezzo.toFixed(2)}
          </Typography>
        </Box>

        {/* Dettagli Aggiuntivi */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          {/* Pubblicato Da */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: red[500], width: 24, height: 24, mr: 1 }}>U</Avatar>
            <Typography variant="caption" color="text.secondary">
              Pubblicato da: {pubblicatoDa.nomeUtente || "Utente"}
            </Typography>
          </Box>

          {/* Preferiti */}
          <IconButton aria-label="add to favorites" size="small">
            <FavoriteIcon fontSize="small" sx={{ color: red[500] }} />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {nPreferiti} preferiti
            </Typography>
          </IconButton>
        </Box>

        {/* Commenti */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CommentIcon sx={{ mr: 1, color: "#0d47a1" }} />
          <Typography variant="caption" color="text.secondary">
            {Commenti.length} commenti
          </Typography>
        </Box>
      </CardContent>

      {/* Azioni */}
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: 2, borderTop: "1px solid #eee" }}>
        <Button variant="contained" color="primary" size="small">
          Aggiungi al carrello
        </Button>
        <Button variant="outlined" color="primary" size="small">
          Visualizza dettagli
        </Button>
      </Box>
    </Card>
  );
};

export default Prodotto;