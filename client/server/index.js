import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.js";
import { createConnection, getRepository } from "typeorm";
import User from "./models/User.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import prodRouter from "./routers/prod.js";
import Prodotto from "./models/Prodotto.js";
import Image from "./models/Image.js";
import Preferito from "./models/Preferito.js";
import userRouter from "./routers/user.js";
import Follower from "./models/Follower.js";
import commentRouter from "./routers/comment.js";
import Commento from "./models/Commento.js";
import oauthRouter from "./routers/oauth.js";
import cartRouter from "./routers/cart.js";
import Carrello from "./models/Carrello.js";
import base64 from "base-64"
import http from "http";
import { Server } from "socket.io";
import Messaggio from "./models/Messaggio.js";
import Room from "./models/Room.js";
import chatRouter from "./routers/chat.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 8080;

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

/* ========= ROUTERS =========== */
app.use("/auth", authRouter);
app.use("/product", prodRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/oauth", oauthRouter);
app.use("/cart", cartRouter);
app.use("/chat", chatRouter)

/* ========== CONNESSIONE AL DB ============= */
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
}).then(() => console.log("Connessione al database stabilita."))
  .catch((error) => console.log("Errore durante la connessione al database:", error));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// ================== SOCKET.IO ===================
io.on("connection", (socket) => {

  socket.on("join-room", async(roomId) => {
    const roomRepo = getRepository(Room)
    const newroom = roomRepo.create({id:roomId})

    await roomRepo.save(newroom)

    socket.join(roomId);
          
  });

  socket.on("send-message", async ({ roomId, mittenteId, destinatarioId, messaggio }) => {

    try {
      
      const decoded = base64.decode(roomId); // il room_id è passato come stringabase64([mittente_id,destinatario_id].sort())
      const [id1, id2] = decoded.split("_");

      if (![id1, id2].includes(String(mittenteId)) || ![id1, id2].includes(String(destinatarioId))) {
        console.warn("[!] Inconsistenza tra roomId e utenti del messaggio.");
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

      io.to(roomId).emit("receive-message", {
        ...messaggioSalvato,
        roomId,
      });
    } catch (err) {
      console.error("[!] Errore durante l'invio del messaggio:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] Client disconnesso (${socket.id})`);
  });
});

/* ================== AVVIO SERVER =================== */

server.listen(PORT, () => {
  console.log(`[+] Web server in ascolto a: http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("[!] Failed to start the server:", err.message);
});