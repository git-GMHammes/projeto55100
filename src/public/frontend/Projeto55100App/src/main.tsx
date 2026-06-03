import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.tsx'
import { CepProvider } from './contexts/CepContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CepProvider>
      <App />
    </CepProvider>
  </StrictMode>,
)
