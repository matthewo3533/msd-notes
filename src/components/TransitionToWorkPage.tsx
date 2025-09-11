import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransitionToWorkQuestions from './TransitionToWorkQuestions';
import NoteOutput from './NoteOutput';
import { TransitionToWorkFormData } from '../App';

const TransitionToWorkPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TransitionToWorkFormData>({
    clientId: null,
    helpType: '',
    firstPayday: '',
    whyNeedTransitionToWork: '',
    contractUploaded: '',
    petrolAssistance: '',
    startLocation: '',
    destination: '',
    returnTrip: '',
    distance: 0,
    travelCost: 0,
    employerName: '',
    startDate: '',
    hoursPerWeek: 0,
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

  const handleFormDataChange = (data: Partial<TransitionToWorkFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      helpType: '',
      firstPayday: '',
      whyNeedTransitionToWork: '',
      contractUploaded: '',
      petrolAssistance: '',
      startLocation: '',
      destination: '',
      returnTrip: '',
      distance: 0,
      travelCost: 0,
      employerName: '',
      startDate: '',
      hoursPerWeek: 0,
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
            <h1 className="greeting">Transition to Work Grant</h1>
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
        <TransitionToWorkQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="transition-to-work" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default TransitionToWorkPage;
