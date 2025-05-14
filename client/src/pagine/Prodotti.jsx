import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Box, useMediaQuery } from '@mui/material';
import Prodotto from '../componenti/Prodotto';

const Prodotti = () => {
  const [prods, setProds] = useState(null);

  // Query media per rilevare dispositivi mobili
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const getprods = async () => {
      try {
        const res = await axios.get("http://localhost:14577/product/get-prods");
        setProds(res.data);
      } catch (err) {
        console.error(err);
        setProds([]);
      }
    };

    getprods();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 10 }}>
      <Typography variant="h4" align="start" gutterBottom color='white' fontWeight="bolder">
        Tutti i prodotti
      </Typography>

      {prods === null ? (
        <Typography variant="h6" align="center">
          Caricamento in corso...
        </Typography>
      ) : prods.length === 0 ? (
        <Typography variant="h5" align="center">
          Nessun prodotto disponibile
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {prods.map((prod, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                width: isMobile ? '100%' : 'auto', // Forza 100% su mobile
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Prodotto prodotto={prod} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Prodotti;