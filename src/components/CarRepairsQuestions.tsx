import React, { useEffect, useState } from 'react';
import IncomeSection, { IncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';

interface CarData {
  Model: string;
  'L/100km': number;
}

interface CarRepairsFormData {
  clientId: boolean | null;
  whyNeedCarRepairs: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  vehicleMakeModel: string;
  licensePlate: string;
  odometer: string;
  vehicleOwner: string;
  nztaVerification: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string; // 'yes' | 'no' | ''
  paymentReference: string;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

interface CarRepairsQuestionsProps {
  formData: CarRepairsFormData;
  onFormDataChange: (data: Partial<CarRepairsFormData>) => void;
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

const CarRepairsQuestions: React.FC<CarRepairsQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['client']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>({
    benefit: 'Benefit',
    employment: 'Employment',
    childSupport: 'Child Support',
    otherIncome: 'Other Income',
    familyTaxCredit: 'Family Tax Credit',
    childDisabilityAllowance: 'Child Disability Allowance'
  });

  // Car dropdown state
  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState('');

  useEffect(() => {
    const observer = new window.IntersectionObserver(
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
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
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

  // Load car data from CSV
  useEffect(() => {
    const loadCarData = async () => {
      try {
        const response = await fetch('/data/cars.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const cars: CarData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [model, l100km] = line.split(',');
            if (model && l100km) {
              cars.push({
                Model: model.trim(),
                'L/100km': parseFloat(l100km.trim())
              });
            }
          }
        }
        setCarData(cars);
        setFilteredCars(cars);
      } catch (error) {
        console.error('Error loading car data:', error);
        // Fallback data if CSV can't be loaded
        setCarData([{ Model: 'Toyota Corolla 1.8L', 'L/100km': 7.1 }]);
        setFilteredCars([{ Model: 'Toyota Corolla 1.8L', 'L/100km': 7.1 }]);
      }
    };
    
    loadCarData();
  }, []);

  // Filter cars based on search term
  useEffect(() => {
    if (carSearchTerm) {
      const filtered = carData.filter(car => 
        car.Model.toLowerCase().includes(carSearchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(carData);
    }
  }, [carSearchTerm, carData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.car-selector')) {
        setShowCarDropdown(false);
      }
    };

    if (showCarDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCarDropdown]);

  const handleInputChange = (field: keyof CarRepairsFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof CarRepairsFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value,
      },
    });
  };

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    setIncomeLabels(labels);
  };

  const handleCostChange = (index: number, field: 'amount' | 'cost', value: any) => {
    const newCosts = [...formData.costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onFormDataChange({ costs: newCosts });
  };

  const addCost = () => {
    onFormDataChange({ costs: [...formData.costs, { amount: 0, cost: '' }] });
  };

  const removeCost = (index: number) => {
    const newCosts = formData.costs.filter((_, i) => i !== index);
    onFormDataChange({ costs: newCosts });
  };

  const handleCarSelect = (car: CarData) => {
    onFormDataChange({ vehicleMakeModel: car.Model });
    setCarSearchTerm(car.Model);
    setShowCarDropdown(false);
  };

  return (
    <div className="form-sections-container">

      {/* General Questions */}
      <div className="form-section-card section-visible">
        <div className="section-header">
          <h3>General Questions</h3>
        </div>
        <div className="form-group">
          <label>Has the client been ID'd?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.clientId === true ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="clientIdYes"
                checked={formData.clientId === true}
                onChange={() => handleInputChange('clientId', formData.clientId === true ? null : true)}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.clientId === false ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="clientIdNo"
                checked={formData.clientId === false}
                onChange={() => handleInputChange('clientId', formData.clientId === false ? null : false)}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>1. Why is the client needing car repairs?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedCarRepairs}
            onChange={e => handleInputChange('whyNeedCarRepairs', e.target.value)}
            placeholder="Please describe the client's situation..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>

        <div className="form-group">
          <label>2. What reasonable steps is the client taken to improve their situation?</label>
          <textarea
            className="form-control"
            value={formData.reasonableSteps}
            onChange={e => handleInputChange('reasonableSteps', e.target.value)}
            placeholder="Describe steps taken..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>
      </div>

      {/* Car Details Section */}
      <div 
        data-section="car-details"
        className={`form-section-card ${visibleSections.has('car-details') ? 'section-visible' : ''}`}
      >
        <div className="section-header">
          <h3>Car Details</h3>
          <div className="section-number">2</div>
        </div>
        
        <div className="form-group">
          <label>Vehicle make/model:</label>
          <div className="car-selector">
            <input
              type="text"
              className="form-control"
              value={carSearchTerm}
              onChange={(e) => setCarSearchTerm(e.target.value)}
              onFocus={() => setShowCarDropdown(true)}
              placeholder="Search for a car model or enter manually"
            />
            {showCarDropdown && filteredCars.length > 0 && (
              <div className="car-dropdown">
                {filteredCars.map((car, index) => (
                  <div
                    key={index}
                    className="car-option"
                    onClick={() => handleCarSelect(car)}
                  >
                    {car.Model}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>License plate:</label>
          <input
            type="text"
            className="form-control"
            value={formData.licensePlate}
            onChange={e => handleInputChange('licensePlate', e.target.value)}
            placeholder="Enter license plate"
          />
        </div>

        <div className="form-group">
          <label>Odometer:</label>
          <input
            type="text"
            className="form-control"
            value={formData.odometer}
            onChange={e => handleInputChange('odometer', e.target.value)}
            placeholder="Enter odometer reading"
          />
        </div>

        <div className="form-group">
          <label>Who is the vehicle's owner?</label>
          <select
            className="form-control"
            value={formData.vehicleOwner}
            onChange={e => handleInputChange('vehicleOwner', e.target.value)}
          >
            <option value="">Select owner</option>
            <option value="Client">Client</option>
            <option value="Partner">Partner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>NZTA verification:</label>
          <textarea
            className="form-control"
            value={formData.nztaVerification}
            onChange={e => handleInputChange('nztaVerification', e.target.value)}
            placeholder="Enter NZTA verification details..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <a 
              href="https://transact.nzta.govt.nz/transactions/ConfirmRegisteredPerson/entry" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'underline' }}
            >
              Check Ownership
            </a>
          </div>
        </div>
      </div>

      {/* Income Section */}
      <IncomeSection
        income={formData.income}
        incomeLabels={incomeLabels}
        costs={formData.costs}
        onIncomeChange={handleIncomeChange}
        onIncomeLabelsChange={handleIncomeLabelsChange}
        onCostChange={handleCostChange}
        onAddCost={addCost}
        onRemoveCost={removeCost}
        sectionNumber={3}
        isVisible={visibleSections.has('income')}
      />

      {/* Payment Section */}
      <PaymentSection
        supplierName={formData.supplierName}
        supplierId={formData.supplierId}
        amount={formData.amount}
        recoveryRate={formData.recoveryRate}
        directCredit={formData.directCredit}
        paymentReference={formData.paymentReference}
        onSupplierNameChange={(name) => handleInputChange('supplierName', name)}
        onSupplierIdChange={(id) => handleInputChange('supplierId', id)}
        onAmountChange={(amount) => handleInputChange('amount', amount)}
        onRecoveryRateChange={(rate) => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
        sectionNumber={4}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={5}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default CarRepairsQuestions;
