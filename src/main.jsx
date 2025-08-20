// src/main.jsx — bootstraps the React app
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Mount point
const container = document.getElementById('root')
if (!container) {
  const msg = 'Hughes Helper: #root not found in index.html';
  // Fail loudly in dev to catch template issues
  throw new Error(msg)
}

// Create root & render with React 18 StrictMode
const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Friendly console greeting (and a nod to the dedication)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('%cHughes Helper','background:#111;color:#fff;padding:2px 6px;border-radius:6px', 'From Taco → Matthew — build with love 💪🔧')
}
