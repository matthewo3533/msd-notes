import React, { useEffect, useRef, useState } from 'react';
import { BenefitGrantDocumentStatus, BenefitGrantFormData } from '../App';
import ExpandableSection from './ExpandableSection';
import Calendar from './Calendar';
import FormattedTextarea from './FormattedTextarea';
import CalculatedAmountInput from './CalculatedAmountInput';

interface BenefitGrantQuestionsProps {
  formData: BenefitGrantFormData;
  onFormDataChange: (data: Partial<BenefitGrantFormData>) => void;
}

const BENEFIT_TYPES: { value: string; label: string }[] = [
  { value: 'JS', label: 'Jobseeker Support' },
  { value: 'SPS', label: 'Sole Parent Support' },
  { value: 'SLP', label: 'Supported Living Payment' },
  { value: 'EB', label: 'Emergency Benefit' },
];

const REASON_OPTIONS = [
  'Employment ceased',
  'Incapacity',
  'Income reduced',
  'Study ceased',
  'Separated from partner',
  'Testing eligibility',
  'Left school',
  'Returned to NZ',
  'Released from prison',
  'Available for work',
  'Transfer from another benefit',
];

const STAND_DOWN_OPTIONS = ['Waived', '1 week', '2 weeks'];
const DRIVERS_LICENSE_OPTIONS = ['None', 'Learners', 'Restricted', 'Full'];

