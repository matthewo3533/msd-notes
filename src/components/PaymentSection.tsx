import React, { useEffect, useRef, useState } from 'react';
import ExpandableSection from './ExpandableSection';

interface PaymentSectionProps {
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  onSupplierNameChange: (name: string) => void;
  onSupplierIdChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
  onRecoveryRateChange: (rate: number) => void;
  onDirectCreditChange: (credit: string) => void;
  onPaymentReferenceChange: (reference: string) => void;
  onPaymentCardNumberChange: (cardNumber: string) => void;
  isVisible?: boolean;
  totalAmount?: number;
  showBondRentInputs?: boolean;
  bondAmount?: number;
  rentAdvanceAmount?: number;
  onBondAmountChange?: (amount: number) => void;
  onRentAdvanceAmountChange?: (amount: number) => void;
}

function roundToNearest50Cents(value: number) {
  return Math.round(value * 2) / 2;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  supplierName,
  supplierId,
  amount,
  recoveryRate,
  directCredit,
  paymentReference,
  paymentCardNumber,
  onSupplierNameChange,
  onSupplierIdChange,
  onAmountChange,
  onRecoveryRateChange,
  onDirectCreditChange,
  onPaymentReferenceChange,
  onPaymentCardNumberChange,
  isVisible = false,
  totalAmount,
  showBondRentInputs = false,
  bondAmount = 0,
  rentAdvanceAmount = 0,
  onBondAmountChange,
  onRentAdvanceAmountChange
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

  // For bond/rent, calculate recovery rate based on combined amount
  useEffect(() => {
    if (showBondRentInputs && !userOverridden) {
      const combinedAmount = bondAmount + rentAdvanceAmount;
      if (combinedAmount > 0) {
        const calculated = roundToNearest50Cents(combinedAmount / 104);
        if (calculated !== recoveryRate) {
          onRecoveryRateChange(calculated);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bondAmount, rentAdvanceAmount, showBondRentInputs]);

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

  // Use totalAmount for input if provided, otherwise fallback to amount
  const displayAmount = typeof totalAmount === 'number' ? totalAmount : amount;

  return (
    <ExpandableSection
      title="Payment"
      dataSection="payment"
      isVisible={isVisible}
      defaultExpanded={true}
    >
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
        {showBondRentInputs ? (
          <>
            <div className="form-group">
              <label>Bond Amount</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={bondAmount || ''}
                  onChange={(e) => onBondAmountChange?.(parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => onRentAdvanceAmountChange?.(parseFloat(e.target.value) || 0)}
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
                  value={displayAmount || ''}
                  onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>
              Amount{typeof totalAmount === 'number' ? ` (Total Cost: $${totalAmount.toFixed(2)})` : ''}
            </label>
            <div className="dollar-input">
              <input
                type="number"
                className="form-control"
                value={displayAmount || ''}
                onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}
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
      {directCredit !== 'yes' && (
        <div className="form-group">
          <label>Payment card number</label>
          <input
            type="text"
            className="form-control"
            value={paymentCardNumber}
            onChange={(e) => onPaymentCardNumberChange(e.target.value)}
            placeholder="Payment card number"
          />
        </div>
      )}
    </ExpandableSection>
  );
};

export default PaymentSection; 