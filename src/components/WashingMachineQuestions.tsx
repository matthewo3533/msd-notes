import React, { useEffect, useState } from 'react';
import IncomeSection, { IncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';
import { WashingMachineFormData } from '../App';

interface WashingMachineQuestionsProps {
  formData: WashingMachineFormData;
  onFormDataChange: (data: Partial<WashingMachineFormData>) => void;
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

const WashingMachineQuestions: React.FC<WashingMachineQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['general']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>({
    benefit: 'Benefit',
    employment: 'Employment',
    childSupport: 'Child Support',
    otherIncome: 'Other Income',
    familyTaxCredit: 'Family Tax Credit',
    childDisabilityAllowance: 'Child Disability Allowance'
  });

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

  // Auto-fill payment reference when appliance model changes
  useEffect(() => {
    if (formData.applianceModel) {
      onFormDataChange({ paymentReference: formData.applianceModel });
    }
  }, [formData.applianceModel, onFormDataChange]);

  const handleInputChange = (field: keyof WashingMachineFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof WashingMachineFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value,
      },
    });
  };

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    setIncomeLabels(labels);
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
      <div className="form-section-card section-visible" data-section="general">
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
          <label>1. Why is the client needing a washing machine?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedWashingMachine}
            onChange={e => handleInputChange('whyNeedWashingMachine', e.target.value)}
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
      </div>

      {/* Whiteware Info Section */}
      <div className="form-section-card section-visible" data-section="whiteware">
        <div className="section-header">
          <h3>Whiteware Info</h3>
        </div>
        <div className="form-group">
          <label>Household size:</label>
          <div className="radio-group">
            <label className={`radio-btn long-text ${formData.householdSize === '1-2' ? 'selected' : ''}`}>1-2 people
              <input
                type="checkbox"
                name="householdSize1-2"
                checked={formData.householdSize === '1-2'}
                onChange={() => handleInputChange('householdSize', formData.householdSize === '1-2' ? '' : '1-2')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn long-text ${formData.householdSize === '3-4' ? 'selected' : ''}`}>3-4 people
              <input
                type="checkbox"
                name="householdSize3-4"
                checked={formData.householdSize === '3-4'}
                onChange={() => handleInputChange('householdSize', formData.householdSize === '3-4' ? '' : '3-4')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn long-text ${formData.householdSize === '5+' ? 'selected' : ''}`}>5+ people
              <input
                type="checkbox"
                name="householdSize5+"
                checked={formData.householdSize === '5+'}
                onChange={() => handleInputChange('householdSize', formData.householdSize === '5+' ? '' : '5+')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Address/contact details confirmed?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.addressContactConfirmed === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="addressContactConfirmedYes"
                checked={formData.addressContactConfirmed === 'yes'}
                onChange={() => handleInputChange('addressContactConfirmed', formData.addressContactConfirmed === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.addressContactConfirmed === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="addressContactConfirmedNo"
                checked={formData.addressContactConfirmed === 'no'}
                onChange={() => handleInputChange('addressContactConfirmed', formData.addressContactConfirmed === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Space measured and item will fit?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.spaceMeasured === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="spaceMeasuredYes"
                checked={formData.spaceMeasured === 'yes'}
                onChange={() => handleInputChange('spaceMeasured', formData.spaceMeasured === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.spaceMeasured === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="spaceMeasuredNo"
                checked={formData.spaceMeasured === 'no'}
                onChange={() => handleInputChange('spaceMeasured', formData.spaceMeasured === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Appliance Model:</label>
          <input
            type="text"
            className="form-control"
            value={formData.applianceModel}
            onChange={e => handleInputChange('applianceModel', e.target.value)}
            placeholder="Enter appliance model..."
          />
        </div>
        <div className="form-group">
          <label>Appliance CA number</label>
          <input
            type="text"
            className="form-control"
            value={formData.applianceCANumber}
            onChange={e => handleInputChange('applianceCANumber', e.target.value)}
            placeholder="Enter appliance CA number..."
          />
        </div>
        <div className="form-group">
          <label>Does client have any special delivery instructions?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.specialDeliveryInstructions === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="specialDeliveryInstructionsYes"
                checked={formData.specialDeliveryInstructions === 'yes'}
                onChange={() => handleInputChange('specialDeliveryInstructions', formData.specialDeliveryInstructions === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.specialDeliveryInstructions === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="specialDeliveryInstructionsNo"
                checked={formData.specialDeliveryInstructions === 'no'}
                onChange={() => handleInputChange('specialDeliveryInstructions', formData.specialDeliveryInstructions === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
          {formData.specialDeliveryInstructions === 'yes' && (
            <div className="form-group">
              <label>Please outline the delivery instructions.</label>
              <textarea
                className="form-control"
                value={formData.deliveryInstructionsDetails || ''}
                onChange={e => handleInputChange('deliveryInstructionsDetails', e.target.value)}
                placeholder="Enter delivery instructions..."
                ref={el => autoResizeTextarea(el)}
                onInput={e => autoResizeTextarea(e.currentTarget)}
              />
            </div>
          )}
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
        paymentCardNumber={formData.paymentCardNumber}
        onSupplierNameChange={(name) => handleInputChange('supplierName', name)}
        onSupplierIdChange={(id) => handleInputChange('supplierId', id)}
        onAmountChange={(amount) => handleInputChange('amount', amount)}
        onRecoveryRateChange={(rate) => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
        onPaymentCardNumberChange={(cardNumber) => handleInputChange('paymentCardNumber', cardNumber)}
        sectionNumber={4}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={5}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default WashingMachineQuestions;