// Text field with a filterable dropdown, matching the income section cost inputs.
const ReasonInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Type or select a reason...' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState(REASON_OPTIONS);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showDropdown && filtered.length > 0) {
      setDropdownHeight(Math.min(filtered.length * 50, 200));
    } else {
      setDropdownHeight(0);
    }
  }, [showDropdown, filtered]);

  const selectOption = (option: string) => {
    onChange(option);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setFiltered(
      value.trim()
        ? REASON_OPTIONS.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
        : REASON_OPTIONS
    );
    if (!showDropdown) {
      setShowDropdown(true);
      setSelectedIndex(-1);
    }
  };

  const handleChange = (next: string) => {
    onChange(next);
    if (next.trim() === '') {
      setFiltered(REASON_OPTIONS);
    } else {
      setFiltered(REASON_OPTIONS.filter((o) => o.toLowerCase().includes(next.toLowerCase())));
    }
    setShowDropdown(true);
    if (selectedIndex >= 0) {
      setSelectedIndex(-1);
    }
  };

  const scrollToSelectedOption = (index: number) => {
    if (containerRef.current) {
      const suggestions = containerRef.current.querySelectorAll('.cost-suggestion');
      const selectedElement = suggestions[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const options = value.trim()
          ? REASON_OPTIONS.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
          : REASON_OPTIONS;
        setFiltered(options);
        setShowDropdown(true);
        setSelectedIndex(e.key === 'ArrowDown' ? 0 : options.length - 1);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev < filtered.length - 1 ? prev + 1 : 0;
          scrollToSelectedOption(next);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : filtered.length - 1;
          scrollToSelectedOption(next);
          return next;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filtered.length) {
          selectOption(filtered[selectedIndex]);
        } else if (filtered.length > 0) {
          selectOption(filtered[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
        break;
      case 'Tab':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <>
      <div className="cost-input-container reason-input-container" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        {showDropdown && filtered.length > 0 && (
          <div className="cost-dropdown" tabIndex={-1}>
            {filtered.map((option, index) => (
              <div
                key={option}
                className={`cost-suggestion ${index === selectedIndex ? 'selected' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="suggestions-spacer" style={{ height: `${dropdownHeight}px` }} />
    </>
  );
};

const YesNoGroup: React.FC<{
  value: string;
  onChange: (value: string) => void;
  namePrefix: string;
}> = ({ value, onChange, namePrefix }) => (
  <div className="radio-group">
    <label className={`radio-btn ${value === 'yes' ? 'selected' : ''}`}>Yes
      <input
        type="checkbox"
        name={`${namePrefix}Yes`}
        checked={value === 'yes'}
        onChange={() => onChange(value === 'yes' ? '' : 'yes')}
        className="visually-hidden"
      />
    </label>
    <label className={`radio-btn ${value === 'no' ? 'selected' : ''}`}>No
      <input
        type="checkbox"
        name={`${namePrefix}No`}
        checked={value === 'no'}
        onChange={() => onChange(value === 'no' ? '' : 'no')}
        className="visually-hidden"
      />
    </label>
  </div>
);

const BenefitGrantQuestions: React.FC<BenefitGrantQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['benefit-type', 'why-applied', 'identity']));
  const [draggedDoc, setDraggedDoc] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<BenefitGrantDocumentStatus | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [docsAnimate, setDocsAnimate] = useState(false);
  const docsAnimatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections((prev) => new Set(prev).add(sectionId));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const timeoutId = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((section) => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (visibleSections.has('documents-dnd') && !docsAnimatedRef.current) {
      docsAnimatedRef.current = true;
      setDocsAnimate(true);
    }
  }, [visibleSections]);

  const handleInputChange = (field: keyof BenefitGrantFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const setDocumentStatus = (name: string, status: BenefitGrantDocumentStatus) => {
    const documents = formData.documents.map((doc) =>
      doc.name === name ? { ...doc, status } : doc
    );
    onFormDataChange({ documents });
  };

  const handleDrop = (status: BenefitGrantDocumentStatus) => {
    if (draggedDoc) {
      setDocumentStatus(draggedDoc, status);
      setDraggedDoc(null);
    }
    setDragOverStatus(null);
  };

  const addDocument = () => {
    const name = newDocName.trim();
    if (!name) return;
    if (formData.documents.some((doc) => doc.name.toLowerCase() === name.toLowerCase())) {
      setNewDocName('');
      return;
    }
    onFormDataChange({ documents: [...formData.documents, { name, status: 'unassigned' }] });
    setNewDocName('');
  };

  const removeDocument = (name: string) => {
    onFormDataChange({ documents: formData.documents.filter((doc) => doc.name !== name) });
  };

  const dropZoneProps = (status: BenefitGrantDocumentStatus) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragOverStatus !== status) setDragOverStatus(status);
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverStatus(status);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOverStatus((prev) => (prev === status ? null : prev));
      }
    },
    onDrop: () => handleDrop(status),
  });

  const renderDocChip = (name: string, animIndex: number) => (
    <div
      key={name}
      className={`doc-chip ${draggedDoc === name ? 'dragging' : ''} ${docsAnimate ? 'doc-chip-scroll-in' : ''}`}
      style={{ animationDelay: docsAnimate ? `${animIndex * 0.05}s` : undefined }}
      draggable
      onDragStart={(e) => {
        setDraggedDoc(name);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => {
        setDraggedDoc(null);
        setDragOverStatus(null);
      }}
    >
      <span className="doc-chip-label">{name}</span>
      <button
        type="button"
        className="doc-chip-remove"
        onClick={() => removeDocument(name)}
        title="Remove document"
        draggable={false}
      >
        ×
      </button>
    </div>
  );

  const docsByStatus = (status: BenefitGrantDocumentStatus) =>
    formData.documents.filter((doc) => doc.status === status);

  return (
    <div className="form-sections-container">
      {/* Benefit Type - hero section */}
      <div
        className={`benefit-type-hero ${visibleSections.has('benefit-type') ? 'section-visible' : ''}`}
        data-section="benefit-type"
      >
        <div className="benefit-type-hero-header">
          <h2 className="benefit-type-hero-title">Select benefit type</h2>
          <p className="benefit-type-hero-subtitle">Choose the benefit you are granting for this application</p>
        </div>
        <div className="benefit-type-grid">
          {BENEFIT_TYPES.map((type, index) => (
            <button
              key={type.value}
              type="button"
              className={`benefit-type-card benefit-type-${type.value.toLowerCase()} ${formData.benefitType === type.value ? 'selected' : ''}`}
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() =>
                handleInputChange('benefitType', formData.benefitType === type.value ? '' : type.value)
              }
            >
              <span className="benefit-type-check" aria-hidden="true">✓</span>
              <span className="benefit-type-acronym">{type.value}</span>
              <span className="benefit-type-label">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Why have they applied */}
      <ExpandableSection
        title="Notes"
        dataSection="why-applied"
        isVisible={visibleSections.has('why-applied')}
        defaultExpanded={true}
      >
        <div className="form-group question-gap">
          <FormattedTextarea
            label="Why have they applied?"
            value={formData.applicationNotes}
            onChange={(v) => handleInputChange('applicationNotes', v)}
            placeholder="Describe why the client has applied..."
            className="form-control"
          />
        </div>

        <div className="form-group" data-section="documents-dnd">
          <label>Documents required</label>
          <p className="doc-dnd-hint">Drag each document into the Provided or Awaiting documents box.</p>
          <div className="doc-dnd">
            <div
              className={`doc-dnd-pool ${dragOverStatus === 'unassigned' ? 'drag-over' : ''}`}
              {...dropZoneProps('unassigned')}
            >
              <div className="doc-dnd-pool-label">Documents</div>
              <div className="doc-chip-list">
                {docsByStatus('unassigned').map((doc, i) => renderDocChip(doc.name, i))}
                <div className="doc-add-inline">
                  <input
                    type="text"
                    className="doc-add-input"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addDocument();
                      }
                    }}
                    placeholder="Add document..."
                  />
                  <button type="button" className="doc-add-btn" onClick={addDocument} title="Add document">
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="doc-dnd-boxes">
              <div
                className={`doc-dnd-box doc-dnd-provided ${dragOverStatus === 'provided' ? 'drag-over' : ''}`}
                {...dropZoneProps('provided')}
              >
                <div className="doc-dnd-box-title">Provided</div>
                <div className="doc-chip-list">
                  {docsByStatus('provided').map((doc, i) =>
                    renderDocChip(doc.name, docsByStatus('unassigned').length + i)
                  )}
                </div>
              </div>
              <div
                className={`doc-dnd-box doc-dnd-not-provided ${dragOverStatus === 'not-provided' ? 'drag-over' : ''}`}
                {...dropZoneProps('not-provided')}
              >
                <div className="doc-dnd-box-title">Awaiting documents</div>
                <div className="doc-chip-list">
                  {docsByStatus('not-provided').map((doc, i) =>
                    renderDocChip(
                      doc.name,
                      docsByStatus('unassigned').length + docsByStatus('provided').length + i
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Section 1: Identity */}
      <ExpandableSection
        title="Identity"
        dataSection="identity"
        isVisible={visibleSections.has('identity')}
        defaultExpanded={true}
      >
        <div className="form-group">
          <label>Online identity check</label>
          <YesNoGroup
            value={formData.onlineIdentityCheck}
            onChange={(v) => handleInputChange('onlineIdentityCheck', v)}
            namePrefix="onlineIdentityCheck"
          />
        </div>

        <div className="form-group">
          <label>Primary and supporting documents sighted</label>
          <YesNoGroup
            value={formData.documentsSighted}
            onChange={(v) => handleInputChange('documentsSighted', v)}
            namePrefix="documentsSighted"
          />
        </div>

        <div className="form-group">
          <label>IRD number validated</label>
          <YesNoGroup
            value={formData.irdValidated}
            onChange={(v) => handleInputChange('irdValidated', v)}
            namePrefix="irdValidated"
          />
        </div>

        {formData.irdValidated === 'no' && (
          <>
            <div className="form-group">
              <label>IRD number required</label>
              <YesNoGroup
                value={formData.irdRequired}
                onChange={(v) => handleInputChange('irdRequired', v)}
                namePrefix="irdRequired"
              />
              {formData.irdRequired === 'no' && (
                <input
                  type="text"
                  className="form-control"
                  style={{ marginTop: '0.5rem' }}
                  value={formData.irdRequiredDetail}
                  onChange={(e) => handleInputChange('irdRequiredDetail', e.target.value)}
                  placeholder="Provide detail"
                />
              )}
            </div>

            <div className="form-group">
              <label>IRD number evidence required</label>
              <YesNoGroup
                value={formData.irdEvidenceRequired}
                onChange={(v) => handleInputChange('irdEvidenceRequired', v)}
                namePrefix="irdEvidenceRequired"
              />
              {formData.irdEvidenceRequired === 'no' && (
                <input
                  type="text"
                  className="form-control"
                  style={{ marginTop: '0.5rem' }}
                  value={formData.irdEvidenceRequiredDetail}
                  onChange={(e) => handleInputChange('irdEvidenceRequiredDetail', e.target.value)}
                  placeholder="Provide detail"
                />
              )}
            </div>

            <div className="form-group">
              <label>IRD number evidence request letter sent</label>
              <YesNoGroup
                value={formData.irdEvidenceLetterSent}
                onChange={(v) => handleInputChange('irdEvidenceLetterSent', v)}
                namePrefix="irdEvidenceLetterSent"
              />
            </div>

            <div className="form-group">
              <label>Evidence received</label>
              <YesNoGroup
                value={formData.evidenceReceived}
                onChange={(v) => handleInputChange('evidenceReceived', v)}
                namePrefix="evidenceReceived"
              />
            </div>
          </>
        )}
      </ExpandableSection>

      {/* Section 2: Entitlement */}
      <ExpandableSection
        title="Entitlement"
        dataSection="entitlement"
        isVisible={visibleSections.has('entitlement')}
        defaultExpanded={true}
      >
        <div className="field-row-halves">
          <div className="form-group">
            <label>Date of reps</label>
            <Calendar
              value={formData.dateOfReps}
              onChange={(date) => handleInputChange('dateOfReps', date)}
              placeholder="Select date of reps"
            />
          </div>

          <div className="form-group">
            <label>Date of event</label>
            <Calendar
              value={formData.dateOfEvent}
              onChange={(date) => handleInputChange('dateOfEvent', date)}
              placeholder="Select date of event"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Reason for event</label>
          <ReasonInput
            value={formData.reasonForEvent}
            onChange={(v) => handleInputChange('reasonForEvent', v)}
          />
        </div>

        <div className="form-group">
          <label>Holiday pay</label>
          <YesNoGroup
            value={formData.holidayPay}
            onChange={(v) => handleInputChange('holidayPay', v)}
            namePrefix="holidayPay"
          />
        </div>

        <div className="field-row-thirds">
          <div className="form-group">
            <label>4 weeks income</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.income4Weeks}
                onValueChange={(v) => handleInputChange('income4Weeks', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>26 weeks income</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.income26Weeks}
                onValueChange={(v) => handleInputChange('income26Weeks', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>52 weeks income</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.income52Weeks}
                onValueChange={(v) => handleInputChange('income52Weeks', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="field-row-halves">
          <div className="form-group">
            <label>Entitlement date</label>
            <Calendar
              value={formData.entitlementDate}
              onChange={(date) => handleInputChange('entitlementDate', date)}
              placeholder="Select entitlement date"
            />
          </div>

          <div className="form-group">
            <label>Commencement date</label>
            <Calendar
              value={formData.commencementDate}
              onChange={(date) => handleInputChange('commencementDate', date)}
              placeholder="Select commencement date"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Stand down</label>
          <div className="radio-group">
            {STAND_DOWN_OPTIONS.map((option) => (
              <label key={option} className={`radio-btn ${formData.standDown === option ? 'selected' : ''}`}>
                {option}
                <input
                  type="checkbox"
                  checked={formData.standDown === option}
                  onChange={() => handleInputChange('standDown', formData.standDown === option ? '' : option)}
                  className="visually-hidden"
                />
              </label>
            ))}
          </div>
        </div>
      </ExpandableSection>

      {/* Section 3: Payment */}
      <ExpandableSection
        title="Payment"
        dataSection="payment"
        isVisible={visibleSections.has('payment')}
        defaultExpanded={true}
      >
        <div className="field-row-thirds">
          <div className="form-group">
            <label>Benefit rate</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.benefitRate}
                onValueChange={(v) => handleInputChange('benefitRate', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>AS rate</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.asRate}
                onValueChange={(v) => handleInputChange('asRate', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>TAS rate</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.tasRate}
                onValueChange={(v) => handleInputChange('tasRate', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>DA rate</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.daRate}
                onValueChange={(v) => handleInputChange('daRate', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>WEP rate</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.wepRate}
                onValueChange={(v) => handleInputChange('wepRate', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Bank account</label>
          <input
            type="text"
            className="form-control"
            value={formData.bankAccount}
            onChange={(e) => handleInputChange('bankAccount', e.target.value)}
            placeholder="Enter bank account number"
          />
        </div>

        <div className="field-row-thirds">
          <div className="form-group">
            <label>Accommodation cost</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.accommodationCost}
                onValueChange={(v) => handleInputChange('accommodationCost', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hire purchase costs</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.hirePurchaseCosts}
                onValueChange={(v) => handleInputChange('hirePurchaseCosts', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>DA costs</label>
            <div className="dollar-input">
              <CalculatedAmountInput
                value={formData.daCosts}
                onValueChange={(v) => handleInputChange('daCosts', v)}
                placeholder="Enter amount"
                min={0}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Section 4: Employment */}
      <ExpandableSection
        title="Employment"
        dataSection="employment"
        isVisible={visibleSections.has('employment')}
        defaultExpanded={true}
      >
        <div className="form-group">
          <label>JS Profile checked and updated</label>
          <YesNoGroup
            value={formData.jsProfileUpdated}
            onChange={(v) => handleInputChange('jsProfileUpdated', v)}
            namePrefix="jsProfileUpdated"
          />
        </div>

        <div className="form-group">
          <label>CV</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.cvStatus === 'provided' ? 'selected' : ''}`}>Provided
              <input
                type="checkbox"
                checked={formData.cvStatus === 'provided'}
                onChange={() => handleInputChange('cvStatus', formData.cvStatus === 'provided' ? '' : 'provided')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.cvStatus === 'not-provided' ? 'selected' : ''}`}>Not provided
              <input
                type="checkbox"
                checked={formData.cvStatus === 'not-provided'}
                onChange={() => handleInputChange('cvStatus', formData.cvStatus === 'not-provided' ? '' : 'not-provided')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Driver's License</label>
          <div className="radio-group">
            {DRIVERS_LICENSE_OPTIONS.map((option) => (
              <label key={option} className={`radio-btn ${formData.driversLicense === option ? 'selected' : ''}`}>
                {option}
                <input
                  type="checkbox"
                  checked={formData.driversLicense === option}
                  onChange={() => handleInputChange('driversLicense', formData.driversLicense === option ? '' : option)}
                  className="visually-hidden"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <FormattedTextarea
            label="Employment Discussion"
            value={formData.employmentDiscussion}
            onChange={(v) => handleInputChange('employmentDiscussion', v)}
            placeholder="Describe the employment discussion..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <FormattedTextarea
            label="Barriers to employment"
            value={formData.barriersToEmployment}
            onChange={(v) => handleInputChange('barriersToEmployment', v)}
            placeholder="Describe any barriers to employment..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>ROI completed</label>
          <YesNoGroup
            value={formData.roiCompleted}
            onChange={(v) => handleInputChange('roiCompleted', v)}
            namePrefix="roiCompleted"
          />
        </div>

        <div className="form-group">
          <label>Arrears</label>
          <div className="dollar-input">
            <CalculatedAmountInput
              value={formData.arrears}
              onValueChange={(v) => handleInputChange('arrears', v)}
              placeholder="Enter amount"
              min={0}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Arrears period</label>
          <div className="arrears-period-inputs">
            <Calendar
              value={formData.arrearsPeriodFrom}
              onChange={(date) => handleInputChange('arrearsPeriodFrom', date)}
              placeholder="From"
            />
            <Calendar
              value={formData.arrearsPeriodTo}
              onChange={(date) => handleInputChange('arrearsPeriodTo', date)}
              placeholder="To"
            />
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default BenefitGrantQuestions;
