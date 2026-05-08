import React from 'react'
import ReactDOM from 'react-dom/client'

// FontAwesome Pro (renderização SVG via JS)
import '@fortawesome/fontawesome-pro/js/all.min.js'

// Estilos globais
import './index.css'

import App from './App.tsx'

document.documentElement.setAttribute('data-theme', '1doc')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
