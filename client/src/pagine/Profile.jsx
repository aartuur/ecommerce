import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Divider,
  Grid,
  CircularProgress,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import Prodotto from "../componenti/Prodotto"; // Componente Prodotto già esistente
import { getCookieData } from "../App";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfilePic } from "../componenti/Navbar";
import ChatIcon from "@mui/icons-material/ChatOutlined"
import base64 from "base-64"

const Profile = () => {
  const navigate = useNavigate();
  const sessionCookie = Cookies.get("SSDT");
  const sessionUserData = sessionCookie ? JSON.parse(atob(sessionCookie)) : null;
  const [prodottiPubblicati, setProdottiPubblicati] = useState([]);
  const [prodottiPreferiti, setProdottiPreferiti] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [openFollowersPopup, setOpenFollowersPopup] = useState(false);
  const [openFollowingPopup, setOpenFollowingPopup] = useState(false);

  function getIdUtenteFromUrl() {
    try {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const pathSegments = url.pathname.split("/").filter(segment => segment);

      if (pathSegments[0] === "profile" && pathSegments[1]) {
        return pathSegments[1];
      }

      return null;
    } catch (error) {
      console.error("Errore durante l'estrazione dell'ID utente:", error);
      return null;
    }
  }

  const userId = getIdUtenteFromUrl();

  useEffect(() => {
    window.scrollTo(0, 0)
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        if (!userId) {
          setError("ID utente non trovato nell'URL.");
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/getUserById?userId=${userId}`);
        if (isMounted) {
          setUserData(userResponse.data);
        }

        const followStatusResponse = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/isFollowing`, {
          params: { followerId: sessionUserData.id, followedId: userId },
        });
        if (isMounted) {
          setIsFollowing(followStatusResponse.data.isFollowing);
        }

        const followersResponse = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/followers`, {
          params: { userId },
        });
        if (isMounted) {
          setFollowers(followersResponse.data.followers);
        }

        const followingResponse = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/following`, {
          params: { userId },
        });
        if (isMounted) {
          setFollowing(followingResponse.data.following);
        }

        const responseProdottiPubblicati = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/product/get-prods-by-user`, {
          params: { userId },
        });

        const responseProdottiPreferiti = await axios.get(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/preferiti`, {
          params: { userId },
        });

        if (isMounted) {
          setProdottiPubblicati(responseProdottiPubblicati.data.prodotti);
          setProdottiPreferiti(responseProdottiPreferiti.data.prodotti);
        }
      } catch (err) {
        console.error("Errore durante il recupero dei dati del profilo:", err);
        setError("Si è verificato un errore durante il recupero dei dati.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!sessionUserData) {
    navigate("/login");
    return null;
  }

  const myId = getCookieData(Cookies.get("SSDT")).id
  const isMyself = userId === myId

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" sx={{ textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/unfollow`, {
          params: { followerId: sessionUserData.id, followedId: userId },
        });
        setIsFollowing(false);
      } else {
        await axios.post(`http://${import.meta.env.VITE_SERVER_HOTSPOT_IP}/user/follow`, {
          followerId: sessionUserData.id,
          followedId: userId,
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Errore durante il follow/unfollow:", error);
    }
  };

  const googleAvatar = userData.picture && userData.picture
  const normalAvatar = !googleAvatar && userData.username.slice(0, 2).toUpperCase()

  return (
    <Box sx={{ py: 8, backgroundColor: "rgba(255,255,255,.4)", minHeight: "100vh", color: "rgba(255,255,255,.8)" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            mb: 4,
            gap: { xs: 3, md: 6 },
          }}
        >
          <ProfilePic
            googleAvatar={googleAvatar}
            normalAvatar={normalAvatar}
            size={150}
            fontSize={50}
            sx={{
              width: { xs: 300, md: 400 },
              height: { xs: 300, md: 400 },
              fontSize: { xs: 30, md: 50 },
            }}
          />

          <Box sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              {userData?.username || "Guest"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.email || "Nessuna email disponibile"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: { xs: 2, sm: 3, md: 4 },
                mb: 2,
                color: "black",
              }}
            >
              <Box sx={{ cursor: "pointer" }} onClick={() => setOpenFollowersPopup(true)}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {followers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }} onClick={() => setOpenFollowingPopup(true)}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {following.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
              </Box>
            </Box>

            {!isMyself && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="contained" color={isFollowing ? "secondary" : "primary"} onClick={handleFollow}>
                  {isFollowing ? "Segui già" : "Segui"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ChatIcon />}
                  onClick={() => {
                    const roomId = base64.encode([sessionUserData?.id, userId].sort().join("_"));
                    navigate(`/chat/${roomId}`);
                  }}
                >
                  Messaggio
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Prodotti Pubblicati
        </Typography>
        {prodottiPubblicati.length > 0 ? (
          <Grid container spacing={4}>
            {prodottiPubblicati.map((prodotto) => (
              <Grid item xs={12} sm={6} md={4} key={prodotto.id}>
                <Prodotto prodotto={prodotto} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            Nessun prodotto pubblicato.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Prodotti Preferiti
        </Typography>
        {prodottiPreferiti.length > 0 ? (
          <Grid container spacing={3}>
            {prodottiPreferiti.map((prodotto) => (
              <Grid item xs={12} sm={6} md={4} key={prodotto.id}>
                <Prodotto prodotto={prodotto} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            Nessun prodotto preferito.
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Profile;