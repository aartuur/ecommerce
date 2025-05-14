import { Router } from "express";
import { getRepository } from "typeorm";
import multer from "multer";
import sharp from "sharp";
import Prodotto from "../models/Prodotto.js";
import Image from "../models/Image.js";
import User from "../models/User.js";
import Preferito from "../models/Preferito.js";


// http://localhost:14577/product/*
const prodRouter = Router();

// Per le immagini nel db
const storage = multer.memoryStorage();
const upload = multer({ storage });

prodRouter.get("/get-prods", async (req, res) => {
  try {
    const prodRepo = getRepository(Prodotto);
    const prods = await prodRepo.find({
      relations: ["image", "pubblicatoDa"], // Assicurati che 'pubblicatoDa' sia una relazione definita nel modello
    });

    const userRepo = getRepository(User);

    const prodsConUtenti = await Promise.all(
      prods.map(async (prodotto) => {
        if (prodotto.pubblicatoDaId) {
          const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
          const { password, ...utenteSenzaPassword } = utente; // Escludi la password
          return {
            ...prodotto,
            pubblicatoDa: utenteSenzaPassword,
          };
        }
        return prodotto;
      })
    );

    res.json(prodsConUtenti);
  } catch (error) {
    console.error("Errore nel recupero dei prodotti:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});
prodRouter.post("/add-prod", upload.single("image"), async (req, res) => {
  try {
    const { Nome, Descrizione, Prezzo, pubblicatoDa } = req.body;
    const picture = req.body.picture && req.body.picture 

    if (!Nome || !Descrizione || !Prezzo || !pubblicatoDa || !req.file) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori, inclusa l'immagine" });
    }

    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(500, 300, { fit: "inside" })
      .toFormat("jpeg")
      .toBuffer();

    const userRepository = getRepository(User);
    const creator = await userRepository.findOneBy({ username: pubblicatoDa });
    if (!creator) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const imageRepository = getRepository(Image);
    const newImage = imageRepository.create({
      data: resizedImageBuffer,
      contentType: "image/jpeg",
      loadedBy: creator.id,
    });
    const savedImage = await imageRepository.save(newImage);

    const prodottoRepository = getRepository(Prodotto);
    const nuovoProdotto = prodottoRepository.create({
      Nome,
      Descrizione,
      Prezzo: parseFloat(Prezzo),
      nPreferiti: 0,
      pubblicatoDa,
      pubblicatoDaId: creator.id,
      picture,
      imageId: savedImage.id,
    });
    await prodottoRepository.save(nuovoProdotto);

    res.status(201).json({
      message: "Prodotto aggiunto con successo!",
      prodotto: nuovoProdotto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante l'aggiunta del prodotto" });
  }
});

prodRouter.get("/get-prods-by-user", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "ID utente mancante." });
    }

    const prodRepo = getRepository(Prodotto);
    const prodottiPubblicati = await prodRepo.find({
      where: { pubblicatoDaId: userId },
      relations: ["image"],
    });

    const userRepo = getRepository(User)

    const prodottiConUsername = await Promise.all(
      prodottiPubblicati.map(async (prodotto) => {
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
    console.error("Errore durante il recupero dei prodotti pubblicati:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

prodRouter.get("/get-prods/:limite", async (req, res) => {
  try {
    const limite = parseInt(req.params.limite, 10);

    if (isNaN(limite) || limite <= 0) {
      return res.status(400).json({ error: "Il limite deve essere un numero positivo" });
    }

    const prodottoRepository = getRepository(Prodotto);
    const userRepo = getRepository(User);

    const prodotti = await prodottoRepository.find({
      take: limite,
      relations: ["image"],
    });

    const prodottiConUsername = await Promise.all(
      prodotti.map(async (prodotto) => {
        const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
        const {password,...resto} = utente

        return {
          id: prodotto.id,
          Nome: prodotto.Nome,
          Descrizione: prodotto.Descrizione,
          Prezzo: prodotto.Prezzo,
          nPreferiti: prodotto.nPreferiti,
          Commenti: prodotto.Commenti,
          imageId: prodotto.image?.id,
          pubblicatoDa: resto
        };
      })
    );

    res.status(200).json({ prodotti: prodottiConUsername });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dei prodotti" });
  }
});

prodRouter.post("/add-like", async (req, res) => {
  const { prodottoId, username } = req.body;

  if (!prodottoId || !username) {
    return res.status(400).json({ msg: "ID del prodotto o utente mancante." });
  }

  try {
    const prodRepo = getRepository(Prodotto);
    const userRepo = getRepository(User);
    const preferitoRepo = getRepository(Preferito);

    const prodotto = await prodRepo.findOneBy({ id: prodottoId });
    const user = await userRepo.findOneBy({ username });

    if (!prodotto || !user) {
      return res.status(404).json({ msg: "Prodotto o utente non trovato." });
    }

    const alreadySaved = await preferitoRepo.findOneBy({
      userId: user.id,
      productId: prodottoId,
    });

    if (alreadySaved) {
      return res.status(400).json({ msg: "Il prodotto è già stato salvato." });
    }

    const nuovoPreferito = preferitoRepo.create({
      userId: user.id,
      productId: prodottoId,
    });
    await preferitoRepo.save(nuovoPreferito);

    await prodRepo.update(
      { id: prodottoId },
      { nPreferiti: () => "nPreferiti + 1" }
    );

    res.status(200).json({
      msg: "Prodotto aggiunto ai preferiti.",
      prodottoId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Errore durante l'aggiunta del prodotto ai preferiti." });
  }
});

prodRouter.get("/get-preferiti/:prodottoId", async (req, res) => {
  const { prodottoId } = req.params;

  try {
    const prodRepo = getRepository(Prodotto);
    const preferitoRepo = getRepository(Preferito);
    const userRepo = getRepository(User);

    const prodotto = await prodRepo.findOneBy({ id: prodottoId });
    if (!prodotto) {
      return res.status(404).json({ msg: "Prodotto non trovato." });
    }

    const preferiti = await preferitoRepo.find({
      where: { productId: prodottoId },
      relations: ["user"],
    });

    const utentiPreferiti = preferiti.map((preferito) => ({
      id: preferito.user.id,
      username: preferito.user.username,
    }));

    res.status(200).json({
      msg: "Utenti che hanno salvato il prodotto.",
      utenti: utentiPreferiti,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Errore durante il recupero degli utenti preferiti." });
  }
});

prodRouter.get("/get-image", async (req, res) => {
  const { imageId } = req.query;

  try {
    if (!imageId) {
      return res.status(400).json({ error: "ID dell'immagine mancante" });
    }

    const imageRepository = getRepository(Image);
    const image = await imageRepository.findOne({
      where: { id: imageId }, // Condizione di ricerca esplicita
      select: ["data", "contentType"], // Seleziona solo i campi necessari
    });

    if (!image) {
      return res.status(404).json({ error: "Immagine non trovata" });
    }

    res.set("Content-Type", image.contentType);

    res.send(image.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero dell'immagine" });
  }
});

export default prodRouter;