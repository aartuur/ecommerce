import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import base64 from "base-64";
import { Container, Typography, List, ListItem, Divider, Box } from "@mui/material";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const sessionCookie = Cookies.get("SSDT");
  const sessionData = sessionCookie ? JSON.parse(base64.decode(sessionCookie)) : null;
  const userId = sessionData?.id;

  // Simuliamo un fetch delle chat (puoi sostituirlo con una chiamata API reale)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:14577/chat/list/${userId}`, {
          credentials: "include",
        });
        const data = await res.json();

        console.log(data);

        if (res.ok && Array.isArray(data.chats)) {
          setChats(data.chats);
        } else {
          console.error("Errore nel recupero delle chat:", data.message);
        }
      } catch (err) {
        console.error("Errore di rete:", err);
      }
    };

    if (userId) fetchChats();
  }, [userId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom color="white">
        Messaggi
      </Typography>
      {chats.length === 0 ? (
        <Typography>Nessuna chat disponibile.</Typography>
      ) : (
        <List>
          {chats.map((chat, index) => {
            // Verifica se ci sono dati validi
            if (!chat || !chat.partner || !chat.partner.id) {
              console.warn("Chat malformata:", chat);
              return null; // Salta le chat malformate
            }

            const { username } = chat.partner;
            const ultimoMessaggio = chat.ultimoMessaggio;
            const roomIdEncoded = chat.roomIdEncoded;

            return (
              <React.Fragment key={index}>
                <ListItem button component={Link} to={`/chat/${roomIdEncoded}`}>
                  <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Typography variant="subtitle1">
                      Chat con <strong>{username}</strong>
                    </Typography>
                    {ultimoMessaggio && (
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {ultimoMessaggio}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Container>
  );
};

export default ChatList;