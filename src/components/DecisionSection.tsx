import React from 'react';
import ExpandableSection from './ExpandableSection';
import FormattedTextarea from './FormattedTextarea';

interface DecisionSectionProps {
  decision: string;
  decisionReason: string;
  onDecisionChange: (decision: string) => void;
  onDecisionReasonChange: (reason: string) => void;
  isVisible?: boolean;
  /** When true, renders the content without the ExpandableSection header. */
  hideHeader?: boolean;
}

const DecisionSection: React.FC<DecisionSectionProps> = ({
  decision,
  decisionReason,
  onDecisionChange,
  onDecisionReasonChange,
  isVisible = false,
  hideHeader = false
}) => {
  const content = (
    <>
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
    </>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <ExpandableSection
      title="Decision"
      dataSection="decision"
      isVisible={isVisible}
      defaultExpanded={true}
    >
      {content}
    </ExpandableSection>
  );
};

export default DecisionSection; 