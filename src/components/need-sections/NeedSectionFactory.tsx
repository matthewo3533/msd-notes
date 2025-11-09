import React from 'react';
import type {
  HardshipNeedType,
  NeedData,
  ElectricityNeedData,
  RentArrearsNeedData
} from '../../types/multiNeed';
import FoodNeedSection from './FoodNeedSection';
import FurnitureNeedSection from './FurnitureNeedSection';
import FormattedTextarea from '../FormattedTextarea';

interface NeedSectionFactoryProps {
  needType: HardshipNeedType;
  data: NeedData;
  onChange: (data: Partial<NeedData>) => void;
}

// Generic need section for simple needs (just "why need X?" and "can meet other way?")
const GenericNeedSection: React.FC<{
  label: string;
  whyFieldName: string;
  data: any;
  onChange: (data: any) => void;
  showCanMeetOtherWay?: boolean;
}> = ({ label, whyFieldName, data, onChange, showCanMeetOtherWay = true }) => {
  return (
    <>
      <div className="form-group">
        <FormattedTextarea
          label={label}
          value={data[whyFieldName] || ''}
          onChange={(value) => onChange({ [whyFieldName]: value })}
          placeholder="Please describe the client's situation..."
          className="form-control"
        />
      </div>

      {showCanMeetOtherWay && (
        <div className="form-group">
          <label>Can the client meet this need in any other way?</label>
          <div className="radio-group">
            <label className={`radio-btn ${data.canMeetNeedOtherWay === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                checked={data.canMeetNeedOtherWay === 'yes'}
                onChange={() => onChange({ canMeetNeedOtherWay: data.canMeetNeedOtherWay === 'yes' ? '' : 'yes' })}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${data.canMeetNeedOtherWay === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                checked={data.canMeetNeedOtherWay === 'no'}
                onChange={() => onChange({ canMeetNeedOtherWay: data.canMeetNeedOtherWay === 'no' ? '' : 'no' })}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
};

const NeedSectionFactory: React.FC<NeedSectionFactoryProps> = ({ needType, data, onChange }) => {
  // Use specialized components where available
  switch (needType) {
    case 'food':
      return <FoodNeedSection data={data as any} onChange={onChange} />;
    
    case 'furniture':
      return <FurnitureNeedSection data={data as any} onChange={onChange} />;

    case 'electricity':
      const electricityData = data as ElectricityNeedData;
      return (
        <>
          <GenericNeedSection
            label="Why is the client needing electricity assistance?"
            whyFieldName="whyNeedPower"
            data={electricityData}
            onChange={(updates) => onChange(updates as Partial<NeedData>)}
          />
          <div className="form-group">
            <label>What is the client's power account number?</label>
            <input
              type="text"
              className="form-control"
              value={electricityData.powerAccountNumber || ''}
              onChange={(e) =>
                onChange({ powerAccountNumber: e.target.value } as Partial<NeedData>)
              }
              placeholder="Enter power account number"
            />
          </div>
        </>
      );
    
    // Generic implementations for other needs
    case 'clothing':
      return <GenericNeedSection label="Why is the client needing clothing?" whyFieldName="whyNeedClothing" data={data} onChange={onChange} />;
    
    case 'emergency':
      return <GenericNeedSection label="Why is the client needing an emergency payment?" whyFieldName="whyNeedEmergencyPayment" data={data} onChange={onChange} />;
    
    case 'beds':
      return <GenericNeedSection label="Why is the client needing beds?" whyFieldName="whyNeedBeds" data={data} onChange={onChange} />;
    
    case 'bedding':
      return <GenericNeedSection label="Why is the client needing bedding?" whyFieldName="whyNeedBedding" data={data} onChange={onChange} />;
    
    case 'glasses':
      return <GenericNeedSection label="Why is the client needing glasses?" whyFieldName="whyNeedGlasses" data={data} onChange={onChange} />;
    
    case 'adsd':
      return <GenericNeedSection label="Why is the client needing ADSD assistance?" whyFieldName="whyNeedADSD" data={data} onChange={onChange} />;
    
    case 'whiteware':
      return <GenericNeedSection label="Why is the client needing whiteware?" whyFieldName="whyNeedWhiteware" data={data} onChange={onChange} />;
    
    case 'dental':
      return <GenericNeedSection label="Why is the client needing dental assistance?" whyFieldName="whyNeedDental" data={data} onChange={onChange} />;
    
    case 'car-repairs':
      return <GenericNeedSection label="Why is the client needing car repairs?" whyFieldName="whyNeedCarRepairs" data={data} onChange={onChange} />;
    
    case 'rent-arrears':
      return (
        <>
          <GenericNeedSection
            label="Why is the client needing rent arrears assistance?"
            whyFieldName="whyNeedRentArrears"
            data={data}
            onChange={onChange}
          />
          <FormattedTextarea
            label="Rent arrears verification"
            value={(data as RentArrearsNeedData).rentArrearsVerification || ''}
            onChange={(value) => onChange({ rentArrearsVerification: value } as Partial<NeedData>)}
            placeholder="Provide verification details..."
            className="form-control"
          />
        </>
      );
    
    case 'bond-rent':
      return <GenericNeedSection label="Why is the client needing bond/rent in advance?" whyFieldName="whyNeedAccommodation" data={data} onChange={onChange} showCanMeetOtherWay={false} />;
    
    case 'funeral-assistance':
      return <GenericNeedSection label="Why is the client needing funeral assistance?" whyFieldName="whyNeedFuneralAssistance" data={data} onChange={onChange} />;
    
    case 'stranded-travel':
      return <GenericNeedSection label="Why is the client needing stranded travel assistance?" whyFieldName="whyNeedStrandedTravelAssistance" data={data} onChange={onChange} />;
    
    case 'transition-to-work':
      return <GenericNeedSection label="Why is the client needing transition to work assistance?" whyFieldName="whyNeedTransitionToWork" data={data} onChange={onChange} showCanMeetOtherWay={false} />;
    
    default:
      return <div>Unknown need type</div>;
  }
};

export default NeedSectionFactory;

