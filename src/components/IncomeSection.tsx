import React, { useState, useRef, useEffect } from 'react';
import CostInput from './CostInput';
import IncomePieChart from './IncomePieChart';
import ExpandableSection from './ExpandableSection';

export interface IncomeData {
  benefit: number;
  employment: number;
  childSupport: number;
  otherIncome: number;
  familyTaxCredit: number;
  childDisabilityAllowance: number;
}

export interface IncomeLabels {
  benefit: string;
  employment: string;
  childSupport: string;
  otherIncome: string;
  familyTaxCredit: string;
  childDisabilityAllowance: string;
}

export interface CostData {
  amount: number;
  cost: string;
}

interface IncomeSectionProps {
  income: IncomeData;
  incomeLabels?: IncomeLabels;
  costs: CostData[];
  onIncomeChange: (field: keyof IncomeData, value: number) => void;
  onIncomeLabelsChange?: (labels: IncomeLabels) => void;
  onCostChange: (index: number, field: 'amount' | 'cost', value: any) => void;
  onAddCost: () => void;
  onRemoveCost: (index: number) => void;
  sectionNumber?: number;
  isVisible?: boolean;
  sectionTitle?: string;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({
  income,
  incomeLabels,
  costs,
  onIncomeChange,
  onIncomeLabelsChange,
  onCostChange,
  onAddCost,
  onRemoveCost,
  sectionNumber = 2,
  isVisible = false,
  sectionTitle
}) => {
  const [editingField, setEditingField] = useState<keyof IncomeLabels | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Default labels if none provided
  const defaultLabels: IncomeLabels = {
    benefit: 'Benefit',
    employment: 'Employment',
    childSupport: 'Child Support',
    otherIncome: 'Other Income',
    familyTaxCredit: 'Family Tax Credit',
    childDisabilityAllowance: 'Child Disability Allowance'
  };

  const labels = incomeLabels || defaultLabels;

  const totalIncome = Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  const totalCosts = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const remainingIncome = totalIncome - totalCosts;

  const handleEditClick = (field: keyof IncomeLabels) => {
    setEditingField(field);
    setEditValue(labels[field]);
  };

  const handleSaveEdit = () => {
    if (editingField && onIncomeLabelsChange) {
      const newLabels = { ...labels, [editingField]: editValue };
      onIncomeLabelsChange(newLabels);
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleDeleteLabel = (field: keyof IncomeLabels) => {
    if (onIncomeLabelsChange) {
      const newLabels = { ...labels };
      delete newLabels[field];
      onIncomeLabelsChange(newLabels);
    }
  };

  const handleRestoreLabel = (field: keyof IncomeLabels) => {
    if (onIncomeLabelsChange) {
      const newLabels = { ...labels, [field]: defaultLabels[field] };
      onIncomeLabelsChange(newLabels);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setEditValue('');
    }
  };

  // Auto-focus and select text when editing starts
  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingField]);

  const renderIncomeField = (field: keyof IncomeData, labelField: keyof IncomeLabels) => {
    const isEditing = editingField === labelField;
    const currentLabel = labels[labelField] || defaultLabels[labelField];
    
    // Don't render if the label has been deleted
    if (!currentLabel) {
      return null;
    }
    
    return (
      <div className="form-group" key={field}>
        <div className="income-label-container">
          {isEditing ? (
            <div className="edit-label-container">
              <input
                ref={editInputRef}
                type="text"
                className="form-control edit-label-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveEdit}
                autoFocus
              />
              <button
                className="save-label-btn"
                onClick={handleSaveEdit}
                title="Save"
              >
                ✓
              </button>
            </div>
          ) : (
            <div className="label-with-actions">
              <label>{currentLabel}</label>
              <div className="label-actions">
                <button
                  className="edit-label-btn"
                  onClick={() => handleEditClick(labelField)}
                  title="Edit label"
                >
                  ✏️
                </button>
                <button
                  className="delete-label-btn"
                  onClick={() => handleDeleteLabel(labelField)}
                  title="Delete label"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="dollar-input">
          <input
            type="number"
            className="form-control"
            value={income[field] || ''}
            onChange={(e) => onIncomeChange(field, parseFloat(e.target.value) || 0)}
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>
      </div>
    );
  };

  return (
    <ExpandableSection
      title={sectionTitle || 'Income'}
      dataSection="income"
      isVisible={isVisible}
      defaultExpanded={true}
    >
      <div className="income-section">
        <div>
          <div className="form-group">
            <label>How much did client earn this week?</label>
            
            {renderIncomeField('benefit', 'benefit')}
            {renderIncomeField('employment', 'employment')}
            {renderIncomeField('childSupport', 'childSupport')}
            {renderIncomeField('otherIncome', 'otherIncome')}
            {renderIncomeField('familyTaxCredit', 'familyTaxCredit')}
            {renderIncomeField('childDisabilityAllowance', 'childDisabilityAllowance')}
            
            {/* Show restore options for deleted labels */}
            {Object.entries(defaultLabels).map(([key, defaultLabel]) => {
              const labelKey = key as keyof IncomeLabels;
              if (!labels[labelKey]) {
                                 return (
                   <div key={labelKey} className="form-group deleted-label-row">
                     <div className="income-label-container">
                       <div className="label-with-actions">
                         <label className="deleted">
                           {defaultLabel} (deleted)
                         </label>
                         <div className="label-actions">
                           <button
                             className="restore-label-btn"
                             onClick={() => handleRestoreLabel(labelKey)}
                             title="Restore label"
                           >
                             ➕
                           </button>
                         </div>
                       </div>
                     </div>
                     <div className="dollar-input">
                       <input
                         type="number"
                         className="form-control"
                         value={income[labelKey as keyof IncomeData] || ''}
                         onChange={(e) => onIncomeChange(labelKey as keyof IncomeData, parseFloat(e.target.value) || 0)}
                         placeholder="Enter amount"
                         step="0.01"
                         min="0"
                         disabled
                       />
                     </div>
                   </div>
                 );
              }
              return null;
            })}
          </div>

          <div className="form-group">
            <div className="section-header" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-secondary)' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)', 
                margin: '0', 
                background: 'var(--accent-gradient)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text' 
              }}>
                Expenses
              </h3>
            </div>
            <label>What costs did the client have to meet this week?</label>
            
            {costs.map((cost, index) => (
              <div key={index} className="cost-row">
                <div className="dollar-input">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={cost.amount || ''}
                    onChange={(e) => onCostChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <CostInput
                  value={cost.cost}
                  onChange={(value) => onCostChange(index, 'cost', value)}
                  placeholder="Type"
                />
                <button
                  className="remove-cost-btn"
                  onClick={() => onRemoveCost(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button className="add-cost-btn" onClick={onAddCost}>
              Add Cost
            </button>
          </div>
        </div>

        <div className="income-summary-sticky">
          <div className="income-summary">
            <h4>Income Summary</h4>
            
            {/* Pie Chart - only show when there's income data */}
            {totalIncome > 0 && (
              <IncomePieChart
                income={income}
                incomeLabels={labels}
                costs={costs}
              />
            )}
            
            {Object.entries(income).map(([key, value]) => {
              const fieldKey = key as keyof IncomeData;
              const labelKey = key as keyof IncomeLabels;
              const label = labels[labelKey] || defaultLabels[labelKey];
              if (label && value > 0) {
                return (
                  <div key={fieldKey} className="income-item">
                    <span>{label}:</span>
                    <span>${value.toFixed(2)}</span>
                  </div>
                );
              }
              return null;
            })}
            <div className="income-item">
              <span>Total Income:</span>
              <span>${totalIncome.toFixed(2)}</span>
            </div>
            {costs.length > 0 && (
              <>
                <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-secondary)' }} />
                {costs.map((cost, index) => (
                  <div key={index} className="income-item" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>-{cost.cost}:</span>
                    <span>-${cost.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="income-item">
                  <span>Remaining:</span>
                  <span>${remainingIncome.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="income-links-plain">
          <a
            href="https://www.workandincome.govt.nz/map/deskfile/extra-help-information/special-needs-grant-tables/income-limits-current.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            SNG income limits
          </a>
          <span>·</span>
          <a
            href="https://www.workandincome.govt.nz/map/deskfile/extra-help-information/special-needs-grant-tables/asset-limits-current.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            SNG asset limits
          </a>
          <span>·</span>
          <a
            href="https://www.workandincome.govt.nz/map/deskfile/extra-help-information/recoverable-assistance-payment-tables/income-limits-current.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAP income limits
          </a>
          <span>·</span>
          <a
            href="https://www.workandincome.govt.nz/map/deskfile/extra-help-information/recoverable-assistance-payment-tables/asset-limits-current.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAP asset limits
          </a>
        </div>
      </div>
    </ExpandableSection>
  );
};

export default IncomeSection; 