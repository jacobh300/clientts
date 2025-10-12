import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { PageChat } from './pages/PageChat.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Callback from "./pages/Callback";
import { ProviderDatabase } from './providers/DatabaseProvider.tsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ProviderDatabase>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/chat" element={<PageChat />} />
      </Routes>
    </BrowserRouter>
  </ProviderDatabase>
</StrictMode>,
)
