import React, { useState, useEffect, useRef } from 'react';
import type { MultiNeedFormData, NeedItem, HardshipNeedType, IncomeData, CostData } from '../../types/multiNeed';
import { createDefaultIncomeLabels, type IncomeLabels } from '../IncomeSection';
import IncomeSection from '../IncomeSection';
import FormattedTextarea from '../FormattedTextarea';
import { getNeedTemplate, createBlankPayment, createBlankDecision, getNeedPaymentDefaults } from '../../utils/needTemplates';
import NeedSectionFactory from '../need-sections/NeedSectionFactory';
import NeedExtraSectionFactory from '../need-sections/NeedExtraSectionFactory';
import DecisionSection from '../DecisionSection';
import { getNeedTypeLabel, hasExtraSection, getExtraSectionTitle } from '../../types/multiNeed';

const roundToNearest50Cents = (value: number) => Math.ceil(value * 2) / 2;

interface MultiNeedContainerProps {
  formData: MultiNeedFormData;
  onFormDataChange: (updates: Partial<MultiNeedFormData>) => void;
  autoOpenSelector?: boolean;
  onSelectorOpened?: () => void;
}

const MultiNeedContainer: React.FC<MultiNeedContainerProps> = ({ formData, onFormDataChange, autoOpenSelector = false, onSelectorOpened }) => {
  const [showNeedSelector, setShowNeedSelector] = useState(false);
  const [permanentlyVisible, setPermanentlyVisible] = useState<Set<string>>(new Set());
  const [animateGrid, setAnimateGrid] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<Set<HardshipNeedType>>(new Set());
  const [recoveryOverrides, setRecoveryOverrides] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Initialize with all sections expanded
    const initialExpanded = new Set<string>(['client-id', 'income', 'decisions', 'reasonable-steps']);
    // Add all need sections (general, extra, payment) - we'll add these dynamically
    return initialExpanded;
  });
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>(() => {
    if (formData.incomeLabels) {
      return { ...formData.incomeLabels };
    }
    return createDefaultIncomeLabels();
  });

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const addNeedButtonRef = useRef<HTMLDivElement | null>(null);
  const needSelectorGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formData.incomeLabels) {
      setIncomeLabels({ ...formData.incomeLabels });
    } else {
      setIncomeLabels(createDefaultIncomeLabels());
    }
  }, [formData.incomeLabels]);

  // Expand all need sections when needs are added
  useEffect(() => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      formData.needs.forEach((need) => {
        const sectionKey = `need-${need.id}`;
        newExpanded.add(`${sectionKey}-general`);
        newExpanded.add(`${sectionKey}-extra`);
        newExpanded.add(`${sectionKey}-payment`);
      });
      return newExpanded;
    });
  }, [formData.needs]);

  useEffect(() => {
    setRecoveryOverrides(prev => {
      const needIds = new Set(formData.needs.map((need) => need.id));
      const next: Record<string, boolean> = {};
      needIds.forEach((id) => {
        if (prev[id]) {
          next[id] = true;
        }
      });

      if (Object.keys(next).length === Object.keys(prev).length) {
        let identical = true;
        for (const key in next) {
          if (!prev[key]) {
            identical = false;
            break;
          }
        }
        if (identical) {
          return prev;
        }
      }
      return next;
    });
  }, [formData.needs]);

  useEffect(() => {
    if (autoOpenSelector) {
      openNeedSelector();
      onSelectorOpened?.();
    }
  }, [autoOpenSelector, onSelectorOpened]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName && entry.isIntersecting) {
            // Only animate if not already permanently visible
            setPermanentlyVisible((prevPerm) => {
              if (!prevPerm.has(sectionName)) {
                return new Set(prevPerm).add(sectionName);
              }
              return prevPerm;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [formData.needs.length]);

  const openNeedSelector = (scroll = true) => {
    setShowNeedSelector(true);
    setSelectedNeeds(new Set());
    setAnimateGrid(true);
    if (scroll) {
      setTimeout(() => {
        if (needSelectorGridRef.current) {
          needSelectorGridRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        } else if (addNeedButtonRef.current) {
          addNeedButtonRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, 50);
    }
  };

  const handleToggleSelector = () => {
    const newState = !showNeedSelector;
    setShowNeedSelector(newState);
    
    // Trigger animation and scroll when opening
    if (newState) {
      openNeedSelector();
    } else {
      setAnimateGrid(false);
      setSelectedNeeds(new Set()); // Clear selections when closing
    }
  };

  const handleToggleNeedSelection = (needType: HardshipNeedType) => {
    setSelectedNeeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(needType)) {
        newSet.delete(needType);
      } else {
        newSet.add(needType);
      }
      return newSet;
    });
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const handleAddSelectedNeeds = () => {
    if (selectedNeeds.size === 0) return;

    const newNeeds = Array.from(selectedNeeds).map(needType => {
      const paymentDefaults = getNeedPaymentDefaults(needType);
      return {
        id: `need-${Date.now()}-${Math.random()}`,
        type: needType,
        data: getNeedTemplate(needType),
        payment: {
          ...createBlankPayment(),
          ...paymentDefaults
        },
        decision: createBlankDecision()
      };
    });

    const allNeeds = [...formData.needs, ...newNeeds];
    onFormDataChange({
      needs: allNeeds
    });
    
    setShowNeedSelector(false);
    setSelectedNeeds(new Set());
    
    // Scroll to the first newly added need after it's rendered
    setTimeout(() => {
      const firstNewNeedIndex = formData.needs.length;
      const sectionKey = `need-${firstNewNeedIndex}`;
      const newNeedElement = sectionRefs.current[`${sectionKey}-general`];
      
      if (newNeedElement) {
        newNeedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleUpdateNeed = (needId: string, updates: Partial<NeedItem>) => {
    const updatedNeeds = formData.needs.map(need =>
      need.id === needId ? { ...need, ...updates } : need
    );
    onFormDataChange({ needs: updatedNeeds });
  };

  const handleIncomeChange = (field: keyof IncomeData, value: number) => {
    onFormDataChange({
      income: { ...formData.income, [field]: value }
    });
  };

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    const updatedLabels = { ...labels };
    setIncomeLabels(updatedLabels);
    onFormDataChange({ incomeLabels: updatedLabels });
  };

  const handleCostChange = (index: number, field: keyof CostData, value: string | number) => {
    const newCosts = [...formData.costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onFormDataChange({ costs: newCosts });
  };

  const addCost = () => {
    onFormDataChange({
      costs: [...formData.costs, { amount: 0, cost: '' }]
    });
  };

  const removeCost = (index: number) => {
    const newCosts = formData.costs.filter((_, i) => i !== index);
    onFormDataChange({ costs: newCosts });
  };

  const excludedNeeds = formData.needs.map(need => need.type);
  const needOptions: Array<{ type: HardshipNeedType; emoji: string; label: string }> = [
    { type: 'food', emoji: '🍽️', label: 'Food' },
    { type: 'clothing', emoji: '👕', label: 'Clothing' },
    { type: 'electricity', emoji: '⚡', label: 'Electricity' },
    { type: 'dental', emoji: '🦷', label: 'Dental' },
    { type: 'beds', emoji: '🛏️', label: 'Beds' },
    { type: 'bedding', emoji: '🛌', label: 'Bedding' },
    { type: 'furniture', emoji: '🛋️', label: 'Furniture' },
    { type: 'glasses', emoji: '👓', label: 'Glasses' },
    { type: 'whiteware', emoji: '❄️', label: 'Whiteware' },
    { type: 'bond-rent', emoji: '🏠', label: 'Bond/Rent' },
    { type: 'rent-arrears', emoji: '💰', label: 'Rent Arrears' },
    { type: 'adsd', emoji: '💵', label: 'ADSD' },
    { type: 'car-repairs', emoji: '🚗', label: 'Car Repairs' },
    { type: 'transition-to-work', emoji: '💼', label: 'Transition to Work' },
    { type: 'funeral-assistance', emoji: '⚰️', label: 'Funeral' },
    { type: 'stranded-travel', emoji: '⛽', label: 'Stranded Travel' },
    { type: 'emergency', emoji: '🚨', label: 'Emergency' },
  ];
  const availableNeedOptions = needOptions.filter((option) => !excludedNeeds.includes(option.type));

  const renderPaymentSection = (
    need: NeedItem,
    onPaymentChange: (updates: Partial<NeedItem['payment']>) => void,
    onDataChange: (updates: Partial<NeedItem['data']>) => void
  ) => {
    const payment = need.payment;
    const directCredit = payment.directCredit || '';
    const isRecoveryOverridden = recoveryOverrides[need.id] ?? false;

    const setRecoveryOverride = (overridden: boolean) => {
      setRecoveryOverrides((prev) => {
        const next = { ...prev };
        if (overridden) {
          next[need.id] = true;
        } else {
          delete next[need.id];
        }
        return next;
      });
    };

    const handlePaymentFieldChange = (field: keyof NeedItem['payment'], value: any, options?: { auto?: boolean }) => {
      if (field === 'amount') {
        const amountValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        const updates: Partial<NeedItem['payment']> = { amount: amountValue };
        if (!isRecoveryOverridden) {
          const calculated = amountValue > 0 ? roundToNearest50Cents(amountValue / 104) : 0;
          updates.recoveryRate = calculated;
        }
        onPaymentChange(updates);
      } else if (field === 'recoveryRate') {
        const rateValue = typeof value === 'number' ? value : parseFloat(value);
        const numericRate = rateValue && !isNaN(rateValue) ? rateValue : 0;
        onPaymentChange({ recoveryRate: numericRate });
        if (options?.auto) {
          if (numericRate === 0) {
            setRecoveryOverride(false);
          }
        } else {
          if (numericRate === 0) {
            setRecoveryOverride(false);
          } else {
            setRecoveryOverride(true);
          }
        }
      } else {
        onPaymentChange({ [field]: value } as Partial<NeedItem['payment']>);
      }
    };

    const handleDataFieldChange = (updates: Partial<NeedItem['data']>) => {
      onDataChange(updates);
    };

    const renderDirectCreditToggle = () => (
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Direct Credit?</label>
        <div className="radio-group">
          <label className={`radio-btn ${directCredit === 'yes' ? 'selected' : ''}`}>Yes
            <input
              type="checkbox"
              checked={directCredit === 'yes'}
              onChange={() => handlePaymentFieldChange('directCredit', directCredit === 'yes' ? '' : 'yes')}
              className="visually-hidden"
            />
          </label>
          <label className={`radio-btn ${directCredit === 'no' ? 'selected' : ''}`}>No
            <input
              type="checkbox"
              checked={directCredit === 'no'}
              onChange={() => handlePaymentFieldChange('directCredit', directCredit === 'no' ? '' : 'no')}
              className="visually-hidden"
            />
          </label>
        </div>
      </div>
    );

    const renderReferenceOrCard = () => (
      <>
        {directCredit === 'yes' && (
          <div className="form-group">
            <label>Payment reference</label>
            <input
              type="text"
              className="form-control"
              value={payment.paymentReference || ''}
              onChange={(e) => handlePaymentFieldChange('paymentReference', e.target.value)}
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
              value={payment.paymentCardNumber || ''}
              onChange={(e) => handlePaymentFieldChange('paymentCardNumber', e.target.value)}
              placeholder="Payment card number"
            />
          </div>
        )}
      </>
    );

    if (need.type === 'food') {
      return (
        <>
          <div className="form-group">
            <label>Supplier Name</label>
            <input
              type="text"
              className="form-control"
            value={payment.supplierName || 'Food Supplier Group'}
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
                value={payment.amount || ''}
                onChange={(e) => handlePaymentFieldChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          {renderDirectCreditToggle()}
          {renderReferenceOrCard()}
        </>
      );
    }

    if (need.type === 'bond-rent') {
      const bondData = need.data as any;
      const bondAmount = bondData.bondPaymentAmount || 0;
      const rentAdvanceAmount = bondData.rentAdvancePaymentAmount || 0;
      const total = bondAmount + rentAdvanceAmount;

      const handleBondAmountChange = (value: number) => {
        handleDataFieldChange({ bondPaymentAmount: value } as any);
        handlePaymentFieldChange('amount', value + (bondData.rentAdvancePaymentAmount || 0));
        if (!payment.directCredit || payment.directCredit === '') {
          handlePaymentFieldChange('directCredit', 'no');
        }
        if (!Number.isNaN(value + rentAdvanceAmount) && value + rentAdvanceAmount > 0) {
        handlePaymentFieldChange('recoveryRate', roundToNearest50Cents((value + rentAdvanceAmount) / 104), { auto: true });
        }
      };

      const handleRentAdvanceChange = (value: number) => {
        handleDataFieldChange({ rentAdvancePaymentAmount: value } as any);
        handlePaymentFieldChange('amount', value + (bondData.bondPaymentAmount || 0));
        if (!Number.isNaN(value + bondAmount) && value + bondAmount > 0) {
        handlePaymentFieldChange('recoveryRate', roundToNearest50Cents((value + bondAmount) / 104), { auto: true });
        }
      };

      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                className="form-control"
                value={payment.supplierName || ''}
                onChange={(e) => handlePaymentFieldChange('supplierName', e.target.value)}
                placeholder="Supplier Name"
              />
            </div>
            <div className="form-group">
              <label>Supplier ID</label>
              <input
                type="text"
                className="form-control"
                value={payment.supplierId || ''}
                onChange={(e) => handlePaymentFieldChange('supplierId', e.target.value)}
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
                  onChange={(e) => handleBondAmountChange(parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleRentAdvanceChange(parseFloat(e.target.value) || 0)}
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
                  value={total || ''}
                  readOnly
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Recovery rate</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={payment.recoveryRate || ''}
                  onChange={(e) => handlePaymentFieldChange('recoveryRate', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          {renderDirectCreditToggle()}
          {renderReferenceOrCard()}
        </>
      );
    }

    // Dental SNG logic
    if (need.type === 'dental') {
      const dentalData = need.data as any;
      const sngEligible = dentalData.sngEligible === 'yes';
      const sngBalance = dentalData.sngBalance || 1000;
      const advance = sngEligible ? Math.max(0, payment.amount - sngBalance) : payment.amount;

      const handleAmountChange = (value: number) => {
        handlePaymentFieldChange('amount', value);
        const calculatedAdvance = sngEligible ? Math.max(0, value - sngBalance) : value;
        if (calculatedAdvance > 0) {
          handlePaymentFieldChange('recoveryRate', roundToNearest50Cents(calculatedAdvance / 104), { auto: true });
        } else {
          handlePaymentFieldChange('recoveryRate', 0, { auto: true });
        }
      };

      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                className="form-control"
                value={payment.supplierName || ''}
                onChange={(e) => handlePaymentFieldChange('supplierName', e.target.value)}
                placeholder="Supplier Name"
              />
            </div>
            <div className="form-group">
              <label>Supplier ID</label>
              <input
                type="text"
                className="form-control"
                value={payment.supplierId || ''}
                onChange={(e) => handlePaymentFieldChange('supplierId', e.target.value)}
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
                  onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            {sngEligible && (
              <div className="form-group">
                <label>Advance (after SNG)</label>
                <div className="dollar-input">
                  <input
                    type="number"
                    className="form-control"
                    value={advance.toFixed(2)}
                    readOnly
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
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
                  value={payment.recoveryRate || ''}
                  onChange={(e) => handlePaymentFieldChange('recoveryRate', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          {renderDirectCreditToggle()}
          {renderReferenceOrCard()}
        </>
      );
    }

    if (need.type === 'adsd') {
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Bank Account</label>
              <input
                type="text"
                className="form-control"
                value={payment.bankAccount || ''}
                onChange={(e) => handlePaymentFieldChange('bankAccount', e.target.value)}
                placeholder="Bank account"
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={payment.amount || ''}
                  onChange={(e) => handlePaymentFieldChange('amount', parseFloat(e.target.value) || 0)}
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
                  value={payment.recoveryRate || ''}
                  onChange={(e) => handlePaymentFieldChange('recoveryRate', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          {renderDirectCreditToggle()}
          {directCredit === 'yes' && (
            <div className="form-group">
              <label>Payment reference</label>
              <input
                type="text"
                className="form-control"
                value={payment.paymentReference || ''}
                onChange={(e) => handlePaymentFieldChange('paymentReference', e.target.value)}
                placeholder="Payment reference"
              />
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Supplier Name</label>
            <input
              type="text"
              className="form-control"
              value={payment.supplierName || ''}
              onChange={(e) => handlePaymentFieldChange('supplierName', e.target.value)}
              placeholder="Supplier Name"
            />
          </div>
          <div className="form-group">
            <label>Supplier ID</label>
            <input
              type="text"
              className="form-control"
              value={payment.supplierId || ''}
              onChange={(e) => handlePaymentFieldChange('supplierId', e.target.value)}
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
                onChange={(e) => handlePaymentFieldChange('amount', parseFloat(e.target.value) || 0)}
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
                value={payment.recoveryRate || ''}
                onChange={(e) => handlePaymentFieldChange('recoveryRate', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        {need.type === 'electricity' && (
          <div className="form-group">
            <label>Power account number</label>
            <input
              type="text"
              className="form-control"
              value={(need.data as any).powerAccountNumber || payment.powerAccountNumber || ''}
              onChange={(e) => {
                const value = e.target.value;
                handlePaymentFieldChange('powerAccountNumber', value);
                handleDataFieldChange({ powerAccountNumber: value } as Partial<NeedItem['data']>);
              }}
              placeholder="Power account number"
            />
          </div>
        )}
        {renderDirectCreditToggle()}
        {renderReferenceOrCard()}
      </>
    );
  };

  return (
    <div className="form-sections-container">
      {/* Client ID Section */}
      <div 
        ref={(el) => { sectionRefs.current['client-id'] = el; }}
        data-section="client-id"
        className={`form-section-card ${permanentlyVisible.has('client-id') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Client Information</h3>
          <button 
            className={`expand-collapse-btn ${!expandedSections.has('client-id') ? 'collapsed' : ''}`}
            type="button"
            onClick={() => toggleSection('client-id')}
            aria-label={expandedSections.has('client-id') ? 'Collapse section' : 'Expand section'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {expandedSections.has('client-id') && (
          <div className="form-group">
            <label>Has the client been ID'd?</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.clientId === true ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  checked={formData.clientId === true}
                  onChange={() => onFormDataChange({ clientId: formData.clientId === true ? null : true })}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.clientId === false ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
                  checked={formData.clientId === false}
                  onChange={() => onFormDataChange({ clientId: formData.clientId === false ? null : false })}
                  className="visually-hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* All Needs */}
      {formData.needs.map((need, index) => {
        const sectionKey = `need-${need.id}`;
        const label = getNeedTypeLabel(need.type);
        const hasExtra = hasExtraSection(need.type);
        const extraContent = hasExtra ? (
          <NeedExtraSectionFactory
            needType={need.type}
            data={need.data}
            onChange={(updates) => handleUpdateNeed(need.id, { data: { ...need.data, ...updates } })}
          />
        ) : null;
        const status = need.decision.decision;

        return (
          <React.Fragment key={need.id}>
            <div
              ref={(el) => { sectionRefs.current[`${sectionKey}-general`] = el; }}
              data-section={`${sectionKey}-general`}
              className={`form-section-card ${permanentlyVisible.has(`${sectionKey}-general`) ? 'section-visible' : ''}`}
            >
              <div className="section-header">
                <h3>{`Need ${index + 1} - ${label}`}</h3>
                <button 
                  className={`expand-collapse-btn ${!expandedSections.has(`${sectionKey}-general`) ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(`${sectionKey}-general`)}
                  aria-label={expandedSections.has(`${sectionKey}-general`) ? 'Collapse section' : 'Expand section'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {expandedSections.has(`${sectionKey}-general`) && (
                <>
                  {status && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          backgroundColor: status === 'approved' ? '#10b981' : '#ef4444',
                          color: '#fff'
                        }}
                      >
                        {status === 'approved' ? 'Approved' : 'Declined'}
                      </span>
                    </div>
                  )}
                  <NeedSectionFactory
                    needType={need.type}
                    data={need.data}
                    onChange={(updates) => handleUpdateNeed(need.id, { data: { ...need.data, ...updates } })}
                  />
                </>
              )}
            </div>

            {hasExtra && extraContent && (
              <div
                ref={(el) => { sectionRefs.current[`${sectionKey}-extra`] = el; }}
                data-section={`${sectionKey}-extra`}
                className={`form-section-card ${permanentlyVisible.has(`${sectionKey}-extra`) ? 'section-visible' : ''}`}
              >
                <div className="section-header">
                  <h3>{getExtraSectionTitle(need.type)}</h3>
                  <button 
                    className={`expand-collapse-btn ${!expandedSections.has(`${sectionKey}-extra`) ? 'collapsed' : ''}`}
                    type="button"
                    onClick={() => toggleSection(`${sectionKey}-extra`)}
                    aria-label={expandedSections.has(`${sectionKey}-extra`) ? 'Collapse section' : 'Expand section'}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                {expandedSections.has(`${sectionKey}-extra`) && extraContent}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Add Need Button */}
      <div 
        ref={(el) => { 
          sectionRefs.current['add-need'] = el;
          addNeedButtonRef.current = el;
        }}
        data-section="add-need"
        className={`form-section-card ${permanentlyVisible.has('add-need') ? 'section-visible' : ''}`}
      >
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '2px solid var(--border-secondary)',
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <button 
            className="add-cost-btn" 
            onClick={handleToggleSelector}
            style={{ 
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {showNeedSelector ? '✕ Cancel' : '➕ Add Another Need'}
          </button>
          
          {showNeedSelector && (
            <div style={{ 
              marginTop: '1.5rem',
              width: '100%',
              maxWidth: '100%',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '2px solid var(--border-primary)',
              padding: '1.5rem',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ 
                margin: '0 0 1.5rem 0',
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                fontWeight: '600'
              }}>
                Select Additional Need
              </h3>
              
              <div 
                ref={needSelectorGridRef}
                className={`need-selector-grid ${animateGrid ? 'animate-in' : ''}`}
              >
                {availableNeedOptions.map(need => {
                  const isSelected = selectedNeeds.has(need.type);
                  return (
                    <div
                      key={need.type}
                      className={`need-selector-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleNeedSelection(need.type)}
                    >
                      <div className="need-selector-checkbox">
                        {isSelected && <span className="need-selector-check">✓</span>}
                      </div>
                      <span className="need-selector-emoji">{need.emoji}</span>
                      <div className="need-selector-title">{need.label}</div>
                    </div>
                  );
                })}
              </div>
              
              {excludedNeeds.length === needOptions.length ? (
                <p style={{ 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)', 
                  marginTop: '1.5rem',
                  marginBottom: 0,
                  fontSize: '0.9rem'
                }}>
                  All available needs have been added.
                </p>
              ) : (
                <div style={{ 
                  marginTop: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <p style={{ 
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    {selectedNeeds.size > 0 ? `${selectedNeeds.size} need${selectedNeeds.size > 1 ? 's' : ''} selected` : 'Select one or more needs'}
                  </p>
                  <button
                    className="add-cost-btn"
                    onClick={handleAddSelectedNeeds}
                    disabled={selectedNeeds.size === 0}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.95rem',
                      opacity: selectedNeeds.size === 0 ? 0.5 : 1,
                      cursor: selectedNeeds.size === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Add Selected ({selectedNeeds.size})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Income Section (Shared) */}
      <div
        ref={(el) => { sectionRefs.current['income'] = el; }}
        data-section="income"
      >
        <IncomeSection
          income={formData.income}
          incomeLabels={incomeLabels}
          costs={formData.costs}
          onIncomeChange={handleIncomeChange}
          onIncomeLabelsChange={handleIncomeLabelsChange}
          onCostChange={handleCostChange}
          onAddCost={addCost}
          onRemoveCost={removeCost}
          isVisible={true}
          sectionTitle="Income"
        />
      </div>

      {/* All Payments */}
      {formData.needs.map((need) => {
        const sectionKey = `need-${need.id}`;
        const label = getNeedTypeLabel(need.type);

        return (
          <div
            key={`payment-${need.id}`}
            ref={(el) => { sectionRefs.current[`${sectionKey}-payment`] = el; }}
            data-section={`${sectionKey}-payment`}
            className={`form-section-card ${permanentlyVisible.has(`${sectionKey}-payment`) ? 'section-visible' : ''}`}
          >
            <div className="section-header">
              <h3>{`Payment - ${label}`}</h3>
              <button 
                className={`expand-collapse-btn ${!expandedSections.has(`${sectionKey}-payment`) ? 'collapsed' : ''}`}
                type="button"
                onClick={() => toggleSection(`${sectionKey}-payment`)}
                aria-label={expandedSections.has(`${sectionKey}-payment`) ? 'Collapse section' : 'Expand section'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {expandedSections.has(`${sectionKey}-payment`) && renderPaymentSection(
              need,
              (updates) =>
                handleUpdateNeed(need.id, { payment: { ...need.payment, ...updates } }),
              (dataUpdates) =>
                handleUpdateNeed(need.id, { data: { ...need.data, ...(dataUpdates as any) } })
            )}
          </div>
        );
      })}

      {/* Reasonable Steps */}
      <div 
        ref={(el) => { sectionRefs.current['reasonable-steps'] = el; }}
        data-section="reasonable-steps"
        className={`form-section-card ${permanentlyVisible.has('reasonable-steps') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Reasonable Steps</h3>
          <button 
            className={`expand-collapse-btn ${!expandedSections.has('reasonable-steps') ? 'collapsed' : ''}`}
            type="button"
            onClick={() => toggleSection('reasonable-steps')}
            aria-label={expandedSections.has('reasonable-steps') ? 'Collapse section' : 'Expand section'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {expandedSections.has('reasonable-steps') && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <FormattedTextarea
              label="What reasonable steps has the client taken to improve their situation?"
              value={formData.reasonableSteps}
              onChange={(value) => onFormDataChange({ reasonableSteps: value })}
              placeholder="Describe steps taken..."
              className="form-control"
            />
          </div>
        )}
      </div>

      {/* All Decisions */}
      <div 
        ref={(el) => { sectionRefs.current['decisions'] = el; }}
        data-section="decisions"
        className={`form-section-card ${permanentlyVisible.has('decisions') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Decisions</h3>
          <button 
            className={`expand-collapse-btn ${!expandedSections.has('decisions') ? 'collapsed' : ''}`}
            type="button"
            onClick={() => toggleSection('decisions')}
            aria-label={expandedSections.has('decisions') ? 'Collapse section' : 'Expand section'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {expandedSections.has('decisions') && formData.needs.map((need, index) => {
          const label = getNeedTypeLabel(need.type);
          return (
            <div key={`decision-${need.id}`} style={{ marginBottom: index < formData.needs.length - 1 ? '2rem' : 0 }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{label}</h4>
              <DecisionSection
                decision={need.decision.decision}
                decisionReason={need.decision.decisionReason}
                onDecisionChange={(value) =>
                  handleUpdateNeed(need.id, {
                    decision: { ...need.decision, decision: value as 'approved' | 'declined' | '' }
                  })
                }
                onDecisionReasonChange={(value) =>
                  handleUpdateNeed(need.id, { decision: { ...need.decision, decisionReason: value } })
                }
                isVisible={true}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MultiNeedContainer;

