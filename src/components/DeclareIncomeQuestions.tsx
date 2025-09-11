import React, { useState, useEffect } from 'react';
import { DeclareIncomeFormData } from '../App';
import Calendar from './Calendar';

interface DeclareIncomeQuestionsProps {
  formData: DeclareIncomeFormData;
  onFormDataChange: (data: Partial<DeclareIncomeFormData>) => void;
}

const DeclareIncomeQuestions: React.FC<DeclareIncomeQuestionsProps> = ({ formData, onFormDataChange }) => {
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

  const addWeek = () => {
    const newWeek = {
      id: `week-${Date.now()}`,
      weekBeginning: '',
      incomeSources: []
    };
    onFormDataChange({
      weeks: [...formData.weeks, newWeek]
    });
  };

  const removeWeek = (weekId: string) => {
    onFormDataChange({
      weeks: formData.weeks.filter(week => week.id !== weekId)
    });
  };

  const updateWeek = (weekId: string, updates: Partial<DeclareIncomeFormData['weeks'][0]>) => {
    onFormDataChange({
      weeks: formData.weeks.map(week => 
        week.id === weekId ? { ...week, ...updates } : week
      )
    });
  };

  const addIncomeSource = (weekId: string) => {
    const newIncomeSource = {
      id: `income-${Date.now()}`,
      type: 'hourly' as const,
      description: '',
      hoursWorked: 0,
      hourlyRate: 0
    };
    
    updateWeek(weekId, {
      incomeSources: [...formData.weeks.find(w => w.id === weekId)!.incomeSources, newIncomeSource]
    });
  };

  const removeIncomeSource = (weekId: string, incomeSourceId: string) => {
    const week = formData.weeks.find(w => w.id === weekId);
    if (week) {
      updateWeek(weekId, {
        incomeSources: week.incomeSources.filter(source => source.id !== incomeSourceId)
      });
    }
  };

  const updateIncomeSource = (weekId: string, incomeSourceId: string, updates: Partial<DeclareIncomeFormData['weeks'][0]['incomeSources'][0]>) => {
    const week = formData.weeks.find(w => w.id === weekId);
    if (week) {
      updateWeek(weekId, {
        incomeSources: week.incomeSources.map(source => 
          source.id === incomeSourceId ? { ...source, ...updates } : source
        )
      });
    }
  };

  const getWeekBeginningDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      const date = new Date(year, month, day);
      
      // Get the Monday of that week
      const dayOfWeek = date.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(date);
      monday.setDate(date.getDate() + mondayOffset);
      
      const dayStr = monday.getDate().toString().padStart(2, '0');
      const monthStr = (monday.getMonth() + 1).toString().padStart(2, '0');
      const yearStr = monday.getFullYear();
      
      return `${dayStr}/${monthStr}/${yearStr}`;
    }
    return dateString;
  };

  const calculateTotalForWeek = (week: DeclareIncomeFormData['weeks'][0]) => {
    return week.incomeSources.reduce((total, source) => {
      if (source.type === 'hourly' && source.hoursWorked && source.hourlyRate) {
        return total + (source.hoursWorked * source.hourlyRate);
      } else if (source.type === 'lump-sum' && source.lumpSumAmount) {
        return total + source.lumpSumAmount;
      }
      return total;
    }, 0);
  };

  return (
    <div className="form-sections-container">
      <div 
        data-section="general"
        className={`form-section-card ${visibleSections.has('general') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Declare Income</h3>
          <div className="section-number">1</div>
        </div>
        
        <div className="form-group">
          <p className="form-description">
            Use this form to declare income for multiple weeks. You can add multiple income sources per week, 
            including hourly rates and flat amount payments.
          </p>
        </div>

        {formData.weeks.length === 0 && (
          <div className="form-group">
            <div className="empty-state">
              <p>No weeks added yet. Click "Add Week" to get started.</p>
            </div>
          </div>
        )}

        {formData.weeks.map((week, weekIndex) => (
          <div key={week.id} className="week-section">
            <div className="week-header">
              <h4>Week {weekIndex + 1}</h4>
              <button 
                className="remove-btn"
                onClick={() => removeWeek(week.id)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Remove Week
              </button>
            </div>

            <div className="form-group">
              <label>Week Beginning:</label>
              <Calendar
                value={week.weekBeginning}
                onChange={(date) => {
                  updateWeek(week.id, { weekBeginning: date });
                }}
                placeholder="Select week beginning date"
              />
              {week.weekBeginning && (
                <p className="week-display">
                  Week Beginning {getWeekBeginningDate(week.weekBeginning)}
                </p>
              )}
            </div>

            <div className="income-sources-section">
              <div className="section-subheader">
                <h5>Income Sources</h5>
                <button 
                  className="add-btn"
                  onClick={() => addIncomeSource(week.id)}
                  style={{
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  + Add Income Source
                </button>
              </div>

              {week.incomeSources.length === 0 && (
                <div className="empty-state">
                  <p>No income sources added for this week.</p>
                </div>
              )}

              {week.incomeSources.map((incomeSource, sourceIndex) => (
                <div key={incomeSource.id} className="income-source-card">
                  <div className="income-source-header">
                    <h6>Income Source {sourceIndex + 1}</h6>
                    <button 
                      className="remove-btn"
                      onClick={() => removeIncomeSource(week.id, incomeSource.id)}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--text-primary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={incomeSource.description}
                      onChange={(e) => updateIncomeSource(week.id, incomeSource.id, { description: e.target.value })}
                      placeholder="e.g., Main job, Side hustle, Contract work"
                    />
                  </div>

                  <div className="form-group">
                    <label>Income Type:</label>
                    <div className="radio-group">
                      <label className={`radio-btn ${incomeSource.type === 'hourly' ? 'selected' : ''}`}>
                        Hourly Rate
                        <input
                          type="radio"
                          name={`incomeType-${incomeSource.id}`}
                          checked={incomeSource.type === 'hourly'}
                          onChange={() => updateIncomeSource(week.id, incomeSource.id, { type: 'hourly' })}
                          className="visually-hidden"
                        />
                      </label>
                      <label className={`radio-btn ${incomeSource.type === 'lump-sum' ? 'selected' : ''}`}>
                        Flat Amount
                        <input
                          type="radio"
                          name={`incomeType-${incomeSource.id}`}
                          checked={incomeSource.type === 'lump-sum'}
                          onChange={() => updateIncomeSource(week.id, incomeSource.id, { type: 'lump-sum' })}
                          className="visually-hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {incomeSource.type === 'hourly' && (
                    <>
                      <div className="form-group">
                        <label>Hours Worked:</label>
                        <input
                          type="number"
                          className="form-control"
                          value={incomeSource.hoursWorked || ''}
                          onChange={(e) => updateIncomeSource(week.id, incomeSource.id, { hoursWorked: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          step="0.5"
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Hourly Rate ($):</label>
                        <div className="dollar-input">
                          <input
                            type="number"
                            className="form-control"
                            value={incomeSource.hourlyRate || ''}
                            onChange={(e) => updateIncomeSource(week.id, incomeSource.id, { hourlyRate: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {incomeSource.type === 'lump-sum' && (
                    <div className="form-group">
                      <label>Flat Amount ($):</label>
                      <div className="dollar-input">
                        <input
                          type="number"
                          className="form-control"
                          value={incomeSource.lumpSumAmount || ''}
                          onChange={(e) => updateIncomeSource(week.id, incomeSource.id, { lumpSumAmount: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  )}

                  {incomeSource.type === 'hourly' && incomeSource.hoursWorked && incomeSource.hourlyRate && (
                    <div className="income-calculator">
                      <p>
                        <strong>Calculated Income:</strong> ${(incomeSource.hoursWorked * incomeSource.hourlyRate).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {week.incomeSources.length > 0 && (
                <div className="week-total">
                  <h5>Week Total: ${calculateTotalForWeek(week).toFixed(2)}</h5>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="form-group">
          <button 
            className="add-week-btn"
            onClick={addWeek}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              width: '100%',
              marginTop: '1rem'
            }}
          >
            + Add Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclareIncomeQuestions; 