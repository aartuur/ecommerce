import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import base64 from "base-64";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [messaggi, setMessaggi] = useState([]);
  const [nuovoMessaggio, setNuovoMessaggio] = useState("");
  const [mittenteId, setMittenteId] = useState(null);
  const [destinatarioId, setDestinatarioId] = useState(null);
  const { roomId } = useParams();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sessionCookie = Cookies.get("SSDT");
  const sessionUserData = sessionCookie ? JSON.parse(atob(sessionCookie)) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!sessionUserData) return;

    const mittente = sessionUserData.id;
    setMittenteId(mittente);

    const decoded = base64.decode(roomId);
    const ids = decoded.split("_");
    const destinatario = ids.find((id) => id !== mittente.toString());
    setDestinatarioId(destinatario);

    const socket = io("http://localhost:14577", { withCredentials: true });
    socketRef.current = socket;
    socket.emit("join-room", roomId);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:14577/chat/messages/${roomId}`);
        const data = await res.json();
        setMessaggi(data.messaggi || []);
      } catch (err) {
        console.error("Errore nel recupero dei messaggi:", err);
      }
    };

    fetchMessages();

    const receiveHandler = (msg) => {
      setMessaggi((prev) => [...prev, msg]);
    };

    socket.on("receive-message", receiveHandler);

    return () => {
      socket.off("receive-message", receiveHandler);
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messaggi]); 

  const inviaMessaggio = () => {
    if (!nuovoMessaggio.trim()) return;

    const nuovo = {
      mittenteId,
      contenuto: nuovoMessaggio,
      dataInvio: new Date().toISOString(),
    };

    socketRef.current.emit("send-message", {
      mittenteId,
      destinatarioId,
      messaggio: nuovoMessaggio,
      roomId,
    });

    setNuovoMessaggio("");
  };

  if (!sessionUserData) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "md",
        margin: "0 auto",
        p: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Conversazione
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "#e5e5e5",
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messaggi.map((msg) => {
          const isMittente = msg.mittenteId === sessionUserData.id;

          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: isMittente ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor: isMittente ? "#1976d2" : "#ffffff",
                  color: isMittente ? "white" : "black",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "75%",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2">{msg.contenuto}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: isMittente ? "right" : "left",
                    mt: 0.5,
                  }}
                >
                  {new Date(msg.dataInvio).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}

        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "100%",
          pt: 1,
          mt:1,
          pb: 3,
          position: "sticky",
          bottom: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <TextField
          fullWidth
          label="Scrivi un messaggio"
          value={nuovoMessaggio}
          onChange={(e) => setNuovoMessaggio(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") inviaMessaggio();
          }}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={inviaMessaggio}>
          Invia
        </Button>
      </Box>
    </Box>
  );
}

  export default Chat;