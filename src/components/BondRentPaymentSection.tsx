import React, { useEffect, useRef, useState } from 'react';

interface BondRentPaymentSectionProps {
  supplierName: string;
  supplierId: string;
  bondAmount: number;
  rentAdvanceAmount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  onSupplierNameChange: (name: string) => void;
  onSupplierIdChange: (id: string) => void;
  onBondAmountChange: (amount: number) => void;
  onRentAdvanceAmountChange: (amount: number) => void;
  onRecoveryRateChange: (rate: number) => void;
  onDirectCreditChange: (credit: string) => void;
  onPaymentReferenceChange: (reference: string) => void;
  sectionNumber?: number;
  isVisible?: boolean;
}

function roundToNearest50Cents(value: number) {
  return Math.round(value * 2) / 2;
}

const BondRentPaymentSection: React.FC<BondRentPaymentSectionProps> = ({
  supplierName,
  supplierId,
  bondAmount,
  rentAdvanceAmount,
  recoveryRate,
  directCredit,
  paymentReference,
  onSupplierNameChange,
  onSupplierIdChange,
  onBondAmountChange,
  onRentAdvanceAmountChange,
  onRecoveryRateChange,
  onDirectCreditChange,
  onPaymentReferenceChange,
  sectionNumber = 3,
  isVisible = false
}) => {
  // Track if user has manually changed recovery rate
  const [userOverridden, setUserOverridden] = useState(false);
  const prevBondAmount = useRef(bondAmount);
  const prevRentAmount = useRef(rentAdvanceAmount);

  const totalAmount = bondAmount + rentAdvanceAmount;

  useEffect(() => {
    // If amounts change and user hasn't overridden, auto-calculate recovery rate
    if (!userOverridden && totalAmount > 0) {
      const calculated = roundToNearest50Cents(totalAmount / 104);
      if (calculated !== recoveryRate) {
        onRecoveryRateChange(calculated);
      }
    }
    prevBondAmount.current = bondAmount;
    prevRentAmount.current = rentAdvanceAmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bondAmount, rentAdvanceAmount]);

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
          <label>Supplier Name</label>
          <input
            type="text"
            className="form-control"
            value={supplierName}
            onChange={(e) => onSupplierNameChange(e.target.value)}
            placeholder="Supplier Name"
          />
        </div>
        <div className="form-group">
          <label>Supplier ID</label>
          <input
            type="text"
            className="form-control"
            value={supplierId}
            onChange={(e) => onSupplierIdChange(e.target.value)}
            placeholder="Supplier ID"
          />
        </div>
        <div className="form-group">
          <label>Bond Amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={bondAmount || ''}
              onChange={(e) => onBondAmountChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Rent in Advance Amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={rentAdvanceAmount || ''}
              onChange={(e) => onRentAdvanceAmountChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Total Amount (Bond + Rent Advance)</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={totalAmount || ''}
              disabled
              style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-secondary)' }}
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

export default BondRentPaymentSection;
