import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectricityQuestions from './ElectricityQuestions';
import NoteOutput from './NoteOutput';
import EmailOutput from './EmailOutput';
import { useSettings } from '../contexts/SettingsContext';

interface ElectricityFormData {
  clientId: boolean | null;
  whyNeedPower: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  powerAccountNumber: string;
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
  emailYourName: string;
  emailPaymentDate: string;
  emailAccountName: string;
  emailAccountNumber: string;
  emailAmount: number;
}

const ElectricityPage: React.FC = () => {
  const navigate = useNavigate();
  const emailOutputRef = useRef<HTMLDivElement>(null);
  const { customHeadingFormat } = useSettings();
  
  // Get today's date in YYYY-MM-DD format for default
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEmailFieldFocus = () => {
    if (emailOutputRef.current) {
      emailOutputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const [formData, setFormData] = useState<ElectricityFormData>({
    clientId: null,
    whyNeedPower: '',
    reasonableSteps: '',
    canMeetNeedOtherWay: '',
    supplierName: '',
    supplierId: '',
    amount: 0,
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
    paymentCardNumber: '',
    powerAccountNumber: '',
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
    emailYourName: '',
    emailPaymentDate: getTodayDate(),
    emailAccountName: '',
    emailAccountNumber: '',
    emailAmount: 0,
  });

  const handleFormDataChange = (data: Partial<ElectricityFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedPower: '',
      reasonableSteps: '',
      canMeetNeedOtherWay: '',
      supplierName: '',
      supplierId: '',
      amount: 0,
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
      paymentCardNumber: '',
      powerAccountNumber: '',
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
      emailYourName: '',
      emailPaymentDate: getTodayDate(),
      emailAccountName: '',
      emailAccountNumber: '',
      emailAmount: 0,
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
            <h1 className="greeting">Electricity Assistance</h1>
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
        <ElectricityQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
          onEmailFieldFocus={handleEmailFieldFocus}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="electricity" onReset={resetForm} customHeadingFormat={customHeadingFormat} />
          <EmailOutput 
            ref={emailOutputRef}
            yourName={formData.emailYourName}
            paymentDate={formData.emailPaymentDate}
            accountName={formData.emailAccountName}
            accountNumber={formData.emailAccountNumber}
            amount={formData.emailAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default ElectricityPage; 