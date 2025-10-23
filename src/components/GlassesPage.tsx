import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassesQuestions from './GlassesQuestions';
import NoteOutput from './NoteOutput';
import { useSettings } from '../contexts/SettingsContext';
import { GlassesFormData } from '../App';

const GlassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
  const [formData, setFormData] = useState<GlassesFormData>({
    clientId: null,
    whyNeedGlasses: '',
    reasonableSteps: '',
    canMeetNeedOtherWay: '',
    supplierName: '',
    supplierId: '',
    amount: 280, // Default amount for glasses
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
    paymentCardNumber: '',
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

  const handleFormDataChange = (data: Partial<GlassesFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedGlasses: '',
      reasonableSteps: '',
      canMeetNeedOtherWay: '',
      supplierName: '',
      supplierId: '',
      amount: 280, // Default amount for glasses
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
    paymentCardNumber: '',
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
            <h1 className="greeting">Glasses</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <GlassesQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="glasses" onReset={resetForm} customHeadingFormat={customHeadingFormat} />
        </div>
      </div>
    </div>
  );
};

export default GlassesPage;
