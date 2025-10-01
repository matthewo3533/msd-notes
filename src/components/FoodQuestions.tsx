import React, { useState, useEffect, useRef } from 'react';
import IncomeSection, { IncomeLabels } from './IncomeSection';
import DecisionSection from './DecisionSection';
import FoodPaymentSection from './FoodPaymentSection';
import FormattedTextarea from './FormattedTextarea';
import { FoodFormData } from '../App';

interface FoodQuestionsProps {
  formData: FoodFormData;
  onFormDataChange: (data: Partial<FoodFormData>) => void;
}

const FoodQuestions: React.FC<FoodQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>({
    benefit: 'Benefit',
    employment: 'Employment',
    childSupport: 'Child Support',
    otherIncome: 'Other Income',
    familyTaxCredit: 'Family Tax Credit',
    childDisabilityAllowance: 'Child Disability Allowance'
  });
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

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    setIncomeLabels(labels);
  };

  // Auto-fill Total Cost with foodAmountRequested
  useEffect(() => {
    if (formData.foodAmountRequested !== undefined && formData.foodAmountRequested !== formData.amount) {
      onFormDataChange({ amount: formData.foodAmountRequested });
    }
  }, [formData.foodAmountRequested]);

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

        <div className="form-group">
          <FormattedTextarea
            label="1. Why is the client needing food?"
            value={formData.whyNeedFood}
            onChange={(value) => handleInputChange('whyNeedFood', value)}
            placeholder="Please describe the client's situation..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>2. How much food is the client requesting?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.foodAmountRequested || ''}
              onChange={(e) => handleInputChange('foodAmountRequested', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>



        <div className="form-group">
          <label>3. What is the client's current food balance?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.currentFoodBalance || ''}
              onChange={(e) => handleInputChange('currentFoodBalance', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {formData.currentFoodBalance < 30 && formData.currentFoodBalance > 0 && (
          <div className="form-group">
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
          </div>
        )}

        {formData.hardshipUnforeseen === 'yes' && (
          <div className="form-group">
            <FormattedTextarea
              label="4.6. What is the unforeseen circumstance?"
              value={formData.unforeseenCircumstance}
              onChange={(value) => handleInputChange('unforeseenCircumstance', value)}
              placeholder="Please describe the unforeseen circumstance..."
              className="form-control"
            />
          </div>
        )}

        <div className="form-group">
          <FormattedTextarea
            label="5. What reasonable steps is the client taken to improve their situation?"
            value={formData.reasonableSteps}
            onChange={(value) => handleInputChange('reasonableSteps', value)}
            placeholder="Describe steps taken..."
            className="form-control"
          />
        </div>
      </div>

      {/* Income Section */}
      <IncomeSection
        income={formData.income}
        incomeLabels={incomeLabels}
        costs={formData.costs}
        onIncomeChange={handleIncomeChange}
        onIncomeLabelsChange={handleIncomeLabelsChange}
        onCostChange={handleCostChange}
        onAddCost={addCost}
        onRemoveCost={removeCost}
        isVisible={visibleSections.has('income')}
      />

      {/* Payment Section */}
      <FoodPaymentSection
        amount={formData.amount}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        paymentCardNumber={formData.paymentCardNumber}
        onAmountChange={(amount) => handleInputChange('amount', amount)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
        onPaymentCardNumberChange={(cardNumber) => handleInputChange('paymentCardNumber', cardNumber)}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default FoodQuestions; 