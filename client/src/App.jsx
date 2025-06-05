import React, { useState, useEffect } from "react";
import Navbar from "./componenti/Navbar";
import {
  Box,
  Container,
  Divider,
  Typography,
  Grid,
  CircularProgress,
  Backdrop,
  Button,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Prodotto from "./componenti/Prodotto";
import Section from "./componenti/Section";
import Cookies from "js-cookie";
import base64 from "base-64";
import ContactUs from "./componenti/ContactUs";
import { Link } from "react-router-dom";
import FadeInOnView from "./componenti/FadeInOnView";

export const getCookieData = (cookie) =>
  cookie ? JSON.parse(base64.decode(cookie)) : "";

function App() {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionCookie = Cookies.get("SSDT");
  const isLogged = Boolean(sessionCookie);

  useEffect(() => {
    const fetchProdotti = async () => {
      try {
        const limite = 6;
        const response = await axios.get(
          `http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/product/get-prods/${limite}`
        );
        setProdotti(response.data.prodotti);
      } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdotti();
  }, []);

  const handleLike = async (prodottoId) => {
    try {
      const username = isLogged && getCookieData(Cookies.get("SSDT"))?.username;

      if (!username) {
        console.error("Utente non autenticato.");
        return;
      }

      const response = await axios.post(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/product/add-like`, {
        prodottoId,
        username,
      });

      setProdotti((prevProdotti) =>
        prevProdotti.map((prodotto) =>
          prodotto.id === prodottoId
            ? { ...prodotto, nPreferiti: prodotto.nPreferiti + 1 }
            : prodotto
        )
      );
    } catch (error) {
      console.error("Errore durante l'aggiunta del like:", error);
    }
  };


  return (
    <>
      <Box width="100vw" mb={5}>
        {/* Componente Navbar */}
        <Navbar />

        {/* Componente Section */}
        <Section />

        {/* Loader Globale */}
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={loading}
        >
          <CircularProgress color="primary" size={80} thickness={4} />
        </Backdrop>

        {/* Contenuto Principale */}
        {isLogged && (
          <Container sx={{ mt: 10 }} name="prodotti-section">
            <Typography variant="h3" sx={{ my: 4, color: "white", fontWeight: "bold" }}>
              Prodotti per te
            </Typography>

            <Grid container spacing={3}>
              {prodotti.map((prodotto, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={prodotto.id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <FadeInOnView delay={index * 0.1} yOffset={50}>
                    <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: "450px", md: "335px" } }}>
                      <Prodotto prodotto={prodotto} onLike={handleLike} />
                    </Box>
                  </FadeInOnView>
                </Grid>
              ))}

            </Grid>

            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Button variant="outlined" component={Link} to="/prodotti">
                Vedi tutti
              </Button>
            </Box>
          </Container>
        )}
        <Divider />
      </Box>

      {/* CONTATTACI */}
      <ContactUs name="contact-us-section" />
    </>
  );
}

export default App;