import React from 'react';
import CostInput from './CostInput';

export interface IncomeData {
  benefit: number;
  employment: number;
  childSupport: number;
  otherIncome: number;
  familyTaxCredit: number;
  childDisabilityAllowance: number;
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
  isVisible?: boolean;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({
  income,
  costs,
  onIncomeChange,
  onCostChange,
  onAddCost,
  onRemoveCost,
  sectionNumber = 2,
  isVisible = false
}) => {
  const totalIncome = Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  const totalCosts = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const remainingIncome = totalIncome - totalCosts;

  return (
    <div 
      data-section="income"
      className={`form-section-card ${isVisible ? 'section-visible' : ''}`}
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

            <div className="form-group">
              <label>Family Tax Credit</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.familyTaxCredit || ''}
                  onChange={(e) => onIncomeChange('familyTaxCredit', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Child Disability Allowance</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={income.childDisabilityAllowance || ''}
                  onChange={(e) => onIncomeChange('childDisabilityAllowance', parseFloat(e.target.value) || 0)}
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
              <span>Family Tax Credit:</span>
              <span>${income.familyTaxCredit.toFixed(2)}</span>
            </div>
            <div className="income-item">
              <span>Child Disability Allowance:</span>
              <span>${income.childDisabilityAllowance.toFixed(2)}</span>
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
    </div>
  );
};

export default IncomeSection; 