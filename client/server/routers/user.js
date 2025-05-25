import express, { Router } from "express";
import { getRepository } from "typeorm";
import Preferito from "../models/Preferito.js";
import Prodotto from "../models/Prodotto.js";
import User from "../models/User.js";
import Follower from "../models/Follower.js";

const userRouter = Router();

userRouter.get("/preferiti", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "ID utente mancante." });
    }

    const preferitiRepo = getRepository(Preferito);
    const preferitiDaUtente = await preferitiRepo.find({
      where: { userId },
      relations: ["prodotto"],
    });

    if (!preferitiDaUtente?.length) {
      return res.status(404).json({
        msg: "Nessun prodotto preferito trovato per questo utente.",
      });
    }

    const userRepo = getRepository(User);
    const prodottiConUsername = await Promise.all(
      preferitiDaUtente.map(async ({ prodotto }) => {
        const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
        return {
          ...prodotto,
          pubblicatoDa: utente,
        };
      })
    );

    res.status(200).json({
      msg: "Prodotti preferiti recuperati con successo.",
      prodotti: prodottiConUsername,
    });
  } catch (error) {
    console.error("Errore durante il recupero dei preferiti:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

userRouter.get("/getUserById", async (req, res) => {
  const { userId } = req.query;
  const user = await getRepository(User).findOneBy({ id: userId });
  res.status(200).json(user);
});

userRouter.post("/follow", async (req, res) => {
  try {
    const { followerId, followedId } = req.body;

    if (!followerId || !followedId) {
      return res.status(400).json({ error: "Dati mancanti." });
    }

    const followerRepo = getRepository(Follower);
    const existingFollow = await followerRepo.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      return res.status(400).json({ error: "Stai già seguendo questo utente." });
    }

    const newFollow = followerRepo.create({ followerId, followedId });
    await followerRepo.save(newFollow);

    res.status(201).json({ msg: "Hai iniziato a seguire l'utente." });
  } catch (error) {
    console.error("Errore durante il follow:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

userRouter.delete("/unfollow", async (req, res) => {
  try {
    const { followerId, followedId } = req.query;

    if (!followerId || !followedId) {
      return res.status(400).json({ error: "Dati mancanti." });
    }

    const followerRepo = getRepository(Follower);
    const follow = await followerRepo.findOne({ where: { followerId, followedId } });

    if (!follow) {
      return res.status(404).json({ error: "Non stai seguendo questo utente." });
    }

    await followerRepo.remove(follow);
    res.status(200).json({ msg: "Hai smesso di seguire l'utente." });
  } catch (error) {
    console.error("Errore durante l'unfollow:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

userRouter.get("/followers", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "ID utente mancante." });
    }

    const followerRepo = getRepository(Follower);
    const followers = await followerRepo.find({
      where: { followedId: userId },
      relations: ["follower"],
    });

    const followerUsers = followers.map(({ follower }) => follower);

    res.status(200).json({
      msg: "Followers recuperati con successo.",
      followers: followerUsers,
    });
  } catch (error) {
    console.error("Errore durante il recupero dei followers:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

userRouter.get("/isFollowing", async (req, res) => {
  try {
    const { followerId, followedId } = req.query;

    if (!followerId || !followedId) {
      return res.status(400).json({ error: "Dati mancanti." });
    }

    const followerRepo = getRepository(Follower);
    const follow = await followerRepo.findOne({ where: { followerId, followedId } });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Errore durante la verifica del follow:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

userRouter.get("/following", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "ID utente mancante." });
    }

    const followerRepo = getRepository(Follower);
    const following = await followerRepo.find({
      where: { followerId: userId },
      relations: ["followed"],
    });

    const followedUsers = following.map(({ followed }) => followed);

    res.status(200).json({
      msg: "Utenti seguiti recuperati con successo.",
      following: followedUsers,
    });
  } catch (error) {
    console.error("Errore durante il recupero degli utenti seguiti:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

export default userRouter;
