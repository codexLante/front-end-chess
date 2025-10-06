import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/css/App.css'
import ChessBoard from './components/board'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
