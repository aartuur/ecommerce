import { Router } from "express";
import bcrypt from "bcrypt";
import { getManager } from "typeorm";
import User from "../models/User.js";

const authRouter = Router();

authRouter.post("/registrati", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
    }

    const userRepository = getManager().getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "Email già registrata." });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(15));

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    res.status(201).json({
      message: "Utente registrato con successo!",
      data: {
        username,
        timestamps: new Date().toISOString(),
        id: newUser.id,
      },
    });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
  }

  try {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ error: "Email non registrata." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({ error: "Credenziali errate." });
    }

    res.status(200).json({
      message: "Login effettuato con successo.",
      data: {
        username: user.username,
        timestamps: new Date().toISOString(),
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

export default authRouter;
