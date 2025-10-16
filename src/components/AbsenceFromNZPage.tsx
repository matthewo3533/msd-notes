import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AbsenceFromNZQuestions from './AbsenceFromNZQuestions';
import NoteOutput from './NoteOutput';
import { AbsenceFromNZFormData } from '../App';

const AbsenceFromNZPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AbsenceFromNZFormData>({
    leavingDate: '',
    returnDate: '',
    reasonForTravel: '',
    benefitToContinue: null,
    arrearsIssued: null,
    arrearsAmount: 0
  });

  const handleFormDataChange = (data: Partial<AbsenceFromNZFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleReset = () => {
    setFormData({
      leavingDate: '',
      returnDate: '',
      reasonForTravel: '',
      benefitToContinue: null,
      arrearsIssued: null,
      arrearsAmount: 0
    });
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">Absence from NZ</h1>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={() => navigate('/')}>
          ← Back to Services
        </button>
      </div>
      
      <div className="food-layout">
        <AbsenceFromNZQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange} 
        />
        <div className="note-section">
          <NoteOutput 
            formData={formData} 
            service="absence-from-nz" 
            onReset={handleReset} 
          />
        </div>
      </div>
    </div>
  );
};

export default AbsenceFromNZPage;

