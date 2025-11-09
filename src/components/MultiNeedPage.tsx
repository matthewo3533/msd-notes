import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MultiNeedContainer from './multi-need/MultiNeedContainer';
import NeedsOverview from './multi-need/NeedsOverview';
import NoteOutput from './NoteOutput';
import type { MultiNeedFormData, HardshipNeedType } from '../types/multiNeed';
import { useSettings } from '../contexts/SettingsContext';
import { createDefaultIncomeLabels } from './IncomeSection';
import { getNeedTemplate, createBlankPayment, createBlankDecision, getNeedPaymentDefaults } from '../utils/needTemplates';

const MultiNeedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customHeadingFormat } = useSettings();

  const createDefaultFormData = (): MultiNeedFormData => {
    const defaultNeedType: HardshipNeedType = 'food';
    const paymentDefaults = getNeedPaymentDefaults(defaultNeedType);
    return {
      clientId: null,
      incomeLabels: createDefaultIncomeLabels(),
      income: {
        benefit: 0,
        employment: 0,
        familyTaxCredit: 0,
        childSupport: 0,
        childDisabilityAllowance: 0,
        otherIncome: 0,
      },
      costs: [],
      reasonableSteps: '',
      needs: [
        {
          id: `need-${Date.now()}`,
          type: defaultNeedType,
          data: getNeedTemplate(defaultNeedType),
          payment: {
            ...createBlankPayment(),
            ...paymentDefaults
          },
          decision: createBlankDecision()
        }
      ]
    };
  };

  const initialState = useMemo(() => {
    const state = location.state as { multiNeedData?: MultiNeedFormData; autoOpenSelector?: boolean } | null;
    return state?.multiNeedData ?? createDefaultFormData();
  }, [location.state]);

  const [formData, setFormData] = useState<MultiNeedFormData>(initialState);
  const [autoOpenSelector, setAutoOpenSelector] = useState<boolean>(() => {
    const state = location.state as { autoOpenSelector?: boolean } | null;
    return Boolean(state?.autoOpenSelector);
  });

  useEffect(() => {
    const state = location.state as { multiNeedData?: MultiNeedFormData; autoOpenSelector?: boolean } | null;
    if (state?.multiNeedData) {
      setFormData(state.multiNeedData);
      setAutoOpenSelector(Boolean(state.autoOpenSelector));
      navigate(location.pathname, { replace: true, state: undefined });
    }
  }, [location.state, location.pathname, navigate]);

  const handleFormDataChange = (updates: Partial<MultiNeedFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    const defaultNeedType: HardshipNeedType = 'food';
    const paymentDefaults = getNeedPaymentDefaults(defaultNeedType);
    setFormData({
      clientId: null,
      incomeLabels: createDefaultIncomeLabels(),
      income: {
        benefit: 0,
        employment: 0,
        familyTaxCredit: 0,
        childSupport: 0,
        childDisabilityAllowance: 0,
        otherIncome: 0,
      },
      costs: [],
      reasonableSteps: '',
      needs: [
        {
          id: `need-${Date.now()}`,
          type: defaultNeedType,
          data: getNeedTemplate(defaultNeedType),
          payment: {
            ...createBlankPayment(),
            ...paymentDefaults
          },
          decision: createBlankDecision()
        }
      ]
    });
    navigate('/multi-need');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="greeting-section">
            <h1 className="greeting">Multi-Need Application</h1>
            <p className="date">Create notes for applications with multiple needs</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>

      <div className="food-layout">
        <MultiNeedContainer
          formData={formData}
          onFormDataChange={handleFormDataChange}
          autoOpenSelector={autoOpenSelector}
          onSelectorOpened={() => setAutoOpenSelector(false)}
        />
        <div className="note-section">
          <NeedsOverview 
            needs={formData.needs}
            onRemoveNeed={(needId) => {
              const updatedNeeds = formData.needs.filter(n => n.id !== needId);
              if (updatedNeeds.length > 0) {
                handleFormDataChange({ needs: updatedNeeds });
              }
            }}
            onAddNeed={() => setAutoOpenSelector(true)}
          />
          <NoteOutput
            formData={formData}
            service="multi-need"
            onReset={resetForm}
            customHeadingFormat={customHeadingFormat}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiNeedPage;

