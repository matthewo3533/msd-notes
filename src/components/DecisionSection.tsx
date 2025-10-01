import React from 'react';
import ExpandableSection from './ExpandableSection';
import FormattedTextarea from './FormattedTextarea';

interface DecisionSectionProps {
  decision: string;
  decisionReason: string;
  onDecisionChange: (decision: string) => void;
  onDecisionReasonChange: (reason: string) => void;
  isVisible?: boolean;
}

const DecisionSection: React.FC<DecisionSectionProps> = ({
  decision,
  decisionReason,
  onDecisionChange,
  onDecisionReasonChange,
  isVisible = false
}) => {
  return (
    <ExpandableSection
      title="Decision"
      dataSection="decision"
      isVisible={isVisible}
      defaultExpanded={true}
    >
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
          <FormattedTextarea
            label="Why are you choosing to help/not help this client?"
            value={decisionReason}
            onChange={(value) => onDecisionReasonChange(value)}
            placeholder="Please provide your reasoning..."
            className="form-control"
          />
        </div>
      )}
    </ExpandableSection>
  );
};

export default DecisionSection; 