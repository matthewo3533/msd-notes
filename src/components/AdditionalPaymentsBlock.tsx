import React, { useEffect, useState } from 'react';
import type { AdditionalPayment } from '../types/additionalPayment';
import { createBlankAdditionalPayment } from '../types/additionalPayment';

interface AdditionalPaymentsBlockProps {
  payments?: AdditionalPayment[];
  onChange: (payments: AdditionalPayment[]) => void;
}

function roundToNearest50Cents(value: number) {
  return Math.ceil(value * 2) / 2;
}

interface AdditionalPaymentFormProps {
  payment: AdditionalPayment;
  index: number;
  onChange: (updates: Partial<AdditionalPayment>) => void;
  onRemove: () => void;
}

const AdditionalPaymentForm: React.FC<AdditionalPaymentFormProps> = ({
  payment,
  index,
  onChange,
  onRemove
}) => {
  const [userOverridden, setUserOverridden] = useState(false);

  useEffect(() => {
    if (!userOverridden && payment.amount > 0) {
      const calculated = roundToNearest50Cents(payment.amount / 104);
      if (calculated !== payment.recoveryRate) {
        onChange({ recoveryRate: calculated });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.amount]);

  useEffect(() => {
    if (payment.recoveryRate === 0) {
      setUserOverridden(false);
    }
  }, [payment.recoveryRate]);

  const handleRecoveryRateChange = (value: number) => {
    setUserOverridden(true);
    onChange({ recoveryRate: value });
  };

  const displayRecoveryRate =
    payment.recoveryRate === 0 || payment.recoveryRate === undefined || isNaN(payment.recoveryRate)
      ? ''
      : payment.recoveryRate.toFixed(2);

  return (
    <div className="additional-payment-form">
      <div className="additional-payment-form-header">
        <span className="additional-payment-form-title">Payment {index + 2}</span>
        <button
          type="button"
          className="remove-additional-payment-btn"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            className="form-control"
            value={payment.supplierName}
            onChange={(e) => onChange({ supplierName: e.target.value })}
            placeholder="Supplier Name"
          />
        </div>
        <div className="form-group">
          <label>Supplier ID</label>
          <input
            type="text"
            className="form-control"
            value={payment.supplierId}
            onChange={(e) => onChange({ supplierId: e.target.value })}
            placeholder="Supplier ID"
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={payment.amount || ''}
              onChange={(e) => onChange({ amount: parseFloat(e.target.value) || 0 })}
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
    </div>
  );
};

const AdditionalPaymentsBlock: React.FC<AdditionalPaymentsBlockProps> = ({
  payments = [],
  onChange
}) => {
  const handleAdd = () => {
    onChange([...payments, createBlankAdditionalPayment()]);
  };

  const handleUpdate = (id: string, updates: Partial<AdditionalPayment>) => {
    onChange(payments.map((payment) => (
      payment.id === id ? { ...payment, ...updates } : payment
    )));
  };

  const handleRemove = (id: string) => {
    onChange(payments.filter((payment) => payment.id !== id));
  };

  return (
    <div className="additional-payments-block">
      {payments.map((payment, index) => (
        <AdditionalPaymentForm
          key={payment.id}
          payment={payment}
          index={index}
          onChange={(updates) => handleUpdate(payment.id, updates)}
          onRemove={() => handleRemove(payment.id)}
        />
      ))}
      <button type="button" className="add-cost-btn" onClick={handleAdd}>
        Add another payment
      </button>
    </div>
  );
};

export default AdditionalPaymentsBlock;
