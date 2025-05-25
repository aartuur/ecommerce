import express from "express";
import { getRepository } from "typeorm";
import base64 from "base-64";
import Messaggio from "../models/Messaggio.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

const chatRouter = express.Router();

chatRouter.get("/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const messaggioRepo = getRepository(Messaggio);
    const messaggi = await messaggioRepo.find({
      where: { room: { id: roomId } },
      order: { dataInvio: "ASC" },
    });

    res.json({ messaggi });
  } catch (error) {
    console.error("Errore nel recupero dei messaggi:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

chatRouter.post("/room", async (req, res) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2) {
    return res.status(400).json({ error: "userId1 e userId2 richiesti" });
  }

  try {
    const roomRepo = getRepository(Room);
    const userRepo = getRepository(User);

    const utente1 = await userRepo.findOne({ where: { id: userId1 } });
    const utente2 = await userRepo.findOne({ where: { id: userId2 } });

    if (!utente1 || !utente2) {
      return res.status(404).json({ error: "Utenti non trovati" });
    }

    const stanze = await roomRepo.find({ relations: ["membri"] });

    const roomEsistente = stanze.find((r) => {
      const membri = r.membri.map((m) => m.id).sort();
      return (
        membri.length === 2 &&
        membri.includes(userId1) &&
        membri.includes(userId2)
      );
    });

    if (roomEsistente) {
      return res.json({ room: roomEsistente });
    }

    const nuovaRoom = roomRepo.create({ membri: [utente1, utente2] });
    const roomSalvata = await roomRepo.save(nuovaRoom);

    res.status(201).json({ room: roomSalvata });
  } catch (error) {
    console.error("Errore creazione room:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

chatRouter.get("/list/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messaggioRepo = getRepository(Messaggio);
    const userRepo = getRepository(User);
    const utente = await userRepo.findOne({ where: { id: userId } });

    if (!utente) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const messaggi = await messaggioRepo.find({
      where: [{ mittenteId: userId }, { destinatarioId: userId }],
      relations: ["room"],
      order: { dataInvio: "DESC" },
    });

    if (messaggi.length === 0) {
      return res.json({ chats: [] });
    }

    const chatMap = new Map();

    for (const msg of messaggi) {
      const roomId = msg.room?.id;
      const decoded = base64.decode(roomId);
      const [id1, id2] = decoded.split("_");
      const partnerId = id1 === userId ? id2 : id1;

      if (chatMap.has(roomId)) {
        const existing = chatMap.get(roomId);
        const msgDate = new Date(msg.dataInvio);
        const existingDate = new Date(existing.dataUltimoMessaggio);

        if (msgDate > existingDate) {
          existing.ultimoMessaggio = msg.contenuto;
          existing.dataUltimoMessaggio = msg.dataInvio;
        }
        continue;
      }

      const partner = await userRepo.findOne({ where: { id: partnerId } });

      chatMap.set(roomId, {
        roomId,
        roomIdEncoded: roomId,
        partner: partner
          ? { id: partner.id, username: partner.username }
          : null,
        ultimoMessaggio: msg.contenuto,
        dataUltimoMessaggio: msg.dataInvio,
      });
    }

    const chatList = Array.from(chatMap.values());

    res.json({ chats: chatList });
  } catch (error) {
    console.error("Errore lista chat:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default chatRouter;
