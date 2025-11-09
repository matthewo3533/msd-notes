import React, { useState } from 'react';
import type { NeedItem, NeedData, PaymentData, DecisionData } from '../../types/multiNeed';
import { getNeedTypeLabel } from '../../types/multiNeed';
import NeedSectionFactory from '../need-sections/NeedSectionFactory';
import PaymentSection from '../PaymentSection';
import DecisionSection from '../DecisionSection';

interface NeedCardProps {
  need: NeedItem;
  index: number;
  onUpdate: (needId: string, updates: Partial<NeedItem>) => void;
  onRemove: (needId: string) => void;
  canRemove: boolean;
}

const NeedCard: React.FC<NeedCardProps> = ({ need, index, onUpdate, onRemove, canRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNeedDataChange = (updates: Partial<NeedData>) => {
    onUpdate(need.id, {
      data: { ...need.data, ...updates }
    });
  };

  const handlePaymentChange = (updates: Partial<PaymentData>) => {
    onUpdate(need.id, {
      payment: { ...need.payment, ...updates }
    });
  };

  const handleDecisionChange = (field: keyof DecisionData, value: any) => {
    onUpdate(need.id, {
      decision: { ...need.decision, [field]: value }
    });
  };

  const getStatusColor = () => {
    if (need.decision.decision === 'approved') return '#10b981';
    if (need.decision.decision === 'declined') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div 
      style={{
        border: '2px solid var(--border-primary)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.3rem',
            color: 'var(--text-primary)'
          }}>
            Need {index + 1} - {getNeedTypeLabel(need.type)}
          </h3>
          {need.decision.decision && (
            <span 
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                backgroundColor: getStatusColor(),
                color: 'white'
              }}
            >
              {need.decision.decision === 'approved' ? 'Approved' : 'Declined'}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {canRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(need.id);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Remove
            </button>
          )}
          <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div>
          {/* Need Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--border-secondary)',
              paddingBottom: '0.5rem'
            }}>
              Need Details
            </h4>
            <NeedSectionFactory
              needType={need.type}
              data={need.data}
              onChange={handleNeedDataChange}
            />
          </div>

          {/* Payment Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--border-secondary)',
              paddingBottom: '0.5rem'
            }}>
              Payment - {getNeedTypeLabel(need.type)}
            </h4>
            <PaymentSection
              supplierName={need.payment.supplierName}
              supplierId={need.payment.supplierId}
              amount={need.payment.amount}
              recoveryRate={need.payment.recoveryRate}
              directCredit={need.payment.directCredit}
              paymentReference={need.payment.paymentReference}
              paymentCardNumber={need.payment.paymentCardNumber}
              onSupplierNameChange={(value) => handlePaymentChange({ supplierName: value })}
              onSupplierIdChange={(value) => handlePaymentChange({ supplierId: value })}
              onAmountChange={(value) => handlePaymentChange({ amount: value })}
              onRecoveryRateChange={(value) => handlePaymentChange({ recoveryRate: value })}
              onDirectCreditChange={(value) => handlePaymentChange({ directCredit: value })}
              onPaymentReferenceChange={(value) => handlePaymentChange({ paymentReference: value })}
              onPaymentCardNumberChange={(value) => handlePaymentChange({ paymentCardNumber: value })}
              isVisible={true}
            />
          </div>

          {/* Decision Section */}
          <div>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--border-secondary)',
              paddingBottom: '0.5rem'
            }}>
              Decision - {getNeedTypeLabel(need.type)}
            </h4>
            <DecisionSection
              decision={need.decision.decision}
              decisionReason={need.decision.decisionReason}
              onDecisionChange={(value) => handleDecisionChange('decision', value)}
              onDecisionReasonChange={(value) => handleDecisionChange('decisionReason', value)}
              isVisible={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedCard;

