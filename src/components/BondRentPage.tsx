import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BondRentQuestions from './BondRentQuestions';
import NoteOutput from './NoteOutput';
import { BondRentFormData } from '../App';

const BondRentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BondRentFormData>({
    clientId: null,
    whyNeedAccommodation: '',
    newAddress: '',
    newAddressData: undefined,
    asZone: 0,
    weeklyRent: 0,
    tenancyStartDate: '',
    bondAmount: 0,
    rentInAdvanceAmount: 0,
    reasonableSteps: '',
    tenancyAffordable: '',
    supplierName: '',
    supplierId: '',
    bondPaymentAmount: 0,
    rentAdvancePaymentAmount: 0,
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

  const handleFormDataChange = (data: Partial<BondRentFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedAccommodation: '',
      newAddress: '',
      newAddressData: undefined,
      asZone: 0,
      weeklyRent: 0,
      tenancyStartDate: '',
      bondAmount: 0,
      rentInAdvanceAmount: 0,
      reasonableSteps: '',
      tenancyAffordable: '',
      supplierName: '',
      supplierId: '',
      bondPaymentAmount: 0,
      rentAdvancePaymentAmount: 0,
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
            <h1 className="greeting">Bond/Rent in Advance</h1>
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
        <BondRentQuestions
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput
            formData={formData}
            service="bond-rent"
            onReset={resetForm}
          />
        </div>
      </div>
    </div>
  );
};

export default BondRentPage;
