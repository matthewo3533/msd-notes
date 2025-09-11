import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Service {
  id: string;
  title: string;
  emoji: string;
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
  { id: 'rent-arrears', title: 'Rent Arrears', emoji: '💰' },
  { id: 'adsd', title: 'ADSD', emoji: '💵' },
  { id: 'car', title: 'Car repairs', emoji: '🚗' },
  { id: 'work', title: 'Transition to Work Grant', emoji: '💼' },
  { id: 'funeral', title: 'Assistance to Attend Funeral', emoji: '⚰️' },
  { id: 'stranded-travel', title: 'Stranded Travel', emoji: '⛽' },
  { id: 'emergency', title: 'Other Emergency Payment', emoji: '🚨' },
];

const generalNotes: Service[] = [
  { id: 'tas-grant', title: 'TAS Grant/Reapplication', emoji: '📋' },
  { id: 'declare-income', title: 'Declare Income', emoji: '💰' },
  { id: 'petrol-calculator', title: 'Petrol Cost Calculator', emoji: '⛽' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const generalNotesRef = useRef<HTMLDivElement>(null);

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/${serviceId}`);
  };

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe the service grids
    if (servicesGridRef.current) {
      observer.observe(servicesGridRef.current);
    }
    if (generalNotesRef.current) {
      observer.observe(generalNotesRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <div className="service-question">
        <h2>Hardship Assistance</h2>
      </div>
      <div ref={servicesGridRef} className="services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => handleServiceSelect(service.id)}
          >
            <span className="service-emoji">{service.emoji}</span>
            <div className="service-title">{service.title}</div>
          </div>
        ))}
      </div>
      
      <div className="service-question">
        <h2>General Notes</h2>
      </div>
      <div ref={generalNotesRef} className="general-notes-grid">
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