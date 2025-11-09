import React from 'react';
import type { HardshipNeedType } from '../../types/multiNeed';
import { getNeedTypeLabel } from '../../types/multiNeed';

interface NeedSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNeed: (needType: HardshipNeedType) => void;
  excludedNeeds: HardshipNeedType[];
}

const NeedSelectorModal: React.FC<NeedSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectNeed,
  excludedNeeds
}) => {
  if (!isOpen) return null;

  // Order matches Home page services array
  const allNeeds: Array<{ type: HardshipNeedType; emoji: string }> = [
    { type: 'food', emoji: '🍽️' },
    { type: 'clothing', emoji: '👕' },
    { type: 'electricity', emoji: '⚡' },
    { type: 'dental', emoji: '🦷' },
    { type: 'beds', emoji: '🛏️' },
    { type: 'bedding', emoji: '🛌' },
    { type: 'furniture', emoji: '🛋️' },
    { type: 'glasses', emoji: '👓' },
    { type: 'whiteware', emoji: '❄️' },
    { type: 'bond-rent', emoji: '🏠' },
    { type: 'rent-arrears', emoji: '💰' },
    { type: 'adsd', emoji: '💵' },
    { type: 'car-repairs', emoji: '🚗' },
    { type: 'transition-to-work', emoji: '💼' },
    { type: 'funeral-assistance', emoji: '⚰️' },
    { type: 'stranded-travel', emoji: '⛽' },
    { type: 'emergency', emoji: '🚨' }
  ];

  const availableNeeds = allNeeds.filter(need => !excludedNeeds.includes(need.type));

  const handleSelect = (needType: HardshipNeedType) => {
    onSelectNeed(needType);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '700px',
            width: '95%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              Select Additional Need
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '0.5rem'
              }}
            >
              ✕
            </button>
          </div>

          {availableNeeds.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              All available needs have been added.
            </p>
          ) : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem'
              }}
            >
              {availableNeeds.map(need => (
                <button
                  key={need.type}
                  onClick={() => handleSelect(need.type)}
                  style={{
                    padding: '1.5rem 1rem',
                    border: '2px solid var(--border-primary)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{need.emoji}</span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    textAlign: 'center'
                  }}>
                    {getNeedTypeLabel(need.type)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NeedSelectorModal;

