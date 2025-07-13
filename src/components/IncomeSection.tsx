import React from 'react';
import CostInput from './CostInput';

export interface IncomeData {
  benefit: number;
  employment: number;
  childSupport: number;
  otherIncome: number;
}

export interface CostData {
  amount: number;
  cost: string;
}

interface IncomeSectionProps {
  income: IncomeData;
  costs: CostData[];
  onIncomeChange: (field: keyof IncomeData, value: number) => void;
  onCostChange: (index: number, field: 'amount' | 'cost', value: any) => void;
  onAddCost: () => void;
  onRemoveCost: (index: number) => void;
  sectionNumber?: number;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({
  income,
  costs,
  onIncomeChange,
  onCostChange,
  onAddCost,
  onRemoveCost,
  sectionNumber = 2
}) => {
  const totalIncome = Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  const totalCosts = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const remainingIncome = totalIncome - totalCosts;

  return (
    <div 
      data-section="income"
      className="form-section-card"
    >
      <div className="section-header">
        <h3>Income</h3>
        <div className="section-number">{sectionNumber}</div>
      </div>
      <div className="income-section">
        <div>
          <div className="form-group">
            <label>5. How much did client earn this week?</label>
            
            <div className="form-group">
              <label>Benefit</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.benefit || ''}
                  onChange={(e) => onIncomeChange('benefit', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Employment</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.employment || ''}
                  onChange={(e) => onIncomeChange('employment', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Child Support</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.childSupport || ''}
                  onChange={(e) => onIncomeChange('childSupport', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Other Income</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.otherIncome || ''}
                  onChange={(e) => onIncomeChange('otherIncome', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>6. What costs did the client have to meet this week?</label>
            
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
                  placeholder="Type cost..."
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

        <div className="income-summary">
          <h4>Income Summary</h4>
          <div className="income-item">
            <span>Benefit:</span>
            <span>${income.benefit.toFixed(2)}</span>
          </div>
          <div className="income-item">
            <span>Employment:</span>
            <span>${income.employment.toFixed(2)}</span>
          </div>
          <div className="income-item">
            <span>Child Support:</span>
            <span>${income.childSupport.toFixed(2)}</span>
          </div>
          <div className="income-item">
            <span>Other Income:</span>
            <span>${income.otherIncome.toFixed(2)}</span>
          </div>
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
    </div>
  );
};

export default IncomeSection; 