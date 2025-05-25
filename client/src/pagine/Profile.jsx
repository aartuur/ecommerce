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
  const [userData, setUserData] = useState(null); // Dati dell'utente specifico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Stato per seguire/smettere di seguire
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [openFollowersPopup, setOpenFollowersPopup] = useState(false);
  const [openFollowingPopup, setOpenFollowingPopup] = useState(false);

  // Funzione per ottenere l'ID utente dall'URL
  function getIdUtenteFromUrl() {
    try {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const pathSegments = url.pathname.split("/").filter(segment => segment);

      if (pathSegments[0] === "profile" && pathSegments[1]) {
        return pathSegments[1]; // Restituisce l'ID utente (numerico o UUID)
      }

      return null;
    } catch (error) {
      console.error("Errore durante l'estrazione dell'ID utente:", error);
      return null;
    }
  }

  const userId = getIdUtenteFromUrl(); 

  useEffect(() => {
    window.scrollTo(0,0)
    let isMounted = true; 

    const fetchUserData = async () => {
      try {
        if (!userId) {
          setError("ID utente non trovato nell'URL.");
          setLoading(false);
          return;
        }

        // Recupera i dati dell'utente specifico
        const userResponse = await axios.get(`http://localhost:14577/user/getUserById?userId=${userId}`);
        if (isMounted) {
          setUserData(userResponse.data);
        }

        // Verifica se l'utente loggato segue già l'utente visualizzato
        const followStatusResponse = await axios.get(`http://localhost:14577/user/isFollowing`, {
          params: { followerId: sessionUserData.id, followedId: userId },
        });
        if (isMounted) {
          setIsFollowing(followStatusResponse.data.isFollowing);
        }

        // Recupera i followers
        const followersResponse = await axios.get(`http://localhost:14577/user/followers`, {
          params: { userId },
        });
        if (isMounted) {
          setFollowers(followersResponse.data.followers);
        }

        // Recupera gli utenti seguiti
        const followingResponse = await axios.get(`http://localhost:14577/user/following`, {
          params: { userId },
        });
        if (isMounted) {
          setFollowing(followingResponse.data.following);
        }

        // Recupera i prodotti pubblicati dall'utente
        const responseProdottiPubblicati = await axios.get(`http://localhost:14577/product/get-prods-by-user`, {
          params: { userId },
        });

        // Recupera i prodotti preferiti dall'utente
        const responseProdottiPreferiti = await axios.get(`http://localhost:14577/user/preferiti`, {
          params: { userId },
        });

        // Aggiorna lo stato solo se il componente è ancora montato
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

    // Cleanup function per evitare aggiornamenti dello stato dopo che il componente è smontato
    return () => {
      isMounted = false;
    };
  }, [userId]); // Dipendenza solo su userId

  if (!sessionUserData) {
    navigate("/login");
    return null; // Evita il rendering se l'utente non è autenticato
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
        await axios.delete("http://localhost:14577/user/unfollow", {
          params: { followerId: sessionUserData.id, followedId: userId },
        });
        setIsFollowing(false);
      } else {
        await axios.post("http://localhost:14577/user/follow", {
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
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <ProfilePic googleAvatar={googleAvatar} normalAvatar={normalAvatar} size={175} fontSize={50} />

          <Box sx={{ flexGrow: 1 }} ml={4}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {userData?.username || "Guest"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.email || "Nessuna email disponibile"}
            </Typography>

            <Box sx={{ display: "flex", gap: 4, mb: 2, color: "black" }}>
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
              <Button
                variant="contained"
                color={isFollowing ? "secondary" : "primary"}
                onClick={handleFollow}
                sx={{ mt: 2 }}
              >
                {isFollowing ? "Segui già" : "Segui"}
              </Button>
            )}
            {!isMyself && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ChatIcon />}
                onClick={() => {
                  const roomId = base64.encode([sessionUserData?.id, userId].sort().join("_"));
                  navigate(`/chat/${roomId}`);
                }}
                sx={{ mt: 2, ml: 2 }}
              >
                Messaggio
              </Button>
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

        <Dialog
          open={openFollowersPopup}
          onClose={() => setOpenFollowersPopup(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: 400, 
              maxHeight: 600, 
              overflow: "hidden",
              "& .MuiDialogContent-root": {
                padding: 0, 
              },
            },
          }}
        >
          <DialogTitle>Followers</DialogTitle>
          <DialogContent>
            <InfiniteScroll
              dataLength={followers.length}
              next={() => { }}
              hasMore={true}
              loader={<LinearProgress />}
              scrollableTarget="scrollableDiv"
            >
              <List disablePadding>
                {followers.map((follower) => (
                  <ListItem
                    key={follower.id}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "start", py: 1.5, px: 2, cursor: "pointer" }}
                    onClick={() => navigate(`/profile/${follower.id}`)}
                  >
                    <Button
                      component="a"
                      href={`/profile/${follower.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: "none", mr: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          fontSize: "1.5rem",
                        }}
                      >
                        {follower.username?.slice(0, 2).toUpperCase()}
                      </Avatar>
                    </Button>

                    <ListItemText
                      primary={
                        <Button
                          component="a"
                          href={`/profile/${follower.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: "none" }}
                        >
                          {follower.username}
                        </Button>
                      }
                      secondary={follower.email}
                      sx={{ lineHeight: 1.5 }}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openFollowingPopup}
          onClose={() => setOpenFollowingPopup(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: 400, 
              maxHeight: 600, 
              overflow: "hidden",
              "& .MuiDialogContent-root": {
                padding: 0, 
              },
            },
          }}
        >
          <DialogTitle>Following</DialogTitle>
          <DialogContent>
            <InfiniteScroll
              dataLength={following.length}
              next={() => { }}
              hasMore={true}
              loader={<LinearProgress />}
              scrollableTarget="scrollableDiv"
            >
              <List disablePadding>
                {following.map((followed) => (
                  <ListItem
                    key={followed.id}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "start", py: 1.5, px: 2, cursor: "pointer" }}
                    onClick={() => navigate(`/profile/${followed.id}`)}
                  >
                    <Button
                      component="a"
                      href={`/profile/${followed.id}`}
                      rel="noopener noreferrer"
                      sx={{ textDecoration: "none", mr: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          fontSize: "1.5rem",
                        }}
                      >
                        {followed.username?.slice(0, 2).toUpperCase()}
                      </Avatar>
                    </Button>

                    <ListItemText
                      primary={
                        <Button
                          component="a"
                          href={`/profile/${followed.id}`}
                          rel="noopener noreferrer"
                          sx={{ textDecoration: "none" }}
                        >
                          {followed.username}
                        </Button>
                      }
                      secondary={followed.email}
                      sx={{ lineHeight: 1.5 }}
                    />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile;