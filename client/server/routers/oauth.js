import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import axios from "axios";
import { getManager } from "typeorm";
import User from "../models/User.js"; // Assicurati che il modello User sia definito correttamente

const oauthRouter = Router();

// Configura Passport con la strategia Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: "714603803383-29nq8c0fl34kvo93m63j33um0m6vq5h0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:14577/oauth/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = getManager().getRepository(User);
        const email = profile.emails[0].value;

        // Cerca l'utente nel database tramite email
        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
          // Se l'utente non esiste, crealo
          user = userRepository.create({
            username: profile.displayName,
            email: email,
            password: null, // Non impostare una password per gli utenti OAuth
          });
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (error) {
        console.error("Errore durante la ricerca/creazione dell'utente:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serializza solo l'ID utente
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Rotta per avviare il processo di autenticazione
oauthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rotta per gestire il callback di Google
oauthRouter.post("/callback", cors({ origin: "http://localhost:5173" }), async (req, res) => {
  try {
    const { tokenId } = req.body;

    // Verifica il token JWT con Google
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenId}`);
    const { email, name, picture } = googleResponse.data;

    // Cerca l'utente nel database tramite email
    const userRepository = getManager().getRepository(User);
    let user = await userRepository.findOne({ where: { email } });

    if(!user?.picture){
      const picturedUser = {...user,picture}
      await userRepository.save(picturedUser)
    }

    if (!user) {
      // Se l'utente non esiste, crealo
      user = userRepository.create({
        username: name,
        email: email,
        picture,
        password: null, // Non impostare una password per gli utenti OAuth
      });
      await userRepository.save(user);
    }

    // Restituisci i dati utente al frontend
    return res.status(200).json({
      success: true,
      user: {
        id: user.id, // ID utente dal database
        email: user.email,
        username: user.username,
        picture: picture,
      },
    });
  } catch (error) {
    console.error("Errore durante il callback:", error);
    return res.status(500).json({ success: false, error: "Errore interno del server." });
  }
});

export default oauthRouter;