import React from 'react';
import FormattedTextarea from '../FormattedTextarea';
import type { FurnitureNeedData } from '../../types/multiNeed';

interface FurnitureNeedSectionProps {
  data: FurnitureNeedData;
  onChange: (data: Partial<FurnitureNeedData>) => void;
}

const FurnitureNeedSection: React.FC<FurnitureNeedSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof FurnitureNeedData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="form-group">
        <FormattedTextarea
          label="Why is the client needing furniture?"
          value={data.whyNeedFurniture}
          onChange={(value) => handleChange('whyNeedFurniture', value)}
          placeholder="Please describe the client's situation..."
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>What type of furniture?</label>
        <input
          type="text"
          className="form-control"
          value={data.furnitureType}
          onChange={(e) => handleChange('furnitureType', e.target.value)}
          placeholder="e.g., Table, Couch, Dining Set"
        />
      </div>

      <div className="form-group">
        <label>Can the client meet this need in any other way?</label>
        <div className="radio-group">
          <label className={`radio-btn ${data.canMeetNeedOtherWay === 'yes' ? 'selected' : ''}`}>Yes
            <input
              type="checkbox"
              checked={data.canMeetNeedOtherWay === 'yes'}
              onChange={() => handleChange('canMeetNeedOtherWay', data.canMeetNeedOtherWay === 'yes' ? '' : 'yes')}
              className="visually-hidden"
            />
          </label>
          <label className={`radio-btn ${data.canMeetNeedOtherWay === 'no' ? 'selected' : ''}`}>No
            <input
              type="checkbox"
              checked={data.canMeetNeedOtherWay === 'no'}
              onChange={() => handleChange('canMeetNeedOtherWay', data.canMeetNeedOtherWay === 'no' ? '' : 'no')}
              className="visually-hidden"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default FurnitureNeedSection;

