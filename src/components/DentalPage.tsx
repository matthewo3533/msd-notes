import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DentalQuestions from './DentalQuestions';
import NoteOutput from './NoteOutput';
import DarkModeToggle from './DarkModeToggle';

interface DentalFormData {
  clientId: boolean | null;
  whyNeedDental: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
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

interface DentalPageProps {
  darkMode: boolean;
  onToggleDarkMode: (darkMode: boolean) => void;
}

const DentalPage: React.FC<DentalPageProps> = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DentalFormData>({
    clientId: null,
    whyNeedDental: '',
    canMeetNeedOtherWay: '',
    reasonableSteps: '',
    sngEligible: '',
    sngBalance: 1000,
    supplierName: '',
    supplierId: '',
    amount: 0,
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
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

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedDental: '',
      canMeetNeedOtherWay: '',
      reasonableSteps: '',
      sngEligible: '',
      sngBalance: 1000,
      supplierName: '',
      supplierId: '',
      amount: 0,
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
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

  const handleFormDataChange = (data: Partial<DentalFormData>) => {
    setFormData(prev => ({ ...prev, ...data, income: { ...prev.income, ...data.income } }));
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
            <h1 className="greeting">Dental</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <DentalQuestions
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="dental" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default DentalPage; 