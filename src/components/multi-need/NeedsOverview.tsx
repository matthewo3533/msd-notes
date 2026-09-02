import React from 'react';
import type { NeedItem } from '../../types/multiNeed';
import { getNeedTypeLabel } from '../../types/multiNeed';

interface NeedsOverviewProps {
  needs: NeedItem[];
  onRemoveNeed: (needId: string) => void;
  onAddNeed?: () => void;
  /** When true, show single need without numbering and hide Add Need */
  singleNeed?: boolean;
}

const NeedsOverview: React.FC<NeedsOverviewProps> = ({ needs, onRemoveNeed, onAddNeed, singleNeed }) => {
  const getNeedEmoji = (needType: string): string => {
    const emojiMap: { [key: string]: string } = {
      'food': '🍽️',
      'clothing': '👕',
      'electricity': '⚡',
      'dental': '🦷',
      'beds': '🛏️',
      'bedding': '🛌',
      'furniture': '🛋️',
      'glasses': '👓',
      'adsd': '💵',
      'whiteware': '❄️',
      'bond-rent': '🏠',
      'rent-arrears': '💰',
      'car-repairs': '🚗',
      'transition-to-work': '💼',
      'funeral-assistance': '⚰️',
      'stranded-travel': '⛽',
      'emergency': '🚨'
    };
    return emojiMap[needType] || '📋';
  };

  if (needs.length === 0) {
    return null;
  }

  return (
    <div className="needs-overview">
      <div className="needs-overview-header">
        <h4 className="sidebar-panel-heading">
          {singleNeed ? 'Need' : `Needs in Application (${needs.length})`}
        </h4>
        {!singleNeed && onAddNeed ? (
          <button
            className="add-cost-btn"
            onClick={onAddNeed}
          >
            Add Need
          </button>
        ) : null}
      </div>
      <div className="needs-overview-grid">
        {needs.map((need, index) => (
          <div key={need.id} className="need-overview-card">
            {!singleNeed && (
              <button
                className="need-remove-btn"
                onClick={() => onRemoveNeed(need.id)}
                aria-label={`Remove ${getNeedTypeLabel(need.type)}`}
                disabled={needs.length === 1}
                title={needs.length === 1 ? 'Cannot remove the last need' : `Remove ${getNeedTypeLabel(need.type)}`}
              >
                ✕
              </button>
            )}
            <span className="need-overview-emoji">{getNeedEmoji(need.type)}</span>
            <div className="need-overview-label">
              {!singleNeed && <span className="need-overview-number">Need {index + 1}</span>}
              <span className="need-overview-title">{getNeedTypeLabel(need.type)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedsOverview;

