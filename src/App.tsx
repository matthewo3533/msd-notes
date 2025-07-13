import React, { useState } from 'react';
import ServiceGrid from './components/ServiceGrid';
import FoodQuestions from './components/FoodQuestions';
import NoteOutput from './components/NoteOutput';
import DarkModeToggle from './components/DarkModeToggle';
import ClothingQuestions from './components/ClothingQuestions';

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

const services: Service[] = [
  { id: 'food', title: 'Food', emoji: '🍽️' },
  { id: 'clothing', title: 'Clothing', emoji: '👕' },
  { id: 'electricity', title: 'Electricity Assistance', emoji: '⚡' },
  { id: 'dental', title: 'Dental', emoji: '🦷' },
  { id: 'beds', title: 'Beds', emoji: '🛏️' },
  { id: 'bedding', title: 'Bedding', emoji: '🛌' },
  { id: 'furniture', title: 'Furniture', emoji: '🛋️' },
  { id: 'glasses', title: 'Glasses', emoji: '👓' },
  { id: 'fridge', title: 'Fridge', emoji: '❄️' },
  { id: 'washing', title: 'Washing Machine', emoji: '🫧' },
  { id: 'bond', title: 'Bond/Rent in Advance', emoji: '🏠' },
  { id: 'rent', title: 'Rent Arrears', emoji: '💰' },
  { id: 'adsd', title: 'ADSD', emoji: '💵' },
  { id: 'car', title: 'Car repairs', emoji: '🚗' },
  { id: 'work', title: 'Transition to Work Grant', emoji: '💼' },
  { id: 'funeral', title: 'Assistance to attend funeral/tangi', emoji: '⚰️' },
  { id: 'stranded', title: 'Stranded Travel', emoji: '⛽' },
  { id: 'emergency', title: 'Other Emergency Payment', emoji: '🚨' },
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<FoodFormData>({
    clientId: null,
    whyNeedFood: '',
    canMeetNeedOtherWay: '',
    currentFoodBalance: 0,
    foodAmountRequested: 0,
    hardshipUnforeseen: '',
    unforeseenCircumstance: '',
    reasonableSteps: '',
    income: {
      benefit: 0,
      employment: 0,
      childSupport: 0,
      otherIncome: 0,
    },
    costs: [],
    decision: '',
    decisionReason: '',
  });
  const [clothingFormData, setClothingFormData] = useState<ClothingFormData>({
    clientId: null,
    whyNeedClothing: '',
    canMeetNeedOtherWay: '',
    reasonableSteps: '',
    supplierName: '',
    supplierId: '',
    amount: 0,
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
    income: {
      benefit: 0,
      employment: 0,
      childSupport: 0,
      otherIncome: 0,
    },
    costs: [],
    decision: '',
    decisionReason: '',
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleFormDataChange = (data: Partial<FoodFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setSelectedService(null);
    setFormData({
      clientId: null,
      whyNeedFood: '',
      canMeetNeedOtherWay: '',
      currentFoodBalance: 0,
      foodAmountRequested: 0,
      hardshipUnforeseen: '',
      unforeseenCircumstance: '',
      reasonableSteps: '',
      income: {
        benefit: 0,
        employment: 0,
        childSupport: 0,
        otherIncome: 0,
      },
      costs: [],
      decision: '',
      decisionReason: '',
    });
    setClothingFormData({
      clientId: null,
      whyNeedClothing: '',
      canMeetNeedOtherWay: '',
      reasonableSteps: '',
      supplierName: '',
      supplierId: '',
      amount: 0,
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
      income: {
        benefit: 0,
        employment: 0,
        childSupport: 0,
        otherIncome: 0,
      },
      costs: [],
      decision: '',
      decisionReason: '',
    });
  };

  // Apply dark mode class to body
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Get service name for greeting
  const getGreeting = () => {
    // Return service name if a service is selected
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      if (service) {
        return service.title;
      }
    }
    
    return 'MSD Notes App';
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${dayName} ${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">{getGreeting()}</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={setDarkMode} />
        </div>
      </div>
      
      {!selectedService ? (
        <>
          <div className="service-question">
            <h2>What does the client need help with?</h2>
          </div>
          <ServiceGrid services={services} onServiceSelect={handleServiceSelect} />
        </>
      ) : selectedService === 'food' ? (
        <div className="food-layout">
          <FoodQuestions 
            formData={formData} 
            onFormDataChange={handleFormDataChange}
            onBack={() => setSelectedService(null)}
          />
          <div className="note-section">
            <NoteOutput formData={formData} onReset={resetForm} />
          </div>
        </div>
      ) : selectedService === 'clothing' ? (
        <div className="food-layout">
          <ClothingQuestions
            formData={clothingFormData}
            onFormDataChange={data => setClothingFormData(prev => ({ ...prev, ...data }))}
            onBack={() => setSelectedService(null)}
          />
          <div className="note-section">
            <NoteOutput formData={clothingFormData} service="clothing" onReset={resetForm} />
          </div>
        </div>
      ) : (
        <div className="questions-container">
          <h2>Service: {services.find(s => s.id === selectedService)?.title}</h2>
          <p>This service is not yet implemented. Please select Food for now.</p>
          <button 
            className="copy-btn" 
            onClick={() => setSelectedService(null)}
            style={{ marginTop: '1rem' }}
          >
            Back to Services
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 