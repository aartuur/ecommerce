import { Router } from "express";
import bcrypt from "bcrypt";
import { getManager } from "typeorm"; // Importa getManager da TypeORM
import User from "../models/User.js"; // Importa il modello User
import base64 from "base-64"

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

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword, 
    });

    await userRepository.save(newUser);

    return res.status(201).json({
        message: "Utente registrato con successo!",
        data:{
            username,timestamps:new Date().toISOString()
        }
    });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    return res.status(500).json({ error: "Errore interno del server." });
  }
});

authRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    // Validazione dei campi
    if (!email || !password) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
    }
  
    const userRepository = getManager().getRepository(User);
  
    userRepository.findOne({ where: { email } }).then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email non registrata." });
      }
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Errore durante la verifica della password:", err);
          return res.status(500).json({ error: "Errore interno del server." });
        }
  
        if (isMatch) {
          return res.status(200).json({
            message: "Login effettuato con successo.",
            data: {
              username: user.username,
              timestamps: new Date().toISOString(),
            },
          });
        } else {
          return res.status(403).json({ error: "Credenziali errate." });
        }
      });
    }).catch((error) => {
      console.error("Errore durante la ricerca dell'utente:", error);
      return res.status(500).json({ error: "Errore interno del server." });
    });
  });
export default authRouter;