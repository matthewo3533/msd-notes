import React from 'react';
import FormattedTextarea from '../FormattedTextarea';
import type { FoodNeedData } from '../../types/multiNeed';

interface FoodNeedSectionProps {
  data: FoodNeedData;
  onChange: (data: Partial<FoodNeedData>) => void;
}

const FoodNeedSection: React.FC<FoodNeedSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FoodNeedData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="form-group">
        <FormattedTextarea
          label="Why is the client needing food?"
          value={data.whyNeedFood}
          onChange={(value) => handleChange('whyNeedFood', value)}
          placeholder="Please describe the client's situation..."
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>How much food is the client requesting?</label>
        <div className="dollar-input">
          <input
            type="number"
            className="form-control"
            value={data.foodAmountRequested || ''}
            onChange={(e) => handleChange('foodAmountRequested', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label>What is the client's current food balance?</label>
        <div className="dollar-input">
          <input
            type="number"
            className="form-control"
            value={data.currentFoodBalance || ''}
            onChange={(e) => handleChange('currentFoodBalance', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      {data.currentFoodBalance < 30 && data.currentFoodBalance > 0 && (
        <div className="form-group">
          <label>Is client in hardship due to an unforeseen circumstance?</label>
          <div className="radio-group">
            <label className={`radio-btn ${data.hardshipUnforeseen === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                checked={data.hardshipUnforeseen === 'yes'}
                onChange={() => handleChange('hardshipUnforeseen', data.hardshipUnforeseen === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${data.hardshipUnforeseen === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                checked={data.hardshipUnforeseen === 'no'}
                onChange={() => handleChange('hardshipUnforeseen', data.hardshipUnforeseen === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
      )}

      {data.hardshipUnforeseen === 'yes' && (
        <div className="form-group">
          <FormattedTextarea
            label="What is the unforeseen circumstance?"
            value={data.unforeseenCircumstance}
            onChange={(value) => handleChange('unforeseenCircumstance', value)}
            placeholder="Please describe the unforeseen circumstance..."
            className="form-control"
          />
        </div>
      )}
    </>
  );
};

export default FoodNeedSection;

