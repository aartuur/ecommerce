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
import Cart from "@mui/icons-material/AddShoppingCartOutlined"
import base64 from "base-64";
import Cookies from "js-cookie";
import AddCart from "@mui/icons-material/AddShoppingCartRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { red } from "@mui/material/colors";
import axios from "axios";
import { Link } from "react-router-dom";
import { getCookieData } from "../App";
import Comments from "@mui/icons-material/CommentOutlined"
import { ProfilePic } from "./Navbar";

const Prodotto = ({ prodotto, onLike }) => {
  const {
    id,
    Nome,
    Descrizione,
    Prezzo,
    Commenti,
    pubblicatoDa,
    nPreferiti,
    imageId,
  } = prodotto;

  const [immagine, setImmagine] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const sessionCookieData = getCookieData(Cookies.get("SSDT"));

  console.log(prodotto)
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

  const handleOpenModal = async () => {
    setOpenModal(true);

    try {
      const response = await axios.get(`http://localhost:14577/comment/get-comments?productId=${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Errore durante il recupero dei commenti:", error);
      alert("Impossibile caricare i commenti. Riprova più tardi.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    axios
      .post("http://localhost:14577/comment/add", {
        productId: id,
        senderId: sessionCookieData.id,
        text: newComment,
      })
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment("");
      })
      .catch((error) => console.error("Errore durante l'invio del commento:", error));
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post("http://localhost:14577/cart/add-to-cart", {
        productId,
        cartedFrom: sessionCookieData.id, // Logged-in user ID
        quantity: 1, // Default quantity
      });
    } catch (error) {
      console.error("Errore durante l'aggiunta al carrello:", error);
    }
  };

  const googleAvatar = pubblicatoDa?.picture && pubblicatoDa.picture;
  const avatar = pubblicatoDa?.username?.slice(0, 2)?.toUpperCase();

  return (
    <Card
      sx={{

        margin: "20px",
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
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
          <ProfilePic googleAvatar={googleAvatar} normalAvatar={avatar} />
          <Typography
            variant="h7"
            color="text.secondary"
            sx={{ fontWeight: "bold", ml: 1.5 }}
            component={Link}
            to={`/profile/${pubblicatoDa?.id}`}
          >
            {pubblicatoDa?.username || "Guest"}
          </Typography>
        </Box>

        {/* Preferiti */}
        <Box>
          <IconButton
            aria-label="add to favorites"
            size="small"
            onClick={handleAggiungiAiPreferiti}
          >
            <FavoriteIcon fontSize="small" sx={{ color: red[500] }} />
          </IconButton>
          <Typography variant="caption">{nPreferiti}</Typography>
        </Box>
      </Box>

      {/* Immagine del Prodotto */}
      <CardMedia
        component="img"
        height="200"
        width="100%" // Ensure full width
        image={immagine || "https://via.placeholder.com/345x200"} // Fallback if image is not available
        alt={Nome}
        sx={{
          objectFit: "cover", // Ensures image fills container without distortion
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

      {/* Contenuto del Prodotto */}
      <CardContent
        sx={{
          flexGrow: 1, // Take up remaining space
          padding: 2,
          overflow: "hidden", // Prevent overflowing content from breaking the layout
        }}
      >
        {/* Nome del Prodotto */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 600, color: "#333" }}
        >
          {Nome}
        </Typography>

        {/* Descrizione del Prodotto */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            maxHeight: "100px", // Limit the height of the description
            overflowY: "auto", // Enable scrolling if content exceeds height
          }}
        >
          {Descrizione}
        </Typography>

        {/* Prezzo */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#0d47a1" }}
          >
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
        {/* Carrello Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            flex: 1,
            height: 40,
            minWidth: 120,
            whiteSpace: "nowrap",
            fontSize: 14,
            padding: "8px 16px",
          }}
          onClick={() => handleAddToCart(id)}
        >
          <Cart sx={{scale:.8,mr:.5}}/> Aggiungi
        </Button>

        {/* Commenti Button */}
        <Button
          variant="outlined"
          color="primary"
          sx={{
            flex: 0.75,
            height: 40, // Fixed height
            minWidth: 120, // Minimum width
            whiteSpace: "nowrap", // Prevent text wrapping
            fontSize: 14, // Consistent font size
            padding: "8px 16px", // Consistent padding
          }}
          onClick={handleOpenModal}
        >
          <Comments sx={{scale:.8,mr:.5}} /> commenti
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