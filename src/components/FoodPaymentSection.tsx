import React from 'react';

interface FoodPaymentSectionProps {
  amount: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  onAmountChange: (amount: number) => void;
  onDirectCreditChange: (credit: string) => void;
  onPaymentReferenceChange: (reference: string) => void;
  onPaymentCardNumberChange: (cardNumber: string) => void;
  sectionNumber?: number;
  isVisible?: boolean;
}

const FoodPaymentSection: React.FC<FoodPaymentSectionProps> = ({
  amount,
  directCredit,
  paymentReference,
  paymentCardNumber,
  onAmountChange,
  onDirectCreditChange,
  onPaymentReferenceChange,
  onPaymentCardNumberChange,
  sectionNumber = 2,
  isVisible = false,
}) => {
  return (
    <div className={`form-section-card ${isVisible ? 'section-visible' : ''}`} data-section="payment">
      <div className="section-header">
        <h3>Payment</h3>
        <div className="section-number">{sectionNumber}</div>
      </div>
      
      <div className="form-group">
        <label>Supplier Name</label>
        <input
          type="text"
          className="form-control"
          value="Food Supplier Group"
          readOnly
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
        />
      </div>
      
      <div className="form-group">
        <label>Total Cost</label>
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
    </div>
  );
};

export default FoodPaymentSection;
