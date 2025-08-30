import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FoodPage from './components/FoodPage';
import ClothingPage from './components/ClothingPage';
import RentArrearsPage from './components/RentArrearsPage';
import CarRepairsPage from './components/CarRepairsPage';
import FuneralAssistancePage from './components/FuneralAssistancePage';
import ElectricityPage from './components/ElectricityPage';
import DentalPage from './components/DentalPage';
import BedsPage from './components/BedsPage';
import BeddingPage from './components/BeddingPage';
import FurniturePage from './components/FurniturePage';
import GlassesPage from './components/GlassesPage';
import FridgePage from './components/FridgePage';
import WashingMachinePage from './components/WashingMachinePage';
import BondRentPage from './components/BondRentPage';
import TASGrantPage from './components/TASGrantPage';
import DeclareIncomePage from './components/DeclareIncomePage';
import ADSDPage from './components/ADSDPage';
import PetrolCalculator from './components/PetrolCalculator';
import NotFoundPage from './components/NotFoundPage';

export interface Service {
  id: string;
  title: string;
  emoji: string;
}

export interface FoodFormData {
  clientId: boolean | null;
  whyNeedFood: string;
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
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface ADSDFormData {
  clientId: boolean | null;
  whyNeedADSD: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  bankAccount: string;
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

export interface RentArrearsFormData {
  clientId: boolean | null;
  whyNeedRentArrears: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  rentArrearsVerification: string;
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

export interface CarRepairsFormData {
  clientId: boolean | null;
  whyNeedCarRepairs: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  vehicleMakeModel: string;
  licensePlate: string;
  odometer: string;
  vehicleOwner: string;
  nztaVerification: string;
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

export interface FuneralAssistanceFormData {
  clientId: boolean | null;
  whyNeedFuneralAssistance: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  // Travel details (from petrol calculator)
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
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

export interface BondRentFormData {
  clientId: boolean | null;
  whyNeedAccommodation: string;
  newAddress: string;
  newAddressData?: {
    placeId: string;
    description: string;
  };
  asZone: number;
  weeklyRent: number;
  tenancyStartDate: string;
  bondAmount: number;
  rentInAdvanceAmount: number;
  reasonableSteps: string;
  tenancyAffordable: string;
  supplierName: string;
  supplierId: string;
  bondPaymentAmount: number;
  rentAdvancePaymentAmount: number;
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

export interface GlassesFormData {
  clientId: boolean | null;
  whyNeedGlasses: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface FridgeFormData {
  clientId: boolean | null;
  whyNeedFridge: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  // Whiteware Info section
  householdSize: string;
  addressContactConfirmed: string;
  spaceMeasured: string;
  specialDeliveryInstructions: string;
  deliveryInstructionsDetails: string;
  applianceModel: string;
  applianceCANumber: string;
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

export interface WashingMachineFormData {
  clientId: boolean | null;
  whyNeedWashingMachine: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  // Whiteware Info section
  householdSize: string;
  addressContactConfirmed: string;
  spaceMeasured: string;
  specialDeliveryInstructions: string;
  deliveryInstructionsDetails: string;
  applianceModel: string;
  applianceCANumber: string;
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

export interface BedsFormData {
  clientId: boolean | null;
  whyNeedBeds: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface BeddingFormData {
  clientId: boolean | null;
  whyNeedBedding: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface FurnitureFormData {
  clientId: boolean | null;
  whyNeedFurniture: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface DentalFormData {
  clientId: boolean | null;
  whyNeedDental: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  sngEligible: string;
  sngBalance: number;
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

export interface ElectricityFormData {
  clientId: boolean | null;
  whyNeedPower: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
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

export interface DeclareIncomeFormData {
  weeks: Array<{
    id: string;
    weekBeginning: string;
    incomeSources: Array<{
      id: string;
      type: 'hourly' | 'lump-sum';
      description: string;
      hoursWorked?: number;
      hourlyRate?: number;
      lumpSumAmount?: number;
    }>;
  }>;
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
        path="/rent-arrears" 
        element={<RentArrearsPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/car" 
        element={<CarRepairsPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/funeral" 
        element={<FuneralAssistancePage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
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
        path="/furniture" 
        element={<FurniturePage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/glasses" 
        element={<GlassesPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/fridge" 
        element={<FridgePage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/washing" 
        element={<WashingMachinePage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/bond" 
        element={<BondRentPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/tas-grant" 
        element={<TASGrantPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/declare-income" 
        element={<DeclareIncomePage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/adsd" 
        element={<ADSDPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/petrol-calculator" 
        element={<PetrolCalculator currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
      <Route 
        path="/:serviceId" 
        element={<NotFoundPage currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} 
      />
    </Routes>
  );
}

export default App; 