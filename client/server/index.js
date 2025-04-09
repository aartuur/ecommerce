import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.js";
import { createConnection, DataSource } from "typeorm";
import User from "./models/User.js";
import cors from "cors"
import prodRouter from "./routers/prod.js";
import Prodotto from "./models/Prodotto.js";

/* ======== DOTENV CONF ========= */
dotenv.configDotenv()
const PORT = process.env.SERVER_PORT || 80;

const app = express();
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173"
}))

/* ========= ROUTERS =========== */
app.use("/auth",authRouter)
app.use("/product",prodRouter)

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "ecommerce",
  synchronize: true,
  logging: false,
  entities: [User,Prodotto],
}).then(() => console.log("Connessione al database stabilita."))
    .catch((error) => console.log("Errore durante la connessione al database:", error));

app.get("/",(req,res) => {
    res.json({msg:"Halo boss"})
})


app.listen(PORT, () => {
  console.log(`[+] Web server in ascolto a: http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("[!] Failed to start the server:", err.message);
});