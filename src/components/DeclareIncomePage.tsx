import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import DeclareIncomeQuestions from './DeclareIncomeQuestions';
import NoteOutput from './NoteOutput';
import { DeclareIncomeFormData } from '../App';

interface DeclareIncomePageProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const DeclareIncomePage: React.FC<DeclareIncomePageProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeclareIncomeFormData>({
    weeks: []
  });

  const handleFormDataChange = (data: Partial<DeclareIncomeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleReset = () => {
    setFormData({ weeks: [] });
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">Declare Income</h1>
          </div>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={() => navigate('/')}>
          ← Back to Services
        </button>
      </div>
      
      <div className="food-layout">
        <DeclareIncomeQuestions 
          formData={formData} 
          onFormDataChange={handleFormDataChange} 
        />
        <div className="note-section">
          <NoteOutput 
            formData={formData} 
            service="declare-income" 
            onReset={handleReset} 
          />
        </div>
      </div>
    </div>
  );
};

export default DeclareIncomePage; 