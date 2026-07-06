import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BenefitGrantQuestions from './BenefitGrantQuestions';
import NoteOutput from './NoteOutput';
import { BenefitGrantFormData, createBenefitGrantDocuments } from '../App';
import { useSettings } from '../contexts/SettingsContext';

const createInitialFormData = (): BenefitGrantFormData => ({
  benefitType: '',
  onlineIdentityCheck: '',
  documentsSighted: '',
  documents: createBenefitGrantDocuments(),
  irdValidated: '',
  irdRequired: '',
  irdRequiredDetail: '',
  irdEvidenceRequired: '',
  irdEvidenceRequiredDetail: '',
  irdEvidenceLetterSent: '',
  evidenceReceived: '',
  dateOfReps: '',
  dateOfEvent: '',
  reasonForEvent: '',
  holidayPay: '',
  income4Weeks: 0,
  income26Weeks: 0,
  income52Weeks: 0,
  entitlementDate: '',
  standDown: '',
  commencementDate: '',
  benefitRate: 0,
  asRate: 0,
  tasRate: 0,
  daRate: 0,
  wepRate: 0,
  bankAccount: '',
  accommodationCost: 0,
  hirePurchaseCosts: 0,
  daCosts: 0,
  jsProfileUpdated: '',
  cvStatus: '',
  driversLicense: '',
  employmentDiscussion: '',
  barriersToEmployment: '',
  roiCompleted: '',
  arrears: 0,
  arrearsPeriodFrom: '',
  arrearsPeriodTo: '',
  applicationNotes: '',
});

const BenefitGrantPage: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
  const [formData, setFormData] = useState<BenefitGrantFormData>(createInitialFormData);

  const handleFormDataChange = (data: Partial<BenefitGrantFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    navigate('/');
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${dayName} ${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">Benefit Grant</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={() => navigate('/')}>
          ← Back to Services
        </button>
      </div>
      <div className="food-layout">
        <BenefitGrantQuestions
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
        <div className="note-section">
          <NoteOutput
            formData={formData}
            service="benefit-grant"
            onReset={resetForm}
            customHeadingFormat={customHeadingFormat}
          />
        </div>
      </div>
    </div>
  );
};

export default BenefitGrantPage;
