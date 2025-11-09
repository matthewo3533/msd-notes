import React, { useEffect, useState } from 'react';
import IncomeSection, { IncomeLabels, createDefaultIncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';
import ExpandableSection from './ExpandableSection';
import FormattedTextarea from './FormattedTextarea';

interface ElectricityFormData {
  clientId: boolean | null;
  whyNeedPower: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string; // 'yes' | 'no' | ''
  paymentReference: string;
  paymentCardNumber: string;
  powerAccountNumber: string;
  incomeLabels?: IncomeLabels;
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
  emailYourName: string;
  emailPaymentDate: string;
  emailAccountName: string;
  emailAccountNumber: string;
  emailAmount: number;
}

export interface ElectricityQuestionsProps {
  formData: ElectricityFormData;
  onFormDataChange: (data: Partial<ElectricityFormData>) => void;
  onEmailFieldFocus?: () => void;
}

const ElectricityQuestions: React.FC<ElectricityQuestionsProps> = ({ 
  formData, 
  onFormDataChange, 
  onEmailFieldFocus 
}) => {
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

  // When powerAccountNumber changes, update paymentReference
  useEffect(() => {
    if (formData.powerAccountNumber !== formData.paymentReference) {
      onFormDataChange({ paymentReference: formData.powerAccountNumber });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.powerAccountNumber]);

  // Autofill email fields from payment section
  useEffect(() => {
    if (formData.paymentReference !== formData.emailAccountNumber) {
      onFormDataChange({ emailAccountNumber: formData.paymentReference });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.paymentReference]);

  useEffect(() => {
    if (formData.amount !== formData.emailAmount) {
      onFormDataChange({ emailAmount: formData.amount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.amount]);

  const handleInputChange = (field: keyof ElectricityFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof ElectricityFormData['income'], value: number) => {
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
      <ExpandableSection
        title="General Questions"
        dataSection="client"
        isVisible={visibleSections.has('client')}
        defaultExpanded={true}
      >
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
            label="1. Why is the client needing power assistance?"
            value={formData.whyNeedPower}
            onChange={(value) => handleInputChange('whyNeedPower', value)}
            placeholder="Please describe the client's situation..."
            className="form-control"
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
          <FormattedTextarea
            label="3. What reasonable steps is the client taken to improve their situation?"
            value={formData.reasonableSteps}
            onChange={(value) => handleInputChange('reasonableSteps', value)}
            placeholder="Describe steps taken..."
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>4. What is the client's power account number?</label>
          <input
            type="text"
            className="form-control"
            value={formData.powerAccountNumber || ''}
            onChange={e => handleInputChange('powerAccountNumber', e.target.value)}
            placeholder="Enter power account number"
          />
        </div>
      </ExpandableSection>

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
      <PaymentSection
        supplierName={formData.supplierName}
        supplierId={formData.supplierId}
        amount={formData.amount}
        recoveryRate={formData.recoveryRate}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        paymentCardNumber={formData.paymentCardNumber}
        onSupplierNameChange={name => handleInputChange('supplierName', name)}
        onSupplierIdChange={id => handleInputChange('supplierId', id)}
        onAmountChange={amount => handleInputChange('amount', amount)}
        onRecoveryRateChange={rate => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={credit => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={reference => handleInputChange('paymentReference', reference)}
        onPaymentCardNumberChange={cardNumber => handleInputChange('paymentCardNumber', cardNumber)}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={decision => handleInputChange('decision', decision)}
        onDecisionReasonChange={reason => handleInputChange('decisionReason', reason)}
        isVisible={visibleSections.has('decision')}
      />

      {/* Email for Power Company Section */}
      <ExpandableSection
        title="Email for power company"
        dataSection="email"
        isVisible={visibleSections.has('email')}
        defaultExpanded={false}
      >
        <div className="form-group">
          <label>Your name:</label>
          <input
            type="text"
            className="form-control"
            value={formData.emailYourName || ''}
            onChange={e => handleInputChange('emailYourName', e.target.value)}
            onFocus={onEmailFieldFocus}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Payment date:</label>
          <input
            type="date"
            className="form-control"
            value={formData.emailPaymentDate || ''}
            onChange={e => handleInputChange('emailPaymentDate', e.target.value)}
            onFocus={onEmailFieldFocus}
          />
        </div>

        <div className="form-group">
          <label>Account name:</label>
          <input
            type="text"
            className="form-control"
            value={formData.emailAccountName || ''}
            onChange={e => handleInputChange('emailAccountName', e.target.value)}
            onFocus={onEmailFieldFocus}
            placeholder="Enter account name"
          />
        </div>

        <div className="form-group">
          <label>Account number:</label>
          <input
            type="text"
            className="form-control"
            value={formData.emailAccountNumber || ''}
            onChange={e => handleInputChange('emailAccountNumber', e.target.value)}
            onFocus={onEmailFieldFocus}
            placeholder="Account number"
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.emailAmount || ''}
              onChange={e => handleInputChange('emailAmount', parseFloat(e.target.value) || 0)}
              onFocus={onEmailFieldFocus}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default ElectricityQuestions; 