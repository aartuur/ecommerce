import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Registrati from './pagine/Registrati.jsx'
import Login from './pagine/Login.jsx'
import Navbar from './componenti/Navbar.jsx'
import AggiungiProdotto from './pagine/AggiungiProdotto.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registrati" element={<Registrati />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/aggiungi-prod" element={<AggiungiProdotto />}/>
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
