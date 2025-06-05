import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { createConnection, getRepository } from "typeorm";
import http from "http";
import { Server } from "socket.io";
import base64 from "base-64";

// Routers
import authRouter from "./routers/auth.js";
import prodRouter from "./routers/prod.js";
import userRouter from "./routers/user.js";
import commentRouter from "./routers/comment.js";
import oauthRouter from "./routers/oauth.js";
import cartRouter from "./routers/cart.js";
import chatRouter from "./routers/chat.js";

// Models
import User from "./models/User.js";
import Prodotto from "./models/Prodotto.js";
import Image from "./models/Image.js";
import Preferito from "./models/Preferito.js";
import Follower from "./models/Follower.js";
import Commento from "./models/Commento.js";
import Carrello from "./models/Carrello.js";
import Messaggio from "./models/Messaggio.js";
import Room from "./models/Room.js";

// ============ CONFIG =================
dotenv.config();
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);

// ===== CORS SETUP (multi-origin safe) =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.43.61:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Socket.io CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ============ MIDDLEWARE =============
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// ============ ROUTES =============
app.use("/auth", authRouter);
app.use("/product", prodRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/oauth", oauthRouter);
app.use("/cart", cartRouter);
app.use("/chat", chatRouter);

// ============ DB =============
createConnection({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Prodotto, Image, Preferito, Follower, Commento, Carrello, Messaggio, Room],
}).then(() => console.log("[+] Connessione al DB stabilita."))
  .catch((error) => console.error("[!] Errore connessione DB:", error));

// ============ SOCKET.IO =============
io.on("connection", (socket) => {
  console.log(`[+] Client connesso: ${socket.id}`);

  socket.on("join-room", async (roomId) => {
    const roomRepo = getRepository(Room);
    const newRoom = roomRepo.create({ id: roomId });
    await roomRepo.save(newRoom);
    socket.join(roomId);
  });

  socket.on("send-message", async ({ roomId, mittenteId, destinatarioId, messaggio }) => {
    try {
      const decoded = base64.decode(roomId);
      const [id1, id2] = decoded.split("_");

      if (![id1, id2].includes(String(mittenteId)) || ![id1, id2].includes(String(destinatarioId))) {
        console.warn("[!] Inconsistenza tra roomId e utenti.");
        return;
      }

      const messaggioRepo = getRepository(Messaggio);
      const nuovoMessaggio = messaggioRepo.create({
        mittenteId,
        destinatarioId,
        contenuto: messaggio,
        dataInvio: new Date(),
        room: { id: roomId },
      });

      const messaggioSalvato = await messaggioRepo.save(nuovoMessaggio);
      io.to(roomId).emit("receive-message", { ...messaggioSalvato, roomId });

    } catch (err) {
      console.error("[!] Errore invio messaggio:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] Client disconnesso: ${socket.id}`);
  });
});

// ============ SERVER START ============
server.listen(PORT, () => {
  console.log(`[+] Server in ascolto su: http://localhost:${PORT}`);
});
