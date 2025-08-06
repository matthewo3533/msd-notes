import React, { useState, useEffect, useRef } from 'react';
import { TASGrantFormData } from '../App';

interface TASGrantQuestionsProps {
  formData: TASGrantFormData;
  onFormDataChange: (data: Partial<TASGrantFormData>) => void;
}

function autoResizeTextarea(el: HTMLTextAreaElement | null) {
  if (el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    if (el.scrollHeight > 800) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  }
}

const TASGrantQuestions: React.FC<TASGrantQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [animatingQuestions, setAnimatingQuestions] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Make the first section visible immediately
    setVisibleSections(new Set(['general']));
    
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

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      // Observe sections with data-section attributes
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        observer.observe(section);
      });
      
      // Also observe form-section-card elements (for reusable components)
      const formSections = document.querySelectorAll('.form-section-card');
      formSections.forEach((section) => {
        observer.observe(section);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const handleSkip = (questionKey: string) => {
    setAnimatingQuestions(prev => new Set(prev).add(questionKey));
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setSkippedQuestions(prev => new Set(prev).add(questionKey));
      setAnimatingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionKey);
        return newSet;
      });
    }, 300);
  };

  const handleRestore = (questionKey: string) => {
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionKey);
      return newSet;
    });
  };

  const handleInputChange = (field: keyof TASGrantFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleDateChange = (field: keyof TASGrantFormData, value: string) => {
    // Convert date from dd/mm/yyyy to yyyy-mm-dd for input
    if (value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const formattedDate = `${year}-${month}-${day}`;
        onFormDataChange({ [field]: value });
      }
    } else {
      onFormDataChange({ [field]: value });
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  return (
    <div className="form-sections-container">
      {/* General Questions Section */}
      <div 
        ref={(el) => { sectionRefs.current['general'] = el; }}
        data-section="general"
        className={`form-section-card ${visibleSections.has('general') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>TAS Grant/Reapplication Questions</h3>
          <div className="section-number">1</div>
        </div>
        
        <div className="form-group">
          <label>What is the date of first contact?</label>
          <input
            type="date"
            className="form-control"
            value={formatDateForInput(formData.dateOfFirstContact)}
            onChange={(e) => {
              const date = e.target.value;
              if (date) {
                const [year, month, day] = date.split('-');
                const formattedDate = `${day}/${month}/${year}`;
                handleInputChange('dateOfFirstContact', formattedDate);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Does client consent to reapplication being complete on their behalf?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.clientConsent === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="clientConsentYes"
                checked={formData.clientConsent === 'yes'}
                onChange={() => handleInputChange('clientConsent', formData.clientConsent === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.clientConsent === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="clientConsentNo"
                checked={formData.clientConsent === 'no'}
                onChange={() => handleInputChange('clientConsent', formData.clientConsent === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Does the client have Child Support liable costs?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.childSupportLiableCosts === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="childSupportLiableCostsYes"
                checked={formData.childSupportLiableCosts === 'yes'}
                onChange={() => handleInputChange('childSupportLiableCosts', formData.childSupportLiableCosts === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.childSupportLiableCosts === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="childSupportLiableCostsNo"
                checked={formData.childSupportLiableCosts === 'no'}
                onChange={() => handleInputChange('childSupportLiableCosts', formData.childSupportLiableCosts === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {formData.childSupportLiableCosts === 'yes' && (
          <div className="form-group">
            <label>Child Support API consent given?</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.childSupportAPIConsent === 'yes' ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  name="childSupportAPIConsentYes"
                  checked={formData.childSupportAPIConsent === 'yes'}
                  onChange={() => handleInputChange('childSupportAPIConsent', formData.childSupportAPIConsent === 'yes' ? '' : 'yes')}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.childSupportAPIConsent === 'no' ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
                  name="childSupportAPIConsentNo"
                  checked={formData.childSupportAPIConsent === 'no'}
                  onChange={() => handleInputChange('childSupportAPIConsent', formData.childSupportAPIConsent === 'no' ? '' : 'no')}
                  className="visually-hidden"
                />
              </label>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Are the client's address details correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.addressDetailsCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="addressDetailsCorrectYes"
                checked={formData.addressDetailsCorrect === 'yes'}
                onChange={() => handleInputChange('addressDetailsCorrect', formData.addressDetailsCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.addressDetailsCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="addressDetailsCorrectNo"
                checked={formData.addressDetailsCorrect === 'no'}
                onChange={() => handleInputChange('addressDetailsCorrect', formData.addressDetailsCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Are the client's contact details correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.contactDetailsCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="contactDetailsCorrectYes"
                checked={formData.contactDetailsCorrect === 'yes'}
                onChange={() => handleInputChange('contactDetailsCorrect', formData.contactDetailsCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.contactDetailsCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="contactDetailsCorrectNo"
                checked={formData.contactDetailsCorrect === 'no'}
                onChange={() => handleInputChange('contactDetailsCorrect', formData.contactDetailsCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>What are the client's accommodation costs?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.accommodationCosts || ''}
              onChange={(e) => handleInputChange('accommodationCosts', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div className="tip-box">
            <strong>Tip:</strong> Be sure to look for an up to date tenancy agreement on the client's file.
          </div>
        </div>

        <div className="form-group">
          <label>Have you checked if Rent/Board includes utilities?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.rentBoardIncludesUtilities === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="rentBoardIncludesUtilitiesYes"
                checked={formData.rentBoardIncludesUtilities === 'yes'}
                onChange={() => handleInputChange('rentBoardIncludesUtilities', formData.rentBoardIncludesUtilities === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.rentBoardIncludesUtilities === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="rentBoardIncludesUtilitiesNo"
                checked={formData.rentBoardIncludesUtilities === 'no'}
                onChange={() => handleInputChange('rentBoardIncludesUtilities', formData.rentBoardIncludesUtilities === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Have home Ownership costs changed?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.homeOwnershipCostsChanged === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="homeOwnershipCostsChangedYes"
                checked={formData.homeOwnershipCostsChanged === 'yes'}
                onChange={() => handleInputChange('homeOwnershipCostsChanged', formData.homeOwnershipCostsChanged === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.homeOwnershipCostsChanged === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="homeOwnershipCostsChangedNo"
                checked={formData.homeOwnershipCostsChanged === 'no'}
                onChange={() => handleInputChange('homeOwnershipCostsChanged', formData.homeOwnershipCostsChanged === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Have the client's disability costs changed?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.disabilityCostsChanged === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="disabilityCostsChangedYes"
                checked={formData.disabilityCostsChanged === 'yes'}
                onChange={() => handleInputChange('disabilityCostsChanged', formData.disabilityCostsChanged === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.disabilityCostsChanged === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="disabilityCostsChangedNo"
                checked={formData.disabilityCostsChanged === 'no'}
                onChange={() => handleInputChange('disabilityCostsChanged', formData.disabilityCostsChanged === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Have the client's TAS costs changed?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.tasCostsChanged === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="tasCostsChangedYes"
                checked={formData.tasCostsChanged === 'yes'}
                onChange={() => handleInputChange('tasCostsChanged', formData.tasCostsChanged === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.tasCostsChanged === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="tasCostsChangedNo"
                checked={formData.tasCostsChanged === 'no'}
                onChange={() => handleInputChange('tasCostsChanged', formData.tasCostsChanged === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>If client's Family Tax Credits are paid by IRD, is the amount correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.familyTaxCreditsCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="familyTaxCreditsCorrectYes"
                checked={formData.familyTaxCreditsCorrect === 'yes'}
                onChange={() => handleInputChange('familyTaxCreditsCorrect', formData.familyTaxCreditsCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.familyTaxCreditsCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="familyTaxCreditsCorrectNo"
                checked={formData.familyTaxCreditsCorrect === 'no'}
                onChange={() => handleInputChange('familyTaxCreditsCorrect', formData.familyTaxCreditsCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
          <div className="tip-box">
            <strong>Tip:</strong> Be sure to look for IRD verification on the client's file.
          </div>
        </div>

        <div className="form-group">
          <label>Is the client's income correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.incomeCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="incomeCorrectYes"
                checked={formData.incomeCorrect === 'yes'}
                onChange={() => handleInputChange('incomeCorrect', formData.incomeCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.incomeCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="incomeCorrectNo"
                checked={formData.incomeCorrect === 'no'}
                onChange={() => handleInputChange('incomeCorrect', formData.incomeCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Are the client's assets correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.assetsCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="assetsCorrectYes"
                checked={formData.assetsCorrect === 'yes'}
                onChange={() => handleInputChange('assetsCorrect', formData.assetsCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.assetsCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="assetsCorrectNo"
                checked={formData.assetsCorrect === 'no'}
                onChange={() => handleInputChange('assetsCorrect', formData.assetsCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Are the client's relationship details correct?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.relationshipDetailsCorrect === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="relationshipDetailsCorrectYes"
                checked={formData.relationshipDetailsCorrect === 'yes'}
                onChange={() => handleInputChange('relationshipDetailsCorrect', formData.relationshipDetailsCorrect === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.relationshipDetailsCorrect === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="relationshipDetailsCorrectNo"
                checked={formData.relationshipDetailsCorrect === 'no'}
                onChange={() => handleInputChange('relationshipDetailsCorrect', formData.relationshipDetailsCorrect === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>If updated, has verification been received for allowable costs?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.verificationReceived === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="verificationReceivedYes"
                checked={formData.verificationReceived === 'yes'}
                onChange={() => handleInputChange('verificationReceived', formData.verificationReceived === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.verificationReceived === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="verificationReceivedNo"
                checked={formData.verificationReceived === 'no'}
                onChange={() => handleInputChange('verificationReceived', formData.verificationReceived === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Deficiency:</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.deficiency || ''}
              onChange={(e) => handleInputChange('deficiency', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>TAS rate payable:</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.tasRatePayable || ''}
              onChange={(e) => handleInputChange('tasRatePayable', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Has a necessary and reasonable step been discussed?</label>
          <textarea
            className="form-control"
            value={formData.necessaryReasonableSteps}
            onChange={(e) => handleInputChange('necessaryReasonableSteps', e.target.value)}
            placeholder="Please describe the necessary and reasonable steps discussed..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>

        <div className="form-group">
          <label>Does client understand obligations?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.clientUnderstandsObligations === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="clientUnderstandsObligationsYes"
                checked={formData.clientUnderstandsObligations === 'yes'}
                onChange={() => handleInputChange('clientUnderstandsObligations', formData.clientUnderstandsObligations === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.clientUnderstandsObligations === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="clientUnderstandsObligationsNo"
                checked={formData.clientUnderstandsObligations === 'no'}
                onChange={() => handleInputChange('clientUnderstandsObligations', formData.clientUnderstandsObligations === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Outcome:</label>
          <div className="radio-group vertical">
            <label className={`radio-btn ${formData.outcome === 'regranted' ? 'selected' : ''}`}>Regranted
              <input
                type="checkbox"
                name="outcomeRegranted"
                checked={formData.outcome === 'regranted'}
                onChange={() => handleInputChange('outcome', formData.outcome === 'regranted' ? '' : 'regranted')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.outcome === 'no-entitlement' ? 'selected' : ''}`}>No entitlement
              <input
                type="checkbox"
                name="outcomeNoEntitlement"
                checked={formData.outcome === 'no-entitlement'}
                onChange={() => handleInputChange('outcome', formData.outcome === 'no-entitlement' ? '' : 'no-entitlement')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.outcome === 'client-declined' ? 'selected' : ''}`}>Client declined to reapply
              <input
                type="checkbox"
                name="outcomeClientDeclined"
                checked={formData.outcome === 'client-declined'}
                onChange={() => handleInputChange('outcome', formData.outcome === 'client-declined' ? '' : 'client-declined')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.outcome === 'not-regranted' ? 'selected' : ''}`}>Not regranted - Further action needed
              <input
                type="checkbox"
                name="outcomeNotRegranted"
                checked={formData.outcome === 'not-regranted'}
                onChange={() => handleInputChange('outcome', formData.outcome === 'not-regranted' ? '' : 'not-regranted')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        {formData.outcome === 'regranted' && (
          <div className="form-group">
            <label>Regrant date:</label>
            <input
              type="date"
              className="form-control"
              value={formatDateForInput(formData.regrantDate)}
              onChange={(e) => {
                const date = e.target.value;
                if (date) {
                  const [year, month, day] = date.split('-');
                  const formattedDate = `${day}/${month}/${year}`;
                  handleInputChange('regrantDate', formattedDate);
                }
              }}
            />
          </div>
        )}

        {formData.outcome === 'not-regranted' && (
          <div className="form-group">
            <label>What further action is needed?</label>
            <textarea
              className="form-control"
              value={formData.furtherActionNeeded}
              onChange={(e) => handleInputChange('furtherActionNeeded', e.target.value)}
              placeholder="Please describe what further action is needed..."
              ref={el => autoResizeTextarea(el)}
              onInput={e => autoResizeTextarea(e.currentTarget)}
            />
          </div>
        )}

        <div className="form-group">
          <label>LSUM Sent</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.lsumSent === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="lsumSentYes"
                checked={formData.lsumSent === 'yes'}
                onChange={() => handleInputChange('lsumSent', formData.lsumSent === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.lsumSent === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="lsumSentNo"
                checked={formData.lsumSent === 'no'}
                onChange={() => handleInputChange('lsumSent', formData.lsumSent === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Arrears issued?</label>
          <div className="dollar-input">
            <input
              type="number"
              className="form-control"
              value={formData.arrearsIssued || ''}
              onChange={(e) => handleInputChange('arrearsIssued', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TASGrantQuestions; 