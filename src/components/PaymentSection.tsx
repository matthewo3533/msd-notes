import React from 'react';

interface PaymentSectionProps {
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  onSupplierNameChange: (name: string) => void;
  onSupplierIdChange: (id: string) => void;
  onAmountChange: (amount: number) => void;
  onRecoveryRateChange: (rate: number) => void;
  onDirectCreditChange: (credit: string) => void;
  onPaymentReferenceChange: (reference: string) => void;
  sectionNumber?: number;
  isVisible?: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  supplierName,
  supplierId,
  amount,
  recoveryRate,
  directCredit,
  paymentReference,
  onSupplierNameChange,
  onSupplierIdChange,
  onAmountChange,
  onRecoveryRateChange,
  onDirectCreditChange,
  onPaymentReferenceChange,
  sectionNumber = 3,
  isVisible = false
}) => {
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
          <label>Amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={amount || ''}
              onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
              placeholder="$0.00"
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
              value={recoveryRate || ''}
              onChange={(e) => onRecoveryRateChange(parseFloat(e.target.value) || 0)}
              placeholder="$0.00"
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

export default PaymentSection; 