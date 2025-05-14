import React, { useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import img from "../assets/bg.jpg";
import {Link as ScrollLink } from "react-scroll"

const Section = () => {
  const [state, setState] = useState("easter egg per voi fans che vi siete addirittura guardati il codice sorgente, perchè lo state facendo?!ahahah")
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
        scale: "115% 1",
        mt: 8
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ translate: "20px 0" }}>
        <Box sx={{ width: { xs: "100%", md: "50%" }, textAlign: "left" }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: "rgba(160, 193, 255, 0.7)" }}>
            Il social network di e-commerce
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "rgba(255,255,255,.7)", mt: 2 }}>
            Vendi qualsiasi tipo di cosa: da servizi a prodotti usati ad automobili o addirittura immobili. Connettiti con migliaia di utenti per scambiarvi informazioni sui vostri prodotti e formate una vera e propria <b>rete</b>
          </Typography>
          <Box sx={{ mt: 3 }}>
            <ScrollLink
              to="prodotti-section"
              smooth={true}
              duration={500}
              offset={-70}
              spy={true}
              activeClass="active"
            >
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Scopri di più
              </Button>
            </ScrollLink>

            <ScrollLink
              to="contact-us-section"
              smooth={true}
              duration={500}
              offset={-70}
              spy={true}
              activeClass="active"
            >
              <Button variant="outlined" color="primary">
                Contattaci
              </Button>
            </ScrollLink>
          </Box>
        </Box>

      </Box>
    </Container>
  );
};

export default Section;