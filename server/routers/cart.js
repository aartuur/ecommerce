import { Router } from "express";
import { getRepository, In } from "typeorm";
import Carrello from "../models/Carrello.js";
import Prodotto from "../models/Prodotto.js";
import User from "../models/User.js";

const cartRouter = Router();

cartRouter.post("/add-to-cart", async (req, res) => {
  try {
    const { productId, cartedFrom, quantity } = req.body;

    if (!productId || !cartedFrom || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Dati di input non validi" });
    }

    const cartRepo = getRepository(Carrello);
    const existingItem = await cartRepo.findOne({ where: { productId, cartedFrom } });

    if (existingItem) {
      existingItem.quantity += quantity;
      await cartRepo.save(existingItem);
      return res.status(200).json({ msg: "Quantità aggiornata nel carrello" });
    }

    const newItem = cartRepo.create({ productId, cartedFrom, quantity });
    await cartRepo.save(newItem);

    res.status(200).json({ msg: "Prodotto aggiunto al carrello" });
  } catch (error) {
    console.error("Errore durante l'aggiunta:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

cartRouter.get("/get-products", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID richiesto" });
    }

    const cartRepo = getRepository(Carrello);
    const cartItems = await cartRepo.find({ where: { cartedFrom: userId } });

    if (cartItems.length === 0) {
      return res.status(200).json([]);
    }

    const productIds = cartItems.map(item => item.productId);
    const prodRepo = getRepository(Prodotto);
    const products = await prodRepo.find({ where: { id: In(productIds) } });

    const userIds = [...new Set(products.map(p => p.pubblicatoDaId))];
    const userRepo = getRepository(User);
    const users = await userRepo.find({ where: { id: In(userIds) } });

    const detailedCart = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      const user = users.find(u => u.id === product.pubblicatoDaId);
      return {
        ...product,
        pubblicatoDa: user,
        quantity: item.quantity,
      };
    });

    res.status(200).json(detailedCart);
  } catch (error) {
    console.error("Errore nel recupero prodotti:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

cartRouter.delete("/remove-from-cart", async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({ error: "Product ID e User ID richiesti" });
    }

    const cartRepo = getRepository(Carrello);
    const item = await cartRepo.findOne({ where: { productId, cartedFrom: userId } });

    if (!item) {
      return res.status(404).json({ error: "Prodotto non presente nel carrello" });
    }

    await cartRepo.remove(item);

    res.status(200).json({ msg: "Prodotto rimosso dal carrello" });
  } catch (error) {
    console.error("Errore durante la rimozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default cartRouter;
