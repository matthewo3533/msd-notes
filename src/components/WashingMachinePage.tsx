import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WashingMachineQuestions from './WashingMachineQuestions';
import NoteOutput from './NoteOutput';
import ThemeSelector from './ThemeSelector';
import { WashingMachineFormData } from '../App';

interface WashingMachinePageProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const WashingMachinePage: React.FC<WashingMachinePageProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WashingMachineFormData>({
    clientId: null,
    whyNeedWashingMachine: '',
    canMeetNeedOtherWay: '',
    reasonableSteps: '',
    supplierName: '',
    supplierId: '',
    amount: 0,
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
    householdSize: '',
    addressContactConfirmed: '',
    spaceMeasured: '',
    specialDeliveryInstructions: '',
    deliveryInstructionsDetails: '',
    applianceModel: '',
    applianceCANumber: '',
    income: {
      benefit: 0,
      employment: 0,
      familyTaxCredit: 0,
      childSupport: 0,
      childDisabilityAllowance: 0,
      otherIncome: 0,
    },
    costs: [],
    decision: '',
    decisionReason: '',
  });

  const handleFormDataChange = (data: Partial<WashingMachineFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedWashingMachine: '',
      canMeetNeedOtherWay: '',
      reasonableSteps: '',
      supplierName: '',
      supplierId: '',
      amount: 0,
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
      householdSize: '',
      addressContactConfirmed: '',
      spaceMeasured: '',
      specialDeliveryInstructions: '',
      deliveryInstructionsDetails: '',
      applianceModel: '',
      applianceCANumber: '',
      income: {
        benefit: 0,
        employment: 0,
        familyTaxCredit: 0,
        childSupport: 0,
        childDisabilityAllowance: 0,
        otherIncome: 0,
      },
      costs: [],
      decision: '',
      decisionReason: '',
    });
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
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
            <h1 className="greeting">Washing Machine</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <WashingMachineQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="washing" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default WashingMachinePage;
