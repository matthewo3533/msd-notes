import React from 'react';
import { Service } from '../App';

interface ServiceGridProps {
  services: Service[];
  onServiceSelect: (serviceId: string) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, onServiceSelect }) => {
  return (
    <div className="services-grid">
      {services.map((service) => (
        <div
          key={service.id}
          className="service-card"
          onClick={() => onServiceSelect(service.id)}
        >
          <span className="service-emoji">{service.emoji}</span>
          <div className="service-title">{service.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid; 