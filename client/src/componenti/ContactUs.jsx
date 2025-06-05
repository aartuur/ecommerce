import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/material/styles";

const ContactSection = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: theme.spacing(6, 2),
  color: "#fff",
  borderRadius: theme.spacing(2),
}));

const ContactForm = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "#3d85c6",
    },
    "&:hover fieldset": {
      borderColor: "#337ab7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#337ab7",
    },
  },
  "& label.Mui-focused": {
    color: "#337ab7",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3d85c6",
  color: "#fff",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "16px",
  padding: "12px 24px",
  "&:hover": {
    backgroundColor: "#337ab7",
  },
}));

function ContactUs({ name }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <ContactSection name={name}>
      <Grid
        container
        spacing={4}
        alignItems="flex-start"
        justifyContent="center"
      >
        {/* Form */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Segnala un problema
          </Typography>
          <form onSubmit={handleSubmit}>
            <ContactForm>
              <StyledTextField
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <StyledTextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <StyledTextField
                label="Messaggio"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
              <StyledButton type="submit" variant="contained" fullWidth>
                Invia
              </StyledButton>
            </ContactForm>
          </form>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Contattaci!
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: "#3d85c6", color: "#fff" }}>
                  <EmailIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary="support@example.com" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: "#3d85c6", color: "#fff" }}>
                  <PhoneIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary="+1 123-456-7890" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: "#3d85c6", color: "#fff" }}>
                  <LocationOnIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary="123 Main Street, City, Country" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </ContactSection>
  );
}

export default ContactUs;
