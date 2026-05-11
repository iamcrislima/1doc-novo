import React from 'react'
import ReactDOM from 'react-dom/client'

// Estilos globais (tokens e variáveis CSS antes de qualquer JS que manipule o DOM)
import './index.css'

// FontAwesome Pro (renderização SVG via JS — após CSS para evitar FOUC)
import '@fortawesome/fontawesome-pro/js/all.min.js'

import App from './App.tsx'

document.documentElement.setAttribute('data-theme', '1doc')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
