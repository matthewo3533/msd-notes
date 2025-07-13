import React, { useState, useEffect, useRef } from 'react';
import IncomeSection from './IncomeSection';
import DecisionSection from './DecisionSection';
import { FoodFormData } from '../App';

interface FoodQuestionsProps {
  formData: FoodFormData;
  onFormDataChange: (data: Partial<FoodFormData>) => void;
  onBack: () => void;
}

const FoodQuestions: React.FC<FoodQuestionsProps> = ({ formData, onFormDataChange, onBack }) => {
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [animatingQuestions, setAnimatingQuestions] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
            } else {
              // For reusable components without data-section, add the section-visible class directly
              entry.target.classList.add('section-visible');
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

  const handleSkip = (questionKey: string) => {
    setAnimatingQuestions(prev => new Set(prev).add(questionKey));
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setSkippedQuestions(prev => new Set(prev).add(questionKey));
      setAnimatingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionKey);
        return newSet;
      });
    }, 300);
  };

  const handleRestore = (questionKey: string) => {
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionKey);
      return newSet;
    });
  };

  const handleInputChange = (field: keyof FoodFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof FoodFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value
      }
    });
  };

  const handleCostChange = (index: number, field: 'amount' | 'cost', value: any) => {
    const newCosts = [...formData.costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onFormDataChange({ costs: newCosts });
  };

  const addCost = () => {
    onFormDataChange({
      costs: [...formData.costs, { amount: 0, cost: '' }]
    });
  };

  const removeCost = (index: number) => {
    const newCosts = formData.costs.filter((_, i) => i !== index);
    onFormDataChange({ costs: newCosts });
  };

  return (
    <div className="form-sections-container">
      <button className="copy-btn" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        ← Back to Services
      </button>

      {/* General Questions Section */}
      <div 
        ref={(el) => { sectionRefs.current['general'] = el; }}
        data-section="general"
        className={`form-section-card ${visibleSections.has('general') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>General Questions</h3>
          <div className="section-number">1</div>
        </div>
        
        <div className="form-group">
          <label>Has the client been ID'd?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.clientId === true ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="clientIdYes"
                checked={formData.clientId === true}
                onChange={() => handleInputChange('clientId', formData.clientId === true ? null : true)}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.clientId === false ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="clientIdNo"
                checked={formData.clientId === false}
                onChange={() => handleInputChange('clientId', formData.clientId === false ? null : false)}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {!skippedQuestions.has('whyNeedFood') && (
          <div className={`form-group ${animatingQuestions.has('whyNeedFood') ? 'question-skipped' : ''}`}>
            <label>1. Why is the client needing food?</label>
            <textarea
              className="form-control"
              value={formData.whyNeedFood}
              onChange={(e) => handleInputChange('whyNeedFood', e.target.value)}
              placeholder="Please describe the client's situation..."
            />
            <button className="skip-btn" onClick={() => handleSkip('whyNeedFood')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('whyNeedFood') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('whyNeedFood')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {!skippedQuestions.has('foodAmountRequested') && (
          <div className={`form-group ${animatingQuestions.has('foodAmountRequested') ? 'question-skipped' : ''}`}>
            <label>2. How much food is the client requesting?</label>
            <div className="dollar-input">
              <input
                type="number"
                className="form-control"
                value={formData.foodAmountRequested || ''}
                onChange={(e) => handleInputChange('foodAmountRequested', parseFloat(e.target.value) || 0)}
                placeholder="$0.00"
                step="0.01"
                min="0"
              />
            </div>
            <button className="skip-btn" onClick={() => handleSkip('foodAmountRequested')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('foodAmountRequested') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('foodAmountRequested')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {!skippedQuestions.has('canMeetNeedOtherWay') && (
          <div className={`form-group ${animatingQuestions.has('canMeetNeedOtherWay') ? 'question-skipped' : ''}`}>
            <label>3. Can client meet this need in any other way?</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.canMeetNeedOtherWay === 'yes' ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  name="canMeetNeedOtherWayYes"
                  checked={formData.canMeetNeedOtherWay === 'yes'}
                  onChange={() => handleInputChange('canMeetNeedOtherWay', formData.canMeetNeedOtherWay === 'yes' ? '' : 'yes')}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.canMeetNeedOtherWay === 'no' ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
                  name="canMeetNeedOtherWayNo"
                  checked={formData.canMeetNeedOtherWay === 'no'}
                  onChange={() => handleInputChange('canMeetNeedOtherWay', formData.canMeetNeedOtherWay === 'no' ? '' : 'no')}
                  className="visually-hidden"
                />
              </label>
            </div>
            <button className="skip-btn" onClick={() => handleSkip('canMeetNeedOtherWay')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('canMeetNeedOtherWay') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('canMeetNeedOtherWay')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {!skippedQuestions.has('currentFoodBalance') && (
          <div className={`form-group ${animatingQuestions.has('currentFoodBalance') ? 'question-skipped' : ''}`}>
            <label>4. What is the client's current food balance?</label>
            <div className="dollar-input">
              <input
                type="number"
                className="form-control"
                value={formData.currentFoodBalance || ''}
                onChange={(e) => handleInputChange('currentFoodBalance', parseFloat(e.target.value) || 0)}
                placeholder="$0.00"
                step="0.01"
                min="0"
              />
            </div>
            <button className="skip-btn" onClick={() => handleSkip('currentFoodBalance')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('currentFoodBalance') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('currentFoodBalance')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {formData.currentFoodBalance < 30 && formData.currentFoodBalance > 0 && !skippedQuestions.has('hardshipUnforeseen') && (
          <div className={`form-group ${animatingQuestions.has('hardshipUnforeseen') ? 'question-skipped' : ''}`}>
            <label>4.5. Is client in hardship due to an unforeseen circumstance?</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.hardshipUnforeseen === 'yes' ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  name="hardshipUnforeseenYes"
                  checked={formData.hardshipUnforeseen === 'yes'}
                  onChange={() => handleInputChange('hardshipUnforeseen', formData.hardshipUnforeseen === 'yes' ? '' : 'yes')}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.hardshipUnforeseen === 'no' ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
                  name="hardshipUnforeseenNo"
                  checked={formData.hardshipUnforeseen === 'no'}
                  onChange={() => handleInputChange('hardshipUnforeseen', formData.hardshipUnforeseen === 'no' ? '' : 'no')}
                  className="visually-hidden"
                />
              </label>
            </div>
            <button className="skip-btn" onClick={() => handleSkip('hardshipUnforeseen')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('hardshipUnforeseen') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('hardshipUnforeseen')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {formData.hardshipUnforeseen === 'yes' && !skippedQuestions.has('unforeseenCircumstance') && (
          <div className={`form-group ${animatingQuestions.has('unforeseenCircumstance') ? 'question-skipped' : ''}`}>
            <label>4.6. What is the unforeseen circumstance?</label>
            <textarea
              className="form-control"
              value={formData.unforeseenCircumstance}
              onChange={(e) => handleInputChange('unforeseenCircumstance', e.target.value)}
              placeholder="Please describe the unforeseen circumstance..."
            />
            <button className="skip-btn" onClick={() => handleSkip('unforeseenCircumstance')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('unforeseenCircumstance') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('unforeseenCircumstance')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}

        {!skippedQuestions.has('reasonableSteps') && (
          <div className={`form-group ${animatingQuestions.has('reasonableSteps') ? 'question-skipped' : ''}`}>
            <label>5. What reasonable steps is the client taken to improve their situation?</label>
            <textarea
              className="form-control"
              value={formData.reasonableSteps}
              onChange={(e) => handleInputChange('reasonableSteps', e.target.value)}
              placeholder="Describe steps taken..."
            />
            <button className="skip-btn" onClick={() => handleSkip('reasonableSteps')}>
              Skip this question
            </button>
          </div>
        )}

        {skippedQuestions.has('reasonableSteps') && (
          <div className="form-group question-restored">
            <button className="skip-btn restore" onClick={() => handleRestore('reasonableSteps')}>
              Question skipped. Click to restore
            </button>
          </div>
        )}
      </div>

      {/* Income Section */}
      <IncomeSection
        income={formData.income}
        costs={formData.costs}
        onIncomeChange={handleIncomeChange}
        onCostChange={handleCostChange}
        onAddCost={addCost}
        onRemoveCost={removeCost}
        sectionNumber={2}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={3}
      />
    </div>
  );
};

export default FoodQuestions; 