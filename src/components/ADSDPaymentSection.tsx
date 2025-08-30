import React, { useEffect, useRef, useState } from 'react';

interface ADSDPaymentSectionProps {
  bankAccount: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  onBankAccountChange: (account: string) => void;
  onAmountChange: (amount: number) => void;
  onRecoveryRateChange: (rate: number) => void;
  onDirectCreditChange: (credit: string) => void;
  onPaymentReferenceChange: (reference: string) => void;
  sectionNumber?: number;
  isVisible?: boolean;
}

function roundToNearest50Cents(value: number) {
  return Math.round(value * 2) / 2;
}

const ADSDPaymentSection: React.FC<ADSDPaymentSectionProps> = ({
  bankAccount,
  amount,
  recoveryRate,
  directCredit,
  paymentReference,
  onBankAccountChange,
  onAmountChange,
  onRecoveryRateChange,
  onDirectCreditChange,
  onPaymentReferenceChange,
  sectionNumber = 3,
  isVisible = false,
}) => {
  // Track if user has manually changed recovery rate
  const [userOverridden, setUserOverridden] = useState(false);
  const prevAmount = useRef(amount);

  useEffect(() => {
    // If amount changes and user hasn't overridden, auto-calculate recovery rate
    if (!userOverridden && amount > 0) {
      const calculated = roundToNearest50Cents(amount / 104);
      if (calculated !== recoveryRate) {
        onRecoveryRateChange(calculated);
      }
    }
    prevAmount.current = amount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  // If user manually changes recovery rate, set override flag
  const handleRecoveryRateChange = (value: number) => {
    setUserOverridden(true);
    onRecoveryRateChange(value);
  };

  // If user clears the recovery rate, allow auto-calc again
  useEffect(() => {
    if (recoveryRate === 0) {
      setUserOverridden(false);
    }
  }, [recoveryRate]);

  // Format recovery rate for display
  const displayRecoveryRate =
    recoveryRate === 0 || recoveryRate === undefined || isNaN(recoveryRate)
      ? ''
      : recoveryRate.toFixed(2);

  return (
    <div className={`form-section-card ${isVisible ? 'section-visible' : ''}`} data-section="payment">
      <div className="section-header">
        <h3>Payment</h3>
        <div className="section-number">{sectionNumber}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Bank Account</label>
          <input
            type="text"
            className="form-control"
            value={bankAccount}
            onChange={(e) => onBankAccountChange(e.target.value)}
            placeholder="Bank Account"
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={amount || ''}
              onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Recovery rate</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={displayRecoveryRate}
              onChange={(e) => handleRecoveryRateChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Direct Credit?</label>
        <div className="radio-group">
          <label className={`radio-btn ${directCredit === 'yes' ? 'selected' : ''}`}>Yes
            <input
              type="checkbox"
              name="directCreditYes"
              checked={directCredit === 'yes'}
              onChange={() => onDirectCreditChange(directCredit === 'yes' ? '' : 'yes')}
              className="visually-hidden"
            />
          </label>
          <label className={`radio-btn ${directCredit === 'no' ? 'selected' : ''}`}>No
            <input
              type="checkbox"
              name="directCreditNo"
              checked={directCredit === 'no'}
              onChange={() => onDirectCreditChange(directCredit === 'no' ? '' : 'no')}
              className="visually-hidden"
            />
          </label>
        </div>
      </div>
      {directCredit === 'yes' && (
        <div className="form-group">
          <label>Payment reference</label>
          <input
            type="text"
            className="form-control"
            value={paymentReference}
            onChange={(e) => onPaymentReferenceChange(e.target.value)}
            placeholder="Payment reference"
          />
        </div>
      )}
    </div>
  );
};

export default ADSDPaymentSection;
