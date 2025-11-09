import React, { useEffect, useState } from 'react';
import { BondRentFormData } from '../App';
import IncomeSection, { IncomeLabels, createDefaultIncomeLabels } from './IncomeSection';
import BondRentPaymentSection from './BondRentPaymentSection';
import DecisionSection from './DecisionSection';
import Calendar from './Calendar';
import AddressInput from './AddressInput';
import FormattedTextarea from './FormattedTextarea';

interface BondRentQuestionsProps {
  formData: BondRentFormData;
  onFormDataChange: (data: Partial<BondRentFormData>) => void;
}

const BondRentQuestions: React.FC<BondRentQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['client']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>(() => {
    if (formData.incomeLabels) {
      return { ...formData.incomeLabels };
    }
    return createDefaultIncomeLabels();
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

  const handleInputChange = (field: keyof BondRentFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof BondRentFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value,
      },
    });
  };

  useEffect(() => {
    if (formData.incomeLabels) {
      setIncomeLabels({ ...formData.incomeLabels });
    } else {
      setIncomeLabels(createDefaultIncomeLabels());
    }
  }, [formData.incomeLabels]);

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    const updatedLabels = { ...labels };
    setIncomeLabels(updatedLabels);
    onFormDataChange({ incomeLabels: updatedLabels });
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
          <FormattedTextarea
            label="Why is the client needing accommodation assistance?"
            value={formData.whyNeedAccommodation}
            onChange={(value) => handleInputChange('whyNeedAccommodation', value)}
            placeholder="Explain why the client needs accommodation assistance"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <AddressInput
            value={formData.newAddress}
            onChange={(address, locationData) => {
              handleInputChange('newAddress', address);
              if (locationData) {
                handleInputChange('newAddressData', locationData);
              }
            }}
            placeholder="Enter the client's new address"
            label="What's the client's new address?"
          />
        </div>
        <div className="form-group">
          <label>AS Zone</label>
          <select
            className="form-control"
            value={formData.asZone || ''}
            onChange={e => handleInputChange('asZone', parseInt(e.target.value) || 0)}
          >
            <option value="">Select AS Zone</option>
            <option value="1">Zone 1</option>
            <option value="2">Zone 2</option>
            <option value="3">Zone 3</option>
            <option value="4">Zone 4</option>
          </select>
        </div>
        <div className="form-group">
          <label>Weekly Rent</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.weeklyRent || ''}
              onChange={e => handleInputChange('weeklyRent', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Date tenancy is starting</label>
          <Calendar
            value={formData.tenancyStartDate}
            onChange={(date) => handleInputChange('tenancyStartDate', date)}
            placeholder="Select tenancy start date"
          />
        </div>
        <div className="form-group">
          <label>How much bond does the client need help with?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.bondAmount || ''}
              onChange={e => handleInputChange('bondAmount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>How much rent in advance does the client need help with?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.rentInAdvanceAmount || ''}
              onChange={e => handleInputChange('rentInAdvanceAmount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Will this tenancy leave the client with enough leftover money to meet their weekly living costs?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.tenancyAffordable === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="tenancyAffordableYes"
                checked={formData.tenancyAffordable === 'yes'}
                onChange={() => handleInputChange('tenancyAffordable', formData.tenancyAffordable === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.tenancyAffordable === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="tenancyAffordableNo"
                checked={formData.tenancyAffordable === 'no'}
                onChange={() => handleInputChange('tenancyAffordable', formData.tenancyAffordable === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <FormattedTextarea
            label="What reasonable steps is the client taking to improve their situation?"
            value={formData.reasonableSteps}
            onChange={(value) => handleInputChange('reasonableSteps', value)}
            placeholder="Describe steps taken..."
            className="form-control"
          />
        </div>
      </div>

      {/* Tenancy Affordability Section */}
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
        sectionTitle="Tenancy Affordability"
      />

      {/* Payment Section */}
      <BondRentPaymentSection
        supplierName={formData.supplierName}
        supplierId={formData.supplierId}
        bondAmount={formData.bondAmount}
        rentAdvanceAmount={formData.rentInAdvanceAmount}
        recoveryRate={formData.recoveryRate}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        onSupplierNameChange={(name) => handleInputChange('supplierName', name)}
        onSupplierIdChange={(id) => handleInputChange('supplierId', id)}
        onBondAmountChange={(amount) => handleInputChange('bondAmount', amount)}
        onRentAdvanceAmountChange={(amount) => handleInputChange('rentInAdvanceAmount', amount)}
        onRecoveryRateChange={(rate) => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
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

export default BondRentQuestions;
