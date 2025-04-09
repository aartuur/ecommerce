import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import base64 from "base-64"
import Registrati from './pagine/Registrati'
import Navbar from './componenti/Navbar'
import { Box, Container, Divider, Typography } from '@mui/material'
import cookies from "js-cookie"
import Section from './componenti/Section'

function App() {
  const [count, setCount] = useState(0)

  const getCookieData = cookie => cookie ? base64.decode(cookie) : ""
  const isLogged = Boolean(cookies.get("SSDT"))

  const {username} = isLogged ? JSON.parse(getCookieData(cookies.get("SSDT"))) : ""

  return (
    <Box width="100vw">
        <Navbar />
          <Section />
        <Divider />
    </Box>
  )
}

export default App
