import React, { useEffect, useState } from 'react';
import IncomeSection from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';

interface DentalFormData {
  clientId: boolean | null;
  whyNeedDental: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  sngEligible: string; // 'yes' | 'no' | ''
  sngBalance: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

interface DentalQuestionsProps {
  formData: DentalFormData;
  onFormDataChange: (data: Partial<DentalFormData>) => void;
}

function autoResizeTextarea(el: HTMLTextAreaElement | null) {
  if (el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    if (el.scrollHeight > 800) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  }
}

const DentalQuestions: React.FC<DentalQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['general']));

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections((prev) => new Set(prev).add(sectionId));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
    const timeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        observer.observe(section);
      });
    }, 100);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const handleInputChange = (field: keyof DentalFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof DentalFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value,
      },
    });
  };

  const handleCostChange = (index: number, field: 'amount' | 'cost', value: any) => {
    const newCosts = [...formData.costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onFormDataChange({ costs: newCosts });
  };

  const addCost = () => {
    onFormDataChange({ costs: [...formData.costs, { amount: 0, cost: '' }] });
  };

  const removeCost = (index: number) => {
    const newCosts = formData.costs.filter((_, i) => i !== index);
    onFormDataChange({ costs: newCosts });
  };

  // Calculate advance for recovery rate
  const advance = formData.sngEligible === 'yes' ? Math.max(0, formData.amount - (formData.sngBalance || 0)) : formData.amount;

  return (
    <div className="form-sections-container">
      {/* General Questions */}
      <div className="form-section-card section-visible">
        <div className="section-header">
          <h3>General Questions</h3>
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
          <label>1. Why is the client needing dental assistance?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedDental}
            onChange={e => handleInputChange('whyNeedDental', e.target.value)}
            placeholder="Please describe the client's situation..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>
        <div className="form-group">
          <label>2. Can client meet this need in any other way?</label>
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
        </div>
        <div className="form-group">
          <label>3. What reasonable steps is the client taken to improve their situation?</label>
          <textarea
            className="form-control"
            value={formData.reasonableSteps}
            onChange={e => handleInputChange('reasonableSteps', e.target.value)}
            placeholder="Describe steps taken..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>
        <div className="form-group">
          <label>4. Does the client qualify for non-recoverable SNG?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.sngEligible === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="sngEligibleYes"
                checked={formData.sngEligible === 'yes'}
                onChange={() => handleInputChange('sngEligible', formData.sngEligible === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.sngEligible === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="sngEligibleNo"
                checked={formData.sngEligible === 'no'}
                onChange={() => handleInputChange('sngEligible', formData.sngEligible === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        {formData.sngEligible === 'yes' && (
          <div className="form-group">
            <label>What is the client's SNG balance?</label>
            <div className="dollar-input">
              <input
                type="number"
                className="form-control"
                value={formData.sngBalance || 1000}
                onChange={e => handleInputChange('sngBalance', parseFloat(e.target.value) || 0)}
                placeholder="1000.00"
                step="0.01"
                min="0"
              />
            </div>
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
        isVisible={visibleSections.has('income')}
      />

      {/* Payment Section */}
      <PaymentSection
        supplierName={formData.supplierName}
        supplierId={formData.supplierId}
        amount={advance}
        totalAmount={formData.amount}
        recoveryRate={formData.recoveryRate}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        onSupplierNameChange={name => handleInputChange('supplierName', name)}
        onSupplierIdChange={id => handleInputChange('supplierId', id)}
        onAmountChange={amount => handleInputChange('amount', amount)}
        onRecoveryRateChange={rate => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={credit => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={reference => handleInputChange('paymentReference', reference)}
        sectionNumber={3}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={decision => handleInputChange('decision', decision)}
        onDecisionReasonChange={reason => handleInputChange('decisionReason', reason)}
        sectionNumber={4}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default DentalQuestions; 