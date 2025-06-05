import React, { useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import img from "../assets/bg.jpg";
import { Link as ScrollLink } from "react-scroll";
import FadeInOnView from "./FadeInOnView";

const Section = () => {
  const [state, setState] = useState(
    "easter egg per voi fans che vi siete addirittura guardati il codice sorgente, perchè lo state facendo?!ahahah"
  );

  return (
    <FadeInOnView delay={0.2}>
      <Container
        maxWidth="xl"
        sx={{
          mt: 6,
          mb: 8,
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 6, sm: 8, md: 12 },
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: 3,
          height:"75vh",
          width:"100vw",
          translate:"-20px 0"
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ gap: { xs: 4, md: 0 }, textAlign: { xs: "center", md: "left" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "60%" } }}>
            <FadeInOnView delay={0.1} yOffset={50}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "rgba(160, 193, 255, 0.9)",
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                }}
                gutterBottom
              >
                Il social network di e-commerce
              </Typography>
            </FadeInOnView>

            <FadeInOnView delay={0.5} yOffset={50}>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  mt: 3,
                }}
                paragraph
              >
                Vendi qualsiasi tipo di cosa: da servizi a prodotti usati ad
                automobili o addirittura immobili. Connettiti con migliaia di
                utenti per scambiarvi informazioni sui vostri prodotti e
                formate una vera e propria <b>rete</b>.
              </Typography>
            </FadeInOnView>

            <Box
              sx={{
                mt: 5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <ScrollLink
                to="prodotti-section"
                smooth={true}
                duration={500}
                offset={-70}
                spy={true}
                activeClass="active"
              >
                <Button variant="contained" color="primary">
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
    </FadeInOnView>
  );
};

export default Section;
