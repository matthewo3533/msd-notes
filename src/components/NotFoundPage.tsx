import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

interface NotFoundPageProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();

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
            <h1 className="greeting">Page Not Found</h1>
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
      
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          404 - Page Not Found
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <button 
          className="copy-btn" 
          onClick={handleBack}
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 