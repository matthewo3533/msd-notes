import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TASGrantQuestions from './TASGrantQuestions';
import NoteOutput from './NoteOutput';
import ThemeSelector from './ThemeSelector';
import { TASGrantFormData } from '../App';

interface TASGrantPageProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const TASGrantPage: React.FC<TASGrantPageProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();
  
  const getTodayDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [formData, setFormData] = useState<TASGrantFormData>({
    dateOfFirstContact: getTodayDate(),
    clientConsent: '',
    childSupportLiableCosts: '',
    childSupportAPIConsent: '',
    addressDetailsCorrect: '',
    contactDetailsCorrect: '',
    accommodationCosts: 0,
    rentBoardIncludesUtilities: '',
    homeOwnershipCostsChanged: '',
    disabilityCostsChanged: '',
    tasCostsChanged: '',
    familyTaxCreditsCorrect: '',
    incomeCorrect: '',
    assetsCorrect: '',
    relationshipDetailsCorrect: '',
    verificationReceived: '',
    deficiency: 0,
    tasRatePayable: 0,
    necessaryReasonableSteps: '',
    clientUnderstandsObligations: '',
    outcome: '',
    regrantDate: getTodayDate(),
    furtherActionNeeded: '',
    lsumSent: '',
    arrearsIssued: 0,
  });

  const handleFormDataChange = (data: Partial<TASGrantFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      dateOfFirstContact: getTodayDate(),
      clientConsent: '',
      childSupportLiableCosts: '',
      childSupportAPIConsent: '',
      addressDetailsCorrect: '',
      contactDetailsCorrect: '',
      accommodationCosts: 0,
      rentBoardIncludesUtilities: '',
      homeOwnershipCostsChanged: '',
      disabilityCostsChanged: '',
      tasCostsChanged: '',
      familyTaxCreditsCorrect: '',
      incomeCorrect: '',
      assetsCorrect: '',
      relationshipDetailsCorrect: '',
      verificationReceived: '',
      deficiency: 0,
      tasRatePayable: 0,
      necessaryReasonableSteps: '',
      clientUnderstandsObligations: '',
      outcome: '',
      regrantDate: getTodayDate(),
      furtherActionNeeded: '',
      lsumSent: '',
      arrearsIssued: 0,
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
            <h1 className="greeting">TAS Grant/Reapplication</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <TASGrantQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput formData={formData} service="tas-grant" onReset={resetForm} />
        </div>
      </div>
    </div>
  );
};

export default TASGrantPage; 