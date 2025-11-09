import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BedsQuestions from './BedsQuestions';
import NoteOutput from './NoteOutput';
import { useSettings } from '../contexts/SettingsContext';
import { IncomeLabels, createDefaultIncomeLabels } from './IncomeSection';
import NeedsInApplication from './multi-need/NeedsInApplication';

interface BedsFormData {
  clientId: boolean | null;
  whyNeedBeds: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  incomeLabels?: IncomeLabels;
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

const BedsPage: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
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
    paymentCardNumber: '',
    income: {
      benefit: 0,
      employment: 0,
      familyTaxCredit: 0,
      childSupport: 0,
      childDisabilityAllowance: 0,
      otherIncome: 0,
    },
    incomeLabels: createDefaultIncomeLabels(),
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
      paymentCardNumber: '',
      income: {
        benefit: 0,
        employment: 0,
        familyTaxCredit: 0,
        childSupport: 0,
        childDisabilityAllowance: 0,
        otherIncome: 0,
      },
      incomeLabels: createDefaultIncomeLabels(),
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
          <NeedsInApplication formData={formData} needType="beds" />
          <NoteOutput formData={formData} service="beds" onReset={resetForm} customHeadingFormat={customHeadingFormat} />
        </div>
      </div>
    </div>
  );
};

export default BedsPage; 