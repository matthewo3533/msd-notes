import React, { useState, useEffect } from 'react';
import { ChangeOfAddressFormData } from '../App';
import Calendar from './Calendar';
import AddressInput from './AddressInput';
import FormattedTextarea from './FormattedTextarea';

interface ChangeOfAddressQuestionsProps {
  formData: ChangeOfAddressFormData;
  onFormDataChange: (data: Partial<ChangeOfAddressFormData>) => void;
}

const ChangeOfAddressQuestions: React.FC<ChangeOfAddressQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['general']));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections(prev => new Set(prev).add(sectionId));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const timeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        observer.observe(section);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const getDefaultCosts = (type: string) => {
    if (type === 'Board') {
      return [
        { label: 'Rent', amount: 0, frequency: 'weekly' },
        { label: 'Power', amount: 0, frequency: 'weekly' },
        { label: 'Wifi', amount: 0, frequency: 'weekly' },
        { label: 'Food', amount: 0, frequency: 'weekly' },
      ];
    }
    if (type === 'Mortgage') {
      return [
        { label: 'Mortgage', amount: 0, frequency: 'weekly' },
        { label: 'Rates', amount: 0, frequency: 'weekly' },
        { label: 'Insurance', amount: 0, frequency: 'weekly' },
      ];
    }
    // Rent or other
    return [
      { label: 'Rent', amount: 0, frequency: 'weekly' },
    ];
  };

  const handleInputChange = (field: keyof ChangeOfAddressFormData, value: any) => {
    if (field === 'accommodationType') {
      const type = value || '';
      onFormDataChange({
        accommodationType: type,
        accommodationCosts: type ? getDefaultCosts(type) : [],
      });
      return;
    }
    onFormDataChange({ [field]: value });
  };

  // Helpers for accommodation costs
  const setCosts = (costs: ChangeOfAddressFormData['accommodationCosts']) => {
    onFormDataChange({ accommodationCosts: costs });
  };

  useEffect(() => {
    // On first mount, if a type is set but no costs, seed defaults
    if (formData.accommodationType && (!formData.accommodationCosts || formData.accommodationCosts.length === 0)) {
      setCosts(getDefaultCosts(formData.accommodationType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCostChange = (index: number, field: 'label' | 'amount' | 'frequency', value: any) => {
    const updated = [...(formData.accommodationCosts || [])];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? (parseFloat(value) || 0) : value };
    setCosts(updated);
  };

  const handleAddCost = () => {
    setCosts([...(formData.accommodationCosts || []), { label: 'New cost', amount: 0, frequency: 'weekly' }]);
  };

  const handleRemoveCost = (index: number) => {
    const updated = (formData.accommodationCosts || []).filter((_, i) => i !== index);
    setCosts(updated);
  };

  return (
    <div className="form-sections-container">
      {/* General Comments */}
      <div 
        data-section="general"
        className={`form-section-card ${visibleSections.has('general') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>General Comments</h3>
        </div>
        
        <div className="form-group">
          <FormattedTextarea
            label="General Comments"
            value={formData.generalComments}
            onChange={(value) => handleInputChange('generalComments', value)}
            placeholder="Enter general comments"
            className="form-control"
          />
        </div>
      </div>

      {/* Address and Dates */}
      <div 
        data-section="address-dates"
        className={`form-section-card ${visibleSections.has('address-dates') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Address and Dates</h3>
        </div>
        
        <div className="form-group">
          <AddressInput
            value={formData.newAddress}
            onChange={(address, locationData) => {
              handleInputChange('newAddress', address);
            }}
            placeholder="Enter new address"
            label="New address"
          />
        </div>

        <div className="form-group">
          <label>Date of move</label>
          <Calendar
            value={formData.dateOfMove}
            onChange={(date) => {
              handleInputChange('dateOfMove', date);
            }}
            placeholder="Select date of move"
          />
        </div>

        <div className="form-group">
          <label>Date notified</label>
          <Calendar
            value={formData.dateNotified}
            onChange={(date) => {
              handleInputChange('dateNotified', date);
            }}
            placeholder="Select date notified"
          />
        </div>
      </div>

      {/* Accommodation Details */}
      <div 
        data-section="accommodation"
        className={`form-section-card ${visibleSections.has('accommodation') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Accommodation Details</h3>
        </div>
        
        <div className="form-group">
          <label>AS zone</label>
          <select
            className="form-control"
            value={formData.asZone}
            onChange={(e) => handleInputChange('asZone', e.target.value)}
          >
            <option value="">Select AS zone</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="form-group">
          <label>Accommodation type</label>
          <select
            className="form-control"
            value={formData.accommodationType}
            onChange={(e) => handleInputChange('accommodationType', e.target.value)}
          >
            <option value="">Select accommodation type</option>
            <option value="Board">Board</option>
            <option value="Rent">Rent</option>
            <option value="Mortgage">Mortgage</option>
          </select>
        </div>

        {/* Accommodation costs - dynamic list (only show once type is selected) */}
        {formData.accommodationType && (
          <div className="form-group">
            <label>
              {formData.accommodationType === 'Board'
                ? 'Board costs'
                : formData.accommodationType === 'Mortgage'
                ? 'Mortgage costs'
                : 'Accommodation cost'}
            </label>

            {(formData.accommodationCosts || []).map((cost, index) => (
              <div key={index} className="cost-row">
                <input
                  type="text"
                  className="form-control cost-label-input"
                  value={cost.label}
                  onChange={(e) => handleCostChange(index, 'label', e.target.value)}
                  placeholder="Label"
                />
                <div className="dual-input-row">
                  <input
                    type="number"
                    className="form-control"
                    value={cost.amount || ''}
                    onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                  />
                  <select
                    className="form-control"
                    value={cost.frequency || 'weekly'}
                    onChange={(e) => handleCostChange(index, 'frequency', e.target.value)}
                  >
                    <option value="daily">per day</option>
                    <option value="weekly">per week</option>
                    <option value="fortnightly">per fortnight</option>
                    <option value="monthly">per month</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="remove-cost-btn"
                  onClick={() => handleRemoveCost(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button type="button" className="add-cost-btn" onClick={handleAddCost}>
              Add cost
            </button>
          </div>
        )}

        <div className="form-group">
          <label>Tenancy agreement provided</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.tenancyAgreementProvided === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="tenancyAgreementProvidedYes"
                checked={formData.tenancyAgreementProvided === 'yes'}
                onChange={() => handleInputChange('tenancyAgreementProvided', formData.tenancyAgreementProvided === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.tenancyAgreementProvided === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="tenancyAgreementProvidedNo"
                checked={formData.tenancyAgreementProvided === 'no'}
                onChange={() => handleInputChange('tenancyAgreementProvided', formData.tenancyAgreementProvided === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>New AS rate</label>
          <input
            type="number"
            className="form-control"
            value={formData.newASRate || ''}
            onChange={(e) => handleInputChange('newASRate', parseFloat(e.target.value) || 0)}
            placeholder="Enter new AS rate"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Client is eligible for TAS</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.clientEligibleForTAS === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="clientEligibleForTASYes"
                checked={formData.clientEligibleForTAS === 'yes'}
                onChange={() => handleInputChange('clientEligibleForTAS', formData.clientEligibleForTAS === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.clientEligibleForTAS === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="clientEligibleForTASNo"
                checked={formData.clientEligibleForTAS === 'no'}
                onChange={() => handleInputChange('clientEligibleForTAS', formData.clientEligibleForTAS === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Arrears and Debt */}
      <div 
        data-section="arrears-debt"
        className={`form-section-card ${visibleSections.has('arrears-debt') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Arrears and Debt</h3>
        </div>
        
        <div className="form-group">
          <label>Arrears created</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.arrearsCreated === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="arrearsCreatedYes"
                checked={formData.arrearsCreated === 'yes'}
                onChange={() => handleInputChange('arrearsCreated', formData.arrearsCreated === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.arrearsCreated === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="arrearsCreatedNo"
                checked={formData.arrearsCreated === 'no'}
                onChange={() => handleInputChange('arrearsCreated', formData.arrearsCreated === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {formData.arrearsCreated === 'yes' && (
          <div className="form-group">
            <label>Arrears amount</label>
            <input
              type="number"
              className="form-control"
              value={formData.arrearsAmount || ''}
              onChange={(e) => handleInputChange('arrearsAmount', parseFloat(e.target.value) || 0)}
              placeholder="Enter arrears amount"
              min="0"
              step="0.01"
            />
          </div>
        )}

        <div className="form-group">
          <label>Debt created</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.debtCreated === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="debtCreatedYes"
                checked={formData.debtCreated === 'yes'}
                onChange={() => handleInputChange('debtCreated', formData.debtCreated === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.debtCreated === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="debtCreatedNo"
                checked={formData.debtCreated === 'no'}
                onChange={() => handleInputChange('debtCreated', formData.debtCreated === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {formData.debtCreated === 'yes' && (
          <div className="form-group">
            <label>Debt amount</label>
            <input
              type="number"
              className="form-control"
              value={formData.debtAmount || ''}
              onChange={(e) => handleInputChange('debtAmount', parseFloat(e.target.value) || 0)}
              placeholder="Enter debt amount"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeOfAddressQuestions;

