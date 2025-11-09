import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhitewareQuestions from './WhitewareQuestions';
import NoteOutput from './NoteOutput';
import { useSettings } from '../contexts/SettingsContext';
import { WhitewareFormData } from '../App';
import { createDefaultIncomeLabels } from './IncomeSection';
import NeedsInApplication from './multi-need/NeedsInApplication';

const WhitewarePage: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
  const [formData, setFormData] = useState<WhitewareFormData>(() => ({
    clientId: null,
    whyNeedWhiteware: '',
    reasonableSteps: '',
    canMeetNeedOtherWay: '',
    supplierName: '',
    supplierId: '',
    amount: 0,
    recoveryRate: 0,
    directCredit: '',
    paymentReference: '',
    paymentCardNumber: '',
    incomeLabels: createDefaultIncomeLabels(),
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
  }));

  const handleFormDataChange = (data: Partial<WhitewareFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      clientId: null,
      whyNeedWhiteware: '',
      reasonableSteps: '',
      canMeetNeedOtherWay: '',
      supplierName: '',
      supplierId: '',
      amount: 0,
      recoveryRate: 0,
      directCredit: '',
      paymentReference: '',
      paymentCardNumber: '',
      incomeLabels: createDefaultIncomeLabels(),
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
            <h1 className="greeting">Whiteware</h1>
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
        <WhitewareQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NeedsInApplication formData={formData} needType="whiteware" />
          <NoteOutput formData={formData} service="whiteware" onReset={resetForm} customHeadingFormat={customHeadingFormat} />
        </div>
      </div>
    </div>
  );
};

export default WhitewarePage;
