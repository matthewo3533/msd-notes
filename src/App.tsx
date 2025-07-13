import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FoodPage from './components/FoodPage';
import ClothingPage from './components/ClothingPage';
import NotFoundPage from './components/NotFoundPage';

export interface Service {
  id: string;
  title: string;
  emoji: string;
}

export interface FoodFormData {
  clientId: boolean | null;
  whyNeedFood: string;
  canMeetNeedOtherWay: string;
  currentFoodBalance: number;
  foodAmountRequested: number;
  hardshipUnforeseen: string;
  unforeseenCircumstance: string;
  reasonableSteps: string;
  income: {
    benefit: number;
    employment: number;
    childSupport: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface ClothingFormData {
  clientId: boolean | null;
  whyNeedClothing: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  income: {
    benefit: number;
    employment: number;
    childSupport: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home darkMode={darkMode} onToggleDarkMode={setDarkMode} />} 
      />
      <Route 
        path="/food" 
        element={<FoodPage darkMode={darkMode} onToggleDarkMode={setDarkMode} />} 
      />
      <Route 
        path="/clothing" 
        element={<ClothingPage darkMode={darkMode} onToggleDarkMode={setDarkMode} />} 
      />
      <Route 
        path="/:serviceId" 
        element={<NotFoundPage darkMode={darkMode} onToggleDarkMode={setDarkMode} />} 
      />
    </Routes>
  );
}

export default App; 