import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceGrid from './ServiceGrid';
import ThemeSelector from './ThemeSelector';

export interface Service {
  id: string;
  title: string;
  emoji: string;
}

interface HomeProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const services: Service[] = [
  { id: 'food', title: 'Food', emoji: '🍽️' },
  { id: 'clothing', title: 'Clothing', emoji: '👕' },
  { id: 'electricity', title: 'Electricity Assistance', emoji: '⚡' },
  { id: 'dental', title: 'Dental', emoji: '🦷' },
  { id: 'beds', title: 'Beds', emoji: '🛏️' },
  { id: 'bedding', title: 'Bedding', emoji: '🛌' },
  { id: 'furniture', title: 'Furniture', emoji: '🛋️' },
  { id: 'glasses', title: 'Glasses', emoji: '👓' },
  { id: 'fridge', title: 'Fridge', emoji: '❄️' },
  { id: 'washing', title: 'Washing Machine', emoji: '🫧' },
  { id: 'bond', title: 'Bond/Rent in Advance', emoji: '🏠' },
  { id: 'rent', title: 'Rent Arrears', emoji: '💰' },
  { id: 'adsd', title: 'ADSD', emoji: '💵' },
  { id: 'car', title: 'Car repairs', emoji: '🚗' },
  { id: 'work', title: 'Transition to Work Grant', emoji: '💼' },
  { id: 'funeral', title: 'Assistance to attend funeral/tangi', emoji: '⚰️' },
  { id: 'stranded', title: 'Stranded Travel', emoji: '⛽' },
  { id: 'emergency', title: 'Other Emergency Payment', emoji: '🚨' },
];

const generalNotes: Service[] = [
  { id: 'tas-grant', title: 'TAS Grant/Reapplication', emoji: '📋' },
  { id: 'declare-income', title: 'Declare Income', emoji: '💰' },
];

const Home: React.FC<HomeProps> = ({ currentTheme, onThemeChange }) => {
  const navigate = useNavigate();

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/${serviceId}`);
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
            <h1 className="greeting">MSD Notes App</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        </div>
      </div>
      
      <div className="service-question">
        <h2>Hardship Assistance</h2>
      </div>
      <ServiceGrid services={services} onServiceSelect={handleServiceSelect} />
      
      <div className="service-question">
        <h2>General Notes</h2>
      </div>
      <div className="general-notes-grid">
        {generalNotes.map((note) => (
          <div
            key={note.id}
            className="service-card"
            onClick={() => handleServiceSelect(note.id)}
          >
            <span className="service-emoji">{note.emoji}</span>
            <div className="service-title">{note.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 