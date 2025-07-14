import React, { useEffect, useState } from 'react';
import IncomeSection from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';

export interface BeddingFormData {
  clientId: boolean | null;
  whyNeedBedding: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
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
  beddingSngEligible?: string; // 'yes' | 'no' | ''
  beddingSngReason?: string; // 'Disability/Illness' | 'Child born/adopted' | ''
}

interface BeddingQuestionsProps {
  formData: BeddingFormData;
  onFormDataChange: (data: Partial<BeddingFormData>) => void;
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

const BeddingQuestions: React.FC<BeddingQuestionsProps> = ({ formData, onFormDataChange }) => {
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

  const handleInputChange = (field: keyof BeddingFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof BeddingFormData['income'], value: number) => {
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
          <label>1. Why is the client needing bedding?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedBedding}
            onChange={e => handleInputChange('whyNeedBedding', e.target.value)}
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
          <label>Does client qualify for Bedding SNG?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.beddingSngEligible === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="beddingSngEligibleYes"
                checked={formData.beddingSngEligible === 'yes'}
                onChange={() => handleInputChange('beddingSngEligible', formData.beddingSngEligible === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.beddingSngEligible === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="beddingSngEligibleNo"
                checked={formData.beddingSngEligible === 'no'}
                onChange={() => handleInputChange('beddingSngEligible', formData.beddingSngEligible === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        {formData.beddingSngEligible === 'yes' && (
          <div className="form-group">
            <label>How does client qualify?</label>
            <select
              className="form-control"
              value={formData.beddingSngReason || ''}
              onChange={e => handleInputChange('beddingSngReason', e.target.value)}
            >
              <option value="">Select reason...</option>
              <option value="Disability/Illness">Disability/Illness</option>
              <option value="Child born/adopted">Child born/adopted</option>
            </select>
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
        amount={formData.amount}
        recoveryRate={formData.recoveryRate}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        onSupplierNameChange={(name) => handleInputChange('supplierName', name)}
        onSupplierIdChange={(id) => handleInputChange('supplierId', id)}
        onAmountChange={(amount) => handleInputChange('amount', amount)}
        onRecoveryRateChange={(rate) => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
        sectionNumber={3}
        isVisible={visibleSections.has('payment')}
      />
      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={4}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default BeddingQuestions; 