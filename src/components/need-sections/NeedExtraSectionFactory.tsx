import React from 'react';
import FormattedTextarea from '../FormattedTextarea';
import {
  HardshipNeedType,
  NeedData,
  CarRepairsNeedData,
  WhitewareNeedData,
  DentalNeedData,
  BondRentNeedData,
  FuneralAssistanceNeedData,
  StrandedTravelNeedData,
  TransitionToWorkNeedData
} from '../../types/multiNeed';

interface NeedExtraSectionFactoryProps {
  needType: HardshipNeedType;
  data: NeedData;
  onChange: (updates: Partial<NeedData>) => void;
}

const renderRadioGroup = (
  label: string,
  currentValue: string,
  onChange: (value: string) => void,
  options: Array<{ label: string; value: string }>
) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="radio-group">
      {options.map((option) => (
        <label
          key={option.value}
          className={`radio-btn ${currentValue === option.value ? 'selected' : ''}`}
        >
          {option.label}
          <input
            type="checkbox"
            checked={currentValue === option.value}
            onChange={() => onChange(currentValue === option.value ? '' : option.value)}
            className="visually-hidden"
          />
        </label>
      ))}
    </div>
  </div>
);

const NeedExtraSectionFactory: React.FC<NeedExtraSectionFactoryProps> = ({ needType, data, onChange }) => {
  if (needType === 'car-repairs') {
    const carData = data as CarRepairsNeedData;
    return (
      <>
        <div className="form-group">
          <label>Vehicle make/model</label>
          <input
            type="text"
            className="form-control"
            value={carData.vehicleMakeModel || ''}
            onChange={(e) => onChange({ vehicleMakeModel: e.target.value } as Partial<NeedData>)}
            placeholder="e.g., Toyota Corolla 2009"
          />
        </div>
        <div className="form-group">
          <label>License plate</label>
          <input
            type="text"
            className="form-control"
            value={carData.licensePlate || ''}
            onChange={(e) => onChange({ licensePlate: e.target.value } as Partial<NeedData>)}
            placeholder="e.g., ABC123"
          />
        </div>
        <div className="form-group">
          <label>Odometer</label>
          <input
            type="text"
            className="form-control"
            value={carData.odometer || ''}
            onChange={(e) => onChange({ odometer: e.target.value } as Partial<NeedData>)}
            placeholder="e.g., 145000"
          />
        </div>
        <div className="form-group">
          <label>Vehicle owner</label>
          <input
            type="text"
            className="form-control"
            value={carData.vehicleOwner || ''}
            onChange={(e) => onChange({ vehicleOwner: e.target.value } as Partial<NeedData>)}
            placeholder="Enter vehicle owner"
          />
        </div>
        <FormattedTextarea
          label="NZTA verification"
          value={carData.nztaVerification || ''}
          onChange={(value) => onChange({ nztaVerification: value } as Partial<NeedData>)}
          placeholder="Add any verification details..."
          className="form-control"
        />
      </>
    );
  }

  if (needType === 'whiteware') {
    const applianceData = data as WhitewareNeedData;
    return (
      <>
        {renderRadioGroup(
          'Household size',
          applianceData.householdSize || '',
          (value) => onChange({ householdSize: value } as Partial<NeedData>),
          [
            { label: '1-2 people', value: '1-2' },
            { label: '3-4 people', value: '3-4' },
            { label: '5+ people', value: '5+' }
          ]
        )}
        {renderRadioGroup(
          'Address/contact details confirmed?',
          applianceData.addressContactConfirmed || '',
          (value) => onChange({ addressContactConfirmed: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        {renderRadioGroup(
          'Space measured and item will fit?',
          applianceData.spaceMeasured || '',
          (value) => onChange({ spaceMeasured: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        <div className="form-group">
          <label>Appliance model</label>
          <input
            type="text"
            className="form-control"
            value={applianceData.applianceModel || ''}
            onChange={(e) => onChange({ applianceModel: e.target.value } as Partial<NeedData>)}
            placeholder="Enter appliance model"
          />
        </div>
        <div className="form-group">
          <label>Appliance CA number</label>
          <input
            type="text"
            className="form-control"
            value={applianceData.applianceCANumber || ''}
            onChange={(e) => onChange({ applianceCANumber: e.target.value } as Partial<NeedData>)}
            placeholder="Enter CA number"
          />
        </div>
        {renderRadioGroup(
          'Special delivery instructions?',
          applianceData.specialDeliveryInstructions || '',
          (value) => onChange({ specialDeliveryInstructions: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        {applianceData.specialDeliveryInstructions === 'yes' && (
          <FormattedTextarea
            label="Delivery instructions"
            value={applianceData.deliveryInstructionsDetails || ''}
            onChange={(value) => onChange({ deliveryInstructionsDetails: value } as Partial<NeedData>)}
            placeholder="Describe delivery instructions..."
            className="form-control"
          />
        )}
      </>
    );
  }

  if (needType === 'dental') {
    const dentalData = data as DentalNeedData;
    return (
      <>
        {renderRadioGroup(
          'SNG eligible?',
          dentalData.sngEligible || '',
          (value) => onChange({ sngEligible: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        <div className="form-group">
          <label>SNG balance</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={dentalData.sngBalance || ''}
              onChange={(e) => onChange({ sngBalance: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </>
    );
  }

  if (needType === 'bond-rent') {
    const bondData = data as BondRentNeedData;
    return (
      <>
        <div className="form-group">
          <label>New address</label>
          <input
            type="text"
            className="form-control"
            value={bondData.newAddress || ''}
            onChange={(e) => onChange({ newAddress: e.target.value } as Partial<NeedData>)}
            placeholder="Enter new address"
          />
        </div>
        <div className="form-group">
          <label>AS Zone</label>
          <input
            type="number"
            className="form-control"
            value={bondData.asZone || ''}
            onChange={(e) => onChange({ asZone: parseInt(e.target.value, 10) || 0 } as Partial<NeedData>)}
            placeholder="AS Zone"
          />
        </div>
        <div className="form-group">
          <label>Weekly rent</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={bondData.weeklyRent || ''}
              onChange={(e) => onChange({ weeklyRent: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Tenancy start date</label>
          <input
            type="date"
            className="form-control"
            value={bondData.tenancyStartDate || ''}
            onChange={(e) => onChange({ tenancyStartDate: e.target.value } as Partial<NeedData>)}
          />
        </div>
        <div className="form-group">
          <label>Bond amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={bondData.bondAmount || ''}
              onChange={(e) => onChange({ bondAmount: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Rent in advance amount</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={bondData.rentInAdvanceAmount || ''}
              onChange={(e) => onChange({ rentInAdvanceAmount: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        {renderRadioGroup(
          'Is the tenancy affordable long-term?',
          bondData.tenancyAffordable || '',
          (value) => onChange({ tenancyAffordable: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
      </>
    );
  }

  if (needType === 'funeral-assistance' || needType === 'stranded-travel') {
    const travelData =
      needType === 'funeral-assistance'
        ? (data as FuneralAssistanceNeedData)
        : (data as StrandedTravelNeedData);

    return (
      <>
        {renderRadioGroup(
          'Petrol assistance required?',
          travelData.petrolAssistance || '',
          (value) => onChange({ petrolAssistance: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        <div className="form-group">
          <label>Start location</label>
          <input
            type="text"
            className="form-control"
            value={travelData.startLocation || ''}
            onChange={(e) => onChange({ startLocation: e.target.value } as Partial<NeedData>)}
            placeholder="Start location"
          />
        </div>
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            className="form-control"
            value={travelData.destination || ''}
            onChange={(e) => onChange({ destination: e.target.value } as Partial<NeedData>)}
            placeholder="Destination"
          />
        </div>
        {renderRadioGroup(
          'Return trip required?',
          travelData.returnTrip || '',
          (value) => onChange({ returnTrip: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        <div className="form-group">
          <label>Distance (km)</label>
          <input
            type="number"
            className="form-control"
            value={travelData.distance || ''}
            onChange={(e) => onChange({ distance: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
            placeholder="Distance in km"
          />
        </div>
        <div className="form-group">
          <label>Travel cost</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={travelData.travelCost || ''}
              onChange={(e) => onChange({ travelCost: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </>
    );
  }

  if (needType === 'transition-to-work') {
    const workData = data as TransitionToWorkNeedData;
    return (
      <>
        <div className="form-group">
          <label>Help type</label>
          <input
            type="text"
            className="form-control"
            value={workData.helpType || ''}
            onChange={(e) => onChange({ helpType: e.target.value } as Partial<NeedData> )}
            placeholder="e.g., Travel, Clothing"
          />
        </div>
        <div className="form-group">
          <label>Employer name</label>
          <input
            type="text"
            className="form-control"
            value={workData.employerName || ''}
            onChange={(e) => onChange({ employerName: e.target.value } as Partial<NeedData>)}
            placeholder="Enter employer name"
          />
        </div>
        <div className="form-group">
          <label>Start date</label>
          <input
            type="date"
            className="form-control"
            value={workData.startDate || ''}
            onChange={(e) => onChange({ startDate: e.target.value } as Partial<NeedData>)}
          />
        </div>
        <div className="form-group">
          <label>First payday</label>
          <input
            type="date"
            className="form-control"
            value={workData.firstPayday || ''}
            onChange={(e) => onChange({ firstPayday: e.target.value } as Partial<NeedData>)}
          />
        </div>
        <div className="form-group">
          <label>Hours per week</label>
          <input
            type="number"
            className="form-control"
            value={workData.hoursPerWeek || ''}
            onChange={(e) => onChange({ hoursPerWeek: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
            placeholder="0"
            min="0"
          />
        </div>
        {renderRadioGroup(
          'Contract uploaded?',
          workData.contractUploaded || '',
          (value) => onChange({ contractUploaded: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        {renderRadioGroup(
          'Petrol assistance needed?',
          workData.petrolAssistance || '',
          (value) => onChange({ petrolAssistance: value } as Partial<NeedData>),
          [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]
        )}
        {workData.petrolAssistance === 'yes' && (
          <>
            <div className="form-group">
              <label>Start location</label>
              <input
                type="text"
                className="form-control"
                value={workData.startLocation || ''}
                onChange={(e) => onChange({ startLocation: e.target.value } as Partial<NeedData>)}
                placeholder="Start location"
              />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                className="form-control"
                value={workData.destination || ''}
                onChange={(e) => onChange({ destination: e.target.value } as Partial<NeedData>)}
                placeholder="Destination"
              />
            </div>
            {renderRadioGroup(
              'Return trip required?',
              workData.returnTrip || '',
              (value) => onChange({ returnTrip: value } as Partial<NeedData>),
              [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
              ]
            )}
            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                className="form-control"
                value={workData.distance || ''}
                onChange={(e) => onChange({ distance: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
                placeholder="Distance in km"
              />
            </div>
            <div className="form-group">
              <label>Travel cost</label>
              <div className="dollar-input">
                <input
                  type="number"
                  className="form-control"
                  value={workData.travelCost || ''}
                  onChange={(e) => onChange({ travelCost: parseFloat(e.target.value) || 0 } as Partial<NeedData>)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return null;
};

export default NeedExtraSectionFactory;

