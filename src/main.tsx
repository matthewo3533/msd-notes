import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Prevent scroll wheel from changing number input values
document.addEventListener('DOMContentLoaded', () => {
  const preventScrollOnNumberInputs = (e: WheelEvent) => {
    const target = e.target as HTMLElement
    if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'number') {
      e.preventDefault()
    }
  }
  
  document.addEventListener('wheel', preventScrollOnNumberInputs, { passive: false })
})

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