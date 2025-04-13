import { useState, useEffect } from "react";
import Navbar from "./componenti/Navbar";
import { Box, Container, Divider, Typography, Grid } from "@mui/material";
import axios from "axios";
import Prodotto from "./componenti/Prodotto";
import Section from "./componenti/Section";
import Cookies from "js-cookie";
import base64 from "base-64";

export const getCookieData = (cookie) => (cookie ? JSON.parse(base64.decode(cookie)) : "");

function App() {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionCookie = Cookies.get("SSDT");
  const isLogged = Boolean(sessionCookie);

  // Funzione per decodificare i dati del cookie

  useEffect(() => {
    const fetchProdotti = async () => {
      try {
        const limite = 6;
        const response = await axios.get(`http://localhost:14577/product/get-prods/${limite}`);
        setProdotti(response.data.prodotti);
      } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchProdotti();
  }, []);

  // Funzione per gestire il like di un prodotto
  const handleLike = async (prodottoId) => {
    try {
      const username = isLogged && getCookieData(Cookies.get("SSDT"))?.username;

      if (!username) {
        console.error("Utente non autenticato.");
        return;
      }

      // Invia la richiesta al server per aggiungere il like
      const response = await axios.post("http://localhost:14577/product/add-like", {
        prodottoId,
        username,
      });


      // Aggiorna lo stato locale per riflettere il nuovo numero di preferiti
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
    <Box width="100vw">
      <Navbar />
      <Section />
      {isLogged && (
        <Container maxWidth="lg" sx={{mt:10}}>
          <Typography variant="h3" sx={{ my: 4,color:"white",fontWeight:"bold" }}>
            Prodotti per te
          </Typography>
          {loading ? (
            <Typography variant="body1">Caricamento...</Typography>
          ) : (
            <Grid container spacing={4}>
              {prodotti.map((prodotto) => (
                <Grid item xs={12} sm={6} md={4} key={prodotto.id}>
                  <Prodotto prodotto={prodotto} onLike={handleLike} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      )}
      <Divider />
    </Box>
  );
}

export default App;