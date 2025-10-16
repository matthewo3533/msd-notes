import React, { useState, useEffect } from 'react';
import { AbsenceFromNZFormData } from '../App';
import Calendar from './Calendar';

interface AbsenceFromNZQuestionsProps {
  formData: AbsenceFromNZFormData;
  onFormDataChange: (data: Partial<AbsenceFromNZFormData>) => void;
}

const AbsenceFromNZQuestions: React.FC<AbsenceFromNZQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['general']));

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Make the first section visible immediately
    setVisibleSections(new Set(['general']));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections(prev => new Set(prev).add(sectionId));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      // Observe sections with data-section attributes
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        observer.observe(section);
      });
      
      // Also observe form-section-card elements (for reusable components)
      const formSections = document.querySelectorAll('.form-section-card');
      formSections.forEach((section) => {
        observer.observe(section);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="form-sections-container">
      <div 
        data-section="general"
        className={`form-section-card ${visibleSections.has('general') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Absence from New Zealand</h3>
          <div className="section-number">1</div>
        </div>
        
        <div className="form-group">
          <p className="form-description">
            Record details of the client's absence from New Zealand, including travel dates and benefit continuation.
          </p>
        </div>

        <div className="form-group">
          <label>Leaving Date:</label>
          <Calendar
            value={formData.leavingDate}
            onChange={(date) => onFormDataChange({ leavingDate: date })}
            placeholder="Select leaving date"
          />
        </div>

        <div className="form-group">
          <label>Return Date:</label>
          <Calendar
            value={formData.returnDate}
            onChange={(date) => onFormDataChange({ returnDate: date })}
            placeholder="Select return date"
          />
        </div>

        <div className="form-group">
          <label>Reason for Travel:</label>
          <textarea
            className="form-control"
            value={formData.reasonForTravel}
            onChange={(e) => onFormDataChange({ reasonForTravel: e.target.value })}
            placeholder="Enter reason for travel..."
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label>Benefit to Continue:</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.benefitToContinue === true ? 'selected' : ''}`}>
              Yes
              <input
                type="radio"
                name="benefitToContinue"
                checked={formData.benefitToContinue === true}
                onChange={() => onFormDataChange({ benefitToContinue: true })}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.benefitToContinue === false ? 'selected' : ''}`}>
              No
              <input
                type="radio"
                name="benefitToContinue"
                checked={formData.benefitToContinue === false}
                onChange={() => onFormDataChange({ benefitToContinue: false })}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Arrears Issued:</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.arrearsIssued === true ? 'selected' : ''}`}>
              Yes
              <input
                type="radio"
                name="arrearsIssued"
                checked={formData.arrearsIssued === true}
                onChange={() => onFormDataChange({ arrearsIssued: true })}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.arrearsIssued === false ? 'selected' : ''}`}>
              No
              <input
                type="radio"
                name="arrearsIssued"
                checked={formData.arrearsIssued === false}
                onChange={() => onFormDataChange({ arrearsIssued: false })}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {formData.arrearsIssued === true && (
          <div className="form-group">
            <label>Arrears Amount ($):</label>
            <div className="dollar-input">
              <input
                type="number"
                className="form-control"
                value={formData.arrearsAmount || ''}
                onChange={(e) => onFormDataChange({ arrearsAmount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsenceFromNZQuestions;

