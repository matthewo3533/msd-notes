import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

try {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error mounting React app:', error)
} 