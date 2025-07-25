import React from 'react';

interface DecisionSectionProps {
  decision: string;
  decisionReason: string;
  onDecisionChange: (decision: string) => void;
  onDecisionReasonChange: (reason: string) => void;
  sectionNumber?: number;
  isVisible?: boolean;
}

function autoResizeTextarea(el: HTMLTextAreaElement | null) {
  if (el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    if (el.scrollHeight > 800) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  }
}

const DecisionSection: React.FC<DecisionSectionProps> = ({
  decision,
  decisionReason,
  onDecisionChange,
  onDecisionReasonChange,
  sectionNumber = 3,
  isVisible = false
}) => {
  return (
    <div 
      data-section="decision"
      className={`form-section-card ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="section-header">
        <h3>Decision</h3>
        <div className="section-number">{sectionNumber}</div>
      </div>
      
      <div className="form-group">
        <label>Do you want to approve or decline this application?</label>
        <div className="decision-buttons">
          <button
            className="decision-btn approve-btn"
            onClick={() => onDecisionChange('approved')}
          >
            Approve
          </button>
          <button
            className="decision-btn decline-btn"
            onClick={() => onDecisionChange('declined')}
          >
            Decline
          </button>
        </div>
      </div>

      {decision && (
        <div className="form-group">
          <label>Why are you choosing to help/not help this client?</label>
          <textarea
            className="form-control"
            value={decisionReason}
            onChange={(e) => onDecisionReasonChange(e.target.value)}
            placeholder="Please provide your reasoning..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>
      )}
    </div>
  );
};

export default DecisionSection; 