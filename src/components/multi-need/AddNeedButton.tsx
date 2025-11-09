import React from 'react';

interface AddNeedButtonProps {
  onClick: () => void;
}

const AddNeedButton: React.FC<AddNeedButtonProps> = ({ onClick }) => {
  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--border-secondary)' }}>
      <button 
        className="add-cost-btn" 
        onClick={onClick}
        style={{ 
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: '600'
        }}
      >
        ➕ Add Another Need
      </button>
    </div>
  );
};

export default AddNeedButton;

