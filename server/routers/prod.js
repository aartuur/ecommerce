import { Router } from "express";
import { getRepository } from "typeorm";
import multer from "multer";
import sharp from "sharp";
import Prodotto from "../models/Prodotto.js";
import Image from "../models/Image.js";
import User from "../models/User.js";
import Preferito from "../models/Preferito.js";

const prodRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

prodRouter.get("/get-prods", async (req, res) => {
  try {
    const prodRepo = getRepository(Prodotto);
    const userRepo = getRepository(User);
    const prods = await prodRepo.find({ relations: ["image", "pubblicatoDa"] });

    const prodsConUtenti = await Promise.all(
      prods.map(async (prodotto) => {
        if (!prodotto.pubblicatoDaId) return prodotto;
        const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
        const { password, ...utenteSenzaPassword } = utente || {};
        return { ...prodotto, pubblicatoDa: utenteSenzaPassword };
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
    const { Nome, Descrizione, Prezzo, pubblicatoDa, picture } = req.body;

    if (!Nome || !Descrizione || !Prezzo || !pubblicatoDa || !req.file) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori, inclusa l'immagine" });
    }

    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(500, 300, { fit: "inside" })
      .toFormat("jpeg")
      .toBuffer();

    const userRepo = getRepository(User);
    const creator = await userRepo.findOneBy({ username: pubblicatoDa });
    if (!creator) return res.status(404).json({ error: "Utente non trovato" });

    const imageRepo = getRepository(Image);
    const savedImage = await imageRepo.save(imageRepo.create({
      data: resizedImageBuffer,
      contentType: "image/jpeg",
      loadedBy: creator.id,
    }));

    const prodottoRepo = getRepository(Prodotto);
    const nuovoProdotto = prodottoRepo.create({
      Nome,
      Descrizione,
      Prezzo: parseFloat(Prezzo),
      nPreferiti: 0,
      pubblicatoDa,
      pubblicatoDaId: creator.id,
      picture,
      imageId: savedImage.id,
    });

    await prodottoRepo.save(nuovoProdotto);
    res.status(201).json({ message: "Prodotto aggiunto con successo!", prodotto: nuovoProdotto });
  } catch (error) {
    console.error("Errore durante l'aggiunta del prodotto:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

prodRouter.get("/get-prods-by-user", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "ID utente mancante." });

    const prodRepo = getRepository(Prodotto);
    const userRepo = getRepository(User);
    const prodottiPubblicati = await prodRepo.find({
      where: { pubblicatoDaId: userId },
      relations: ["image"],
    });

    const prodottiConUsername = await Promise.all(
      prodottiPubblicati.map(async (prodotto) => {
        const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
        return { ...prodotto, pubblicatoDa: utente };
      })
    );

    res.status(200).json({
      msg: "Prodotti dell’utente recuperati con successo.",
      prodotti: prodottiConUsername,
    });
  } catch (error) {
    console.error("Errore nel recupero dei prodotti:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

prodRouter.get("/get-prods/:limite", async (req, res) => {
  try {
    const limite = parseInt(req.params.limite, 10);
    if (isNaN(limite) || limite <= 0) {
      return res.status(400).json({ error: "Il limite deve essere un numero positivo" });
    }

    const prodottoRepo = getRepository(Prodotto);
    const userRepo = getRepository(User);

    const prodotti = await prodottoRepo.find({
      take: limite,
      relations: ["image"],
    });

    const prodottiConUtente = await Promise.all(
      prodotti.map(async (prodotto) => {
        const utente = await userRepo.findOneBy({ id: prodotto.pubblicatoDaId });
        const { password, ...resto } = utente || {};
        return {
          id: prodotto.id,
          Nome: prodotto.Nome,
          Descrizione: prodotto.Descrizione,
          Prezzo: prodotto.Prezzo,
          nPreferiti: prodotto.nPreferiti,
          Commenti: prodotto.Commenti,
          imageId: prodotto.image?.id,
          pubblicatoDa: resto,
        };
      })
    );

    res.status(200).json({ prodotti: prodottiConUtente });
  } catch (error) {
    console.error("Errore nel recupero prodotti:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

prodRouter.post("/add-like", async (req, res) => {
  const { prodottoId, username } = req.body;

  if (!prodottoId || !username) {
    return res.status(400).json({ msg: "ID prodotto o utente mancante." });
  }

  try {
    const prodRepo = getRepository(Prodotto);
    const userRepo = getRepository(User);
    const preferitoRepo = getRepository(Preferito);

    const [prodotto, user] = await Promise.all([
      prodRepo.findOneBy({ id: prodottoId }),
      userRepo.findOneBy({ username }),
    ]);

    if (!prodotto || !user) {
      return res.status(404).json({ msg: "Prodotto o utente non trovato." });
    }

    const giàPreferito = await preferitoRepo.findOneBy({
      userId: user.id,
      productId: prodottoId,
    });

    if (giàPreferito) {
      return res.status(400).json({ msg: "Prodotto già nei preferiti." });
    }

    await preferitoRepo.save(preferitoRepo.create({
      userId: user.id,
      productId: prodottoId,
    }));

    await prodRepo.update({ id: prodottoId }, { nPreferiti: () => "nPreferiti + 1" });

    res.status(200).json({ msg: "Prodotto aggiunto ai preferiti.", prodottoId });
  } catch (error) {
    console.error("Errore aggiunta like:", error);
    res.status(500).json({ msg: "Errore durante l'aggiunta ai preferiti." });
  }
});

prodRouter.get("/get-preferiti/:prodottoId", async (req, res) => {
  try {
    const { prodottoId } = req.params;

    const prodRepo = getRepository(Prodotto);
    const preferitoRepo = getRepository(Preferito);

    const prodotto = await prodRepo.findOneBy({ id: prodottoId });
    if (!prodotto) return res.status(404).json({ msg: "Prodotto non trovato." });

    const preferiti = await preferitoRepo.find({
      where: { productId: prodottoId },
      relations: ["user"],
    });

    const utenti = preferiti.map(({ user }) => ({
      id: user.id,
      username: user.username,
    }));

    res.status(200).json({ msg: "Utenti che hanno salvato il prodotto.", utenti });
  } catch (error) {
    console.error("Errore preferiti:", error);
    res.status(500).json({ msg: "Errore durante il recupero dei preferiti." });
  }
});

prodRouter.get("/get-image", async (req, res) => {
  try {
    const { imageId } = req.query;
    if (!imageId) return res.status(400).json({ error: "ID immagine mancante." });

    const imageRepo = getRepository(Image);
    const image = await imageRepo.findOne({
      where: { id: imageId },
      select: ["data", "contentType"],
    });

    if (!image) return res.status(404).json({ error: "Immagine non trovata." });

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error("Errore immagine:", error);
    res.status(500).json({ error: "Errore durante il recupero dell'immagine." });
  }
});

export default prodRouter;
