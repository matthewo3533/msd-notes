import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClothingQuestions from './ClothingQuestions';
import NoteOutput from './NoteOutput';

interface ClothingFormData {
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

const ClothingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClothingFormData>({
    clientId: null,
    whyNeedClothing: '',
    reasonableSteps: '',
    canMeetNeedOtherWay: '',
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

  const handleFormDataChange = (data: Partial<ClothingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedClothing: '',
      reasonableSteps: '',
      canMeetNeedOtherWay: '',
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
            <h1 className="greeting">Clothing</h1>
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
        <ClothingQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="clothing" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default ClothingPage; 