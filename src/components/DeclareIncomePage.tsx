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
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <button 
              className="back-button" 
              onClick={() => navigate('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-primary)', 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ← Back
            </button>
            <h1 className="greeting">Declare Income</h1>
          </div>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="form-container">
          <DeclareIncomeQuestions 
            formData={formData} 
            onFormDataChange={handleFormDataChange} 
          />
        </div>
        
        <div className="note-container">
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