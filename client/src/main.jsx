import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Registrati from './pagine/Registrati.jsx'
import Login from './pagine/Login.jsx'
import Navbar from './componenti/Navbar.jsx'
import AggiungiProdotto from './pagine/AggiungiProdotto.jsx'
import Profile from './pagine/Profile.jsx'
import Carrello from './pagine/Carrello.jsx'
import Prodotti from './pagine/Prodotti.jsx'
import Chat from './pagine/Chat.jsx'
import ChatList from './componenti/ChatList.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <StrictMode>
      
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/registrati" element={<Registrati />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aggiungi-prodotto" element={<AggiungiProdotto />} />
          <Route path="/profile/:uuidUtente" element={<Profile />} />
          <Route path="/carrello" element={<Carrello />} />
          <Route path="/prodotti" element={<Prodotti />} />
          <Route path="/chat/:roomId" element={<Chat />} />
          <Route path="/messaggi" element={<ChatList />} />
        </Routes>
      </BrowserRouter>

    </StrictMode>
  </>
  ,
)
