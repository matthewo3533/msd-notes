import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

interface NotFoundPageProps {
  darkMode: boolean;
  onToggleDarkMode: (darkMode: boolean) => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  const getServiceTitle = (id: string) => {
    const serviceTitles: { [key: string]: string } = {
      electricity: 'Electricity Assistance',
      dental: 'Dental',
      beds: 'Beds',
      bedding: 'Bedding',
      furniture: 'Furniture',
      glasses: 'Glasses',
      fridge: 'Fridge',
      washing: 'Washing Machine',
      bond: 'Bond/Rent in Advance',
      rent: 'Rent Arrears',
      adsd: 'ADSD',
      car: 'Car repairs',
      work: 'Transition to Work Grant',
      funeral: 'Assistance to attend funeral/tangi',
      stranded: 'Stranded Travel',
      emergency: 'Other Emergency Payment',
    };
    return serviceTitles[id] || 'Unknown Service';
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
            <h1 className="greeting">{serviceId ? getServiceTitle(serviceId) : 'Page Not Found'}</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </div>
      </div>
      
      <div className="questions-container">
        <h2>Service: {serviceId ? getServiceTitle(serviceId) : 'Not Found'}</h2>
        <p>This service is not yet implemented. Please select Food or Clothing for now.</p>
        <button 
          className="copy-btn" 
          onClick={handleBack}
          style={{ marginTop: '1rem' }}
        >
          Back to Services
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 