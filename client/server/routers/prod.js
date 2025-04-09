import { Router } from "express";
import multer from "multer"
import { getRepository } from "typeorm";
import Prodotto from "../models/Prodotto.js";

const prodRouter = Router()

const upload = multer({ storage: multer.memoryStorage() });

const addProdotto = async (req, res) => {
    try {
      const { Nome, Descrizione, Prezzo, pubblicatoDa } = req.body;


      let imageBase64 = null;
  
      if (req.file) {
        imageBase64 = req.file.buffer.toString("base64");
      }
  
      // Validazione dei dati
      if (!Nome || !Descrizione || !Prezzo || !pubblicatoDa) {
        return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
      }
  
      // Salva il prodotto nel database
      const prodottoRepository = getRepository(Prodotto);
      const nuovoProdotto = prodottoRepository.create({
        Nome,
        Descrizione,
        Prezzo: parseFloat(Prezzo),
        image: imageBase64, // Salva l'immagine codificata in Base64
        nPreferiti: 0,
        pubblicatoDa: parseInt(pubblicatoDa),
      });
  
      await prodottoRepository.save(nuovoProdotto);
  
      res.status(201).json({ message: "Prodotto aggiunto con successo!", prodotto: nuovoProdotto });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Errore durante l'aggiunta del prodotto" });
    }
  };

prodRouter.post("/add-prod",upload.single("image"), addProdotto)


export default prodRouter