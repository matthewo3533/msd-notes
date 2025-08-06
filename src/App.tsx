import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FoodPage from './components/FoodPage';
import ClothingPage from './components/ClothingPage';
import NotFoundPage from './components/NotFoundPage';
import ElectricityPage from './components/ElectricityPage';
import DentalPage from './components/DentalPage';
import BedsPage from './components/BedsPage';
import BeddingPage from './components/BeddingPage';
import TASGrantPage from './components/TASGrantPage';

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
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
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
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface TASGrantFormData {
  dateOfFirstContact: string;
  clientConsent: string;
  childSupportLiableCosts: string;
  childSupportAPIConsent: string;
  addressDetailsCorrect: string;
  contactDetailsCorrect: string;
  accommodationCosts: number;
  rentBoardIncludesUtilities: string;
  homeOwnershipCostsChanged: string;
  disabilityCostsChanged: string;
  tasCostsChanged: string;
  familyTaxCreditsCorrect: string;
  incomeCorrect: string;
  assetsCorrect: string;
  relationshipDetailsCorrect: string;
  verificationReceived: string;
  deficiency: number;
  tasRatePayable: number;
  necessaryReasonableSteps: string;
  clientUnderstandsObligations: string;
  outcome: string;
  regrantDate: string;
  furtherActionNeeded: string;
  lsumSent: string;
  arrearsIssued: number;
}

function App() {
  // Initialize theme from localStorage or default to 'dark-blue'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('msd-theme');
    return savedTheme || 'dark-blue';
  });

  // Apply theme class to body
  useEffect(() => {
    // Remove all existing theme classes and dark-mode class
    document.body.classList.remove(
      'theme-dark-blue', 'theme-light', 'dark-mode'
    );
    // Add the current theme class
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('msd-theme', currentTheme);
  }, [currentTheme]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/food" 
        element={<FoodPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/clothing" 
        element={<ClothingPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/electricity" 
        element={<ElectricityPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/dental" 
        element={<DentalPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/beds" 
        element={<BedsPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/bedding" 
        element={<BeddingPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/tas-grant" 
        element={<TASGrantPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/:serviceId" 
        element={<NotFoundPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
    </Routes>
  );
}

export default App; 