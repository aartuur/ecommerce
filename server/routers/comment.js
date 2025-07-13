import express, { Router } from "express"
import { getRepository } from "typeorm"
import Prodotto from "../models/Prodotto.js"
import User from "../models/User.js"
import Commento from "../models/Commento.js"

const commentRouter = Router()

commentRouter.post("/add", async (req, res) => {
    const { productId, senderId, text } = req.body;
 
    // Validazione dei campi
    if (!productId || !senderId || !text) {
        return res.status(400).json({ msg: "Tutti i campi sono obbligatori." });
    }

    // Recupera il prodotto e l'utente
    const prodRepo = getRepository(Prodotto);
    const product = await prodRepo.findOneBy({ id: productId });

    const userRepo = getRepository(User);
    const sender = await userRepo.findOneBy({ id: senderId });

    if (!product || !sender) {
        return res.status(400).json({ msg: "Prodotto o utente non trovato." });
    }

    // Crea il nuovo commento
    const commentRepo = getRepository(Commento);
    const newComment = commentRepo.create({
        senderId: sender.id, // ID dell'utente che ha scritto il commento
        productId: product.id,
        text
    });

    await commentRepo.save(newComment);

    res.status(201).json({
        msg: "Commento aggiunto correttamente.",
        comment: newComment
    });
});

commentRouter.get("/get-comments", async (req, res) => {
    try {
        const { productId } = req.query;

        // Validazione del parametro productId
        if (!productId) {
            return res.status(400).json({ msg: "Il parametro productId è obbligatorio." });
        }

        // Recupera i commenti relativi al prodotto
        const commentRepo = getRepository(Commento);
        const prodComments = await commentRepo.find({
            where: { productId },
            relations: ["user"] // Carica automaticamente i dati dell'utente tramite la relazione
        });

        if (!prodComments || prodComments.length === 0) {
            return res.status(200).json([]); // Restituisci una lista vuota se non ci sono commenti
        }

        // Estrai tutti i campi tranne la password
        const commentsWithUserData = prodComments.map(comment => {
            const { password, ...userData } = comment.user || {};
            return { ...comment, user: userData };
        });

        // Invia la risposta con i commenti arricchiti dei dati degli utenti
        res.status(200).json(commentsWithUserData);
    } catch (error) {
        console.error("Errore durante il recupero dei commenti:", error);
        res.status(500).json({ msg: "Errore interno del server" });
    }
});

export default commentRouter