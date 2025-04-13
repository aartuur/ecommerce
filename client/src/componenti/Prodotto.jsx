import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Stack,
  Modal,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import AddCart from "@mui/icons-material/AddShoppingCartRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { red } from "@mui/material/colors";
import axios from "axios";
import { Link } from "react-router-dom";
import { getCookieData } from "../App";

const Prodotto = ({ prodotto, onLike }) => {
  const {
    id,
    Nome,
    Descrizione,
    Prezzo,
    Commenti,
    pubblicatoDa,
    pubblicatoDaId,
    nPreferiti,
    imageId,
  } = prodotto;

  const [immagine, setImmagine] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Stato per il popup
  const [comments, setComments] = useState([]); // Stato per i commenti
  const [newComment, setNewComment] = useState(""); // Stato per il nuovo commento

  const sessionCookieData = getCookieData(Cookies.get("SSDT"));

  // Effetto per caricare l'immagine
  useEffect(() => {
    if (imageId) {
      axios
        .get(`http://localhost:14577/product/get-image?imageId=${imageId}`, { responseType: "arraybuffer" })
        .then((response) => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setImmagine(`data:${response.headers["content-type"]};base64,${base64Image}`);
        })
        .catch((error) => console.error("Errore durante il recupero dell'immagine:", error));
    }
  }, [imageId]);

  const handleAggiungiAiPreferiti = () => {
    if (onLike) {
      onLike(id);
    }
  };

  const avatar = pubblicatoDa?.slice(0, 2).toUpperCase();

  // Funzione per aprire il popup e caricare i commenti
  const handleOpenModal = async () => {
    setOpenModal(true);

    try {
      const response = await axios.get(`http://localhost:14577/comment/get-comments?productId=${id}`);
      setComments(response.data); // Carica i commenti dal server
    } catch (error) {
      console.error("Errore durante il recupero dei commenti:", error);
      alert("Impossibile caricare i commenti. Riprova più tardi.");
    }
  };
  // Funzione per chiudere il popup
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Funzione per inviare un nuovo commento
  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    axios
      .post("http://localhost:14577/comment/add", {
        productId: id,
        senderId: sessionCookieData.id,
        text: newComment,
      })
      .then((response) => {
        setComments([...comments, response.data]); // Aggiorna la lista dei commenti
        setNewComment(""); // Resetta il campo di input
      })
      .catch((error) => console.error("Errore durante l'invio del commento:", error));
  };

  return (
    <Card sx={{ maxWidth: 345, margin: "20px", boxShadow: 3, borderRadius: 4 }}>
      {/* Header con autore e like */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* Pubblicato Da */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "rgba(0,0,130,.5)", width: 24, height: 24, mr: 1, p: 0.6 }}>
            {avatar}
          </Avatar>
          <Typography variant="h7" color="text.secondary" sx={{ fontWeight: "bold" }} component={Link} to={`/profile/${pubblicatoDaId}`}>
            {pubblicatoDa || "Guest"}
          </Typography>
        </Box>

        {/* Preferiti */}
        <Box>
          <IconButton aria-label="add to favorites" size="small" onClick={handleAggiungiAiPreferiti}>
            <FavoriteIcon fontSize="small" sx={{ color: red[500] }} />
          </IconButton>
          <Typography variant="caption">{nPreferiti}</Typography>
        </Box>
      </Box>

      {/* Immagine del Prodotto */}
      <CardMedia
        component="img"
        height="200"
        image={immagine || "https://via.placeholder.com/345x200"} // Fallback se l'immagine non è disponibile
        alt={Nome}
        sx={{
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
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
            €{parseFloat(Prezzo).toFixed(2)}
          </Typography>
        </Box>

      </CardContent>

      {/* Azioni */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: 2,
          borderTop: "1px solid #eee",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" color="primary" startIcon={<AddCart sx={{ scale: 0.8 }} />} sx={{ flex: 1 }}>
          Carrello
        </Button>
        <Button variant="outlined" color="primary" sx={{ flex: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleOpenModal}>
            <Typography variant="caption" color="text.secondary">
              Apri commenti
            </Typography>
          </Box>
        </Button>
      </Stack>

      {/* Popup per i commenti */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh",
            overflowY: "auto",
            padding: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Commenti per {Nome} ({comments?.length})
          </Typography>
          <List>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment?.user?.username?.slice(0, 2).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment?.user?.username}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {comment?.text}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Nessun commento disponibile.
              </Typography>
            )}
          </List>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Aggiungi un commento"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={2}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleAddComment}
            >
              Invia
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Card>
  );
};

export default Prodotto;