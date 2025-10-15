import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Prevent scroll wheel from changing number input values by blurring on scroll
document.addEventListener('DOMContentLoaded', () => {
  const handleScrollOverNumberInputs = (e: WheelEvent) => {
    const target = e.target as HTMLElement
    // If scrolling over a focused number input, blur it to allow smooth scrolling
    if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'number') {
      if (document.activeElement === target) {
        (target as HTMLInputElement).blur()
      }
    }
  }
  
  document.addEventListener('wheel', handleScrollOverNumberInputs, { passive: true })
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