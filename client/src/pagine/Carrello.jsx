import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography,
    Box,
    Alert,
    Grid,
    Button,
    styled,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    Container,
} from "@mui/material";
import { getCookieData } from "../App";
import Cookies from "js-cookie";
import Prodotto from "../componenti/Prodotto"; 

const StyledButton = styled(Button)({
    position: "absolute",
    top: 8,
    right: 30,
    background: "red",
    color: "white",
    border: "none",
    "&:hover": {
        background: "rgb(196, 0, 0)",
    },
});

const Carrello = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    const user = Cookies.get("SSDT") && getCookieData(Cookies.get("SSDT"));
    const userId = user.id
    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                const response = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/cart/get-products?userId=${userId}`);

                if (!Array.isArray(response.data)) {
                    console.error("Unexpected API response format:", response.data);
                    setError("Risposta del server non valida.");
                    return;
                }

                setCartItems(response.data);
            } catch (err) {
                console.error("Error fetching cart products:", err);
                setError("Impossibile caricare i prodotti del carrello.");
            }
        };

        fetchCartProducts();
    }, [userId]);

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/cart/remove-from-cart`, {
                data: { productId, userId },
            });

            setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        } catch (err) {
            console.error("Error removing product from cart:", err);
            setError("Impossibile rimuovere il prodotto dal carrello.");
        }
    };

    const calculateTotalPrice = () => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + parseFloat(item.Prezzo) * item.quantity,
            0
        );
        const fees = subtotal * 0.04; 
        const total = subtotal + fees;
        return { subtotal, fees, total };
    };

    const { subtotal, fees, total } = calculateTotalPrice();

    return (
        <Container >
            <Box mt={10}>
                <Typography variant="h4" color="white">Carrello di {user.username}</Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {Array.isArray(cartItems) && cartItems.length > 0 ? (
                    <>
                        <Grid container spacing={2}>
                            {cartItems.map((prodottoDaApi) => (
                                <Grid item xs={12} sm={6} md={4} key={prodottoDaApi.id}>
                                    <Box position="relative">
                                        <Prodotto prodotto={prodottoDaApi} />

                                        <StyledButton
                                            onClick={() => handleRemoveFromCart(prodottoDaApi.id)}
                                        >
                                            Rimuovi
                                        </StyledButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Paper elevation={3} sx={{ mt: 4, p: 3, background: "rgba(255,255,255,.8)" }}>
                            <Typography variant="h6" gutterBottom>
                                Dettagli Ordine
                            </Typography>

                            <List>
                                {cartItems.map((item) => (
                                    <ListItem key={item.id} disablePadding>
                                        <ListItemText
                                            primary={`${item.Nome} x${item.quantity}`}
                                            secondary={`€${parseFloat(item.Prezzo).toFixed(2)} ciascuno`}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                            €{(parseFloat(item.Prezzo) * item.quantity).toFixed(2)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1">Subtotale:</Typography>
                                <Typography variant="body1">€{subtotal.toFixed(2)}</Typography>
                            </Box>

                            <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1">Fees (4%):</Typography>
                                <Typography variant="body1">€{fees.toFixed(2)}</Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6">Totale:</Typography>
                                <Typography variant="h6">€{total.toFixed(2)}</Typography>
                            </Box>
                        </Paper>
                    </>
                ) : (
                    <Box textAlign="center">
                        <Typography variant="body1" color="text.secondary">
                            Il tuo carrello è vuoto.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Carrello;