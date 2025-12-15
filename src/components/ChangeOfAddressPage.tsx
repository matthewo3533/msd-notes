import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeOfAddressQuestions from './ChangeOfAddressQuestions';
import NoteOutput from './NoteOutput';
import { ChangeOfAddressFormData } from '../App';
import { useSettings } from '../contexts/SettingsContext';

const ChangeOfAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
  const [formData, setFormData] = useState<ChangeOfAddressFormData>({
    generalComments: '',
    newAddress: '',
    dateOfMove: '',
    dateNotified: '',
    asZone: '',
    accommodationType: '',
    accommodationCosts: [],
    tenancyAgreementProvided: '',
    newASRate: 0,
    clientEligibleForTAS: '',
    arrearsCreated: '',
    arrearsAmount: 0,
    debtCreated: '',
    debtAmount: 0,
  });

  const handleFormDataChange = (data: Partial<ChangeOfAddressFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      generalComments: '',
      newAddress: '',
      dateOfMove: '',
      dateNotified: '',
      asZone: '',
      accommodationType: '',
      accommodationCosts: [],
      tenancyAgreementProvided: '',
      newASRate: 0,
      clientEligibleForTAS: '',
      arrearsCreated: '',
      arrearsAmount: 0,
      debtCreated: '',
      debtAmount: 0,
    });
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
            <h1 className="greeting">Change of Address</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={() => navigate('/')}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <ChangeOfAddressQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput 
            formData={formData} 
            service="change-of-address" 
            onReset={resetForm} 
            customHeadingFormat={customHeadingFormat} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChangeOfAddressPage;

