import React from 'react';
import type { NeedItem } from '../../types/multiNeed';
import { getNeedTypeLabel } from '../../types/multiNeed';

interface NeedsOverviewProps {
  needs: NeedItem[];
  onRemoveNeed: (needId: string) => void;
  onAddNeed?: () => void;
}

const NeedsOverview: React.FC<NeedsOverviewProps> = ({ needs, onRemoveNeed, onAddNeed }) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          fontWeight: '600'
        }}>
          Needs in Application ({needs.length})
        </h4>
        {onAddNeed ? (
          <button
            className="add-cost-btn"
            onClick={onAddNeed}
            style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}
          >
            Add Need
          </button>
        ) : null}
      </div>
      <div className="needs-overview-grid">
        {needs.map((need, index) => (
          <div key={need.id} className="need-overview-card">
            <button
              className="need-remove-btn"
              onClick={() => onRemoveNeed(need.id)}
              aria-label={`Remove ${getNeedTypeLabel(need.type)}`}
              disabled={needs.length === 1}
              title={needs.length === 1 ? 'Cannot remove the last need' : `Remove ${getNeedTypeLabel(need.type)}`}
            >
              ✕
            </button>
            <span className="need-overview-emoji">{getNeedEmoji(need.type)}</span>
            <div className="need-overview-label">
              <span className="need-overview-number">Need {index + 1}</span>
              <span className="need-overview-title">{getNeedTypeLabel(need.type)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedsOverview;

