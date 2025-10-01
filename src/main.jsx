import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/css/App.css'
// import App from './App.jsx'
import ChessBoard from './components/board'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChessBoard/>
  </StrictMode>,
)
