import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BedsQuestions from './BedsQuestions';
import NoteOutput from './NoteOutput';
import DarkModeToggle from './DarkModeToggle';
import { BedsFormData } from './BedsQuestions';

interface BedsPageProps {
  darkMode: boolean;
  onToggleDarkMode: (darkMode: boolean) => void;
}

const BedsPage: React.FC<BedsPageProps> = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BedsFormData>({
    clientId: null,
    whyNeedBeds: '',
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
      familyTaxCredit: 0,
      childSupport: 0,
      childDisabilityAllowance: 0,
      otherIncome: 0,
    },
    costs: [],
    decision: '',
    decisionReason: '',
  });

  const handleFormDataChange = (data: Partial<BedsFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedBeds: '',
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
            <h1 className="greeting">Beds</h1>
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
        <BedsQuestions
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="beds" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default BedsPage; 