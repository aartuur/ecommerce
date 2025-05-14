import { Router } from "express";
import { getRepository } from "typeorm";
import { In } from "typeorm";
import Carrello from "../models/Carrello.js";
import Prodotto from "../models/Prodotto.js";
import User from "../models/User.js";

const cartRouter = Router();

// Add a product to the cart
cartRouter.post("/add-to-cart", async (req, res) => {
    try {
        const { productId, cartedFrom, quantity } = req.body;

        // Validate input
        if (!productId || !cartedFrom || !quantity || quantity <= 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const cartRepo = getRepository(Carrello);
        const existingCartItem = await cartRepo.findOne({
            where: { productId, cartedFrom },
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await cartRepo.save(existingCartItem);
            return res.status(200).json({ msg: "Quantity updated in the cart" });
        }

        const newCartItem = cartRepo.create({ productId, cartedFrom, quantity });
        await cartRepo.save(newCartItem);

        res.status(200).json({ msg: "Product added to the cart" });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.get("/get-products", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const cartRepo = getRepository(Carrello);
        const userProductsCarted = await cartRepo.find({
            where: { cartedFrom: userId },
        });

        if (userProductsCarted.length === 0) {
            return res.status(200).json([]); // Return an empty array if no products are in the cart
        }

        const productIds = userProductsCarted.map((item) => item.productId);

        const prodRepo = getRepository(Prodotto);
        const prodsCarted = await prodRepo.find({
            where: { id: In(productIds) }, // Use the 'In' operator to query multiple IDs
        });

        const userIds = [...new Set(prodsCarted.map((prod) => prod.pubblicatoDaId))];

        const userRepo = getRepository(User);
        const users = await userRepo.find({
            where: { id: In(userIds) },
        });

        const cartWithProducts = userProductsCarted.map((cartItem) => {
            const product = prodsCarted.find((prod) => prod.id === cartItem.productId);
            const user = users.find((u) => u.id === product.pubblicatoDaId);
            return {
                ...product,
                pubblicatoDa: user, // Include the full User object
                quantity: cartItem.quantity, // Include the quantity from the cart
            };
        });

        res.status(200).json(cartWithProducts);
    } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

cartRouter.delete("/remove-from-cart", async (req, res) => {
    try {
        const { productId, userId } = req.body;

        // Validate input
        if (!productId || !userId) {
            return res.status(400).json({ error: "Product ID and User ID are required" });
        }

        const cartRepo = getRepository(Carrello);
        const cartItem = await cartRepo.findOne({
            where: { productId, cartedFrom: userId },
        });

        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in the cart" });
        }

        await cartRepo.remove(cartItem);

        res.status(200).json({ msg: "Product removed from the cart" });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default cartRouter;