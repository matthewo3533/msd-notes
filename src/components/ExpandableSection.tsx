import React, { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  dataSection?: string;
  isVisible?: boolean;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  className = '',
  dataSection,
  isVisible = true,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const ChevronDownIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  );

  return (
    <div 
      className={`form-section-card ${isVisible ? 'section-visible' : ''} ${!isExpanded ? 'collapsed' : ''} ${className}`}
      data-section={dataSection}
    >
      <div className="section-header">
        <div className="section-header-left">
          <h3>{title}</h3>
        </div>
        <div className="section-header-right">
          <button
            className={`expand-collapse-btn ${!isExpanded ? 'collapsed' : ''}`}
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default ExpandableSection;
