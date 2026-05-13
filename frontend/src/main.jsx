import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import { Toaster, toast } from "sonner"


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>

      <App />

      {/* ✅ SAFE: NOT a hook, just a component */}
      <Toaster position="top-right" reverseOrder={false} />

    </BrowserRouter>
  // </StrictMode>
)