import React, { useEffect, useState } from 'react';
import IncomeSection, { IncomeLabels, createDefaultIncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';
import FormattedTextarea from './FormattedTextarea';
import carsCsv from '../data/cars.csv?raw';
import type { AdditionalPayment } from '../types/additionalPayment';

interface CarData {
  Model: string;
  'L/100km': number;
}

interface FuneralAssistanceFormData {
  clientId: boolean | null;
  whyNeedFuneralAssistance: string;
  canMeetNeedOtherWay: string;
  reasonableSteps: string;
  petrolAssistance: string;
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  additionalPayments?: AdditionalPayment[];
  incomeLabels?: IncomeLabels;
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

interface FuneralAssistanceQuestionsProps {
  formData: FuneralAssistanceFormData;
  onFormDataChange: (data: Partial<FuneralAssistanceFormData>) => void;
}

const FuneralAssistanceQuestions: React.FC<FuneralAssistanceQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['client']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>(() => {
    if (formData.incomeLabels) {
      return { ...formData.incomeLabels };
    }
    return createDefaultIncomeLabels();
  });

  // Petrol calculator state
  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [vehicleMileage, setVehicleMileage] = useState('');
  const [petrolCost, setPetrolCost] = useState('');
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [carDropdownHeight, setCarDropdownHeight] = useState(0);

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
        const csvText = carsCsv;
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

  // Calculate car dropdown height when filtered cars change
  useEffect(() => {
    if (showCarDropdown && filteredCars.length > 0) {
      const height = Math.min(filteredCars.length * 50, 200); // 50px per car option, max 200px
      setCarDropdownHeight(height);
    } else {
      setCarDropdownHeight(0);
    }
  }, [showCarDropdown, filteredCars]);

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

  // Calculate cost when form data changes
  useEffect(() => {
    if (formData.distance && petrolCost && (vehicleMileage || selectedCar)) {
      calculateCost();
    } else {
      setCalculatedCost(null);
    }
  }, [formData.distance, petrolCost, vehicleMileage, selectedCar, formData.returnTrip]);

  const calculateCost = () => {
    const distance = parseFloat(formData.distance.toString());
    const petrolCostValue = parseFloat(petrolCost);
    let mileage = parseFloat(vehicleMileage);
    
    // If no manual mileage, use selected car's mileage
    if (!mileage && selectedCar) {
      const selectedCarData = carData.find(car => car.Model === selectedCar);
      if (selectedCarData) {
        mileage = selectedCarData['L/100km'];
      }
    }
    
    if (distance && petrolCostValue && mileage) {
      let totalDistance = distance;
      if (formData.returnTrip === 'yes') {
        totalDistance = distance * 2;
      }
      
      const fuelUsed = (totalDistance / 100) * mileage;
      const cost = fuelUsed * petrolCostValue;
      setCalculatedCost(cost);
      onFormDataChange({ travelCost: cost });
    }
  };

  const handleInputChange = (field: keyof FuneralAssistanceFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof FuneralAssistanceFormData['income'], value: number) => {
    onFormDataChange({
      income: {
        ...formData.income,
        [field]: value,
      },
    });
  };

  useEffect(() => {
    if (formData.incomeLabels) {
      setIncomeLabels({ ...formData.incomeLabels });
    } else {
      setIncomeLabels(createDefaultIncomeLabels());
    }
  }, [formData.incomeLabels]);

  const handleIncomeLabelsChange = (labels: IncomeLabels) => {
    const updatedLabels = { ...labels };
    setIncomeLabels(updatedLabels);
    onFormDataChange({ incomeLabels: updatedLabels });
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
    setSelectedCar(car.Model);
    setVehicleMileage(car['L/100km'].toString());
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
          <label>Client ID</label>
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
          <FormattedTextarea
            label="1. Why is the client needing funeral assistance?"
            value={formData.whyNeedFuneralAssistance}
            onChange={(value) => handleInputChange('whyNeedFuneralAssistance', value)}
            placeholder="Please describe the client's situation..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <FormattedTextarea
            label="2. What reasonable steps is the client taken to improve their situation?"
            value={formData.reasonableSteps}
            onChange={(value) => handleInputChange('reasonableSteps', value)}
            placeholder="Describe steps taken..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>3. Is client requesting assistance with petrol?</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.petrolAssistance === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="petrolAssistanceYes"
                checked={formData.petrolAssistance === 'yes'}
                onChange={() => handleInputChange('petrolAssistance', formData.petrolAssistance === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.petrolAssistance === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="petrolAssistanceNo"
                checked={formData.petrolAssistance === 'no'}
                onChange={() => handleInputChange('petrolAssistance', formData.petrolAssistance === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Travel Details Section - Only show if petrol assistance is Yes */}
      {formData.petrolAssistance === 'yes' && (
        <div 
          data-section="travel-details"
          className="form-section-card section-visible"
        >
          <div className="section-header">
            <h3>Travel Details</h3>
            <div className="section-number">2</div>
          </div>
          
          <div className="form-group">
            <label>From:</label>
            <input
              type="text"
              className="form-control"
              value={formData.startLocation}
              onChange={(e) => handleInputChange('startLocation', e.target.value)}
              placeholder="Enter starting location"
            />
          </div>

          <div className="form-group">
            <label>To:</label>
            <input
              type="text"
              className="form-control"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Enter destination"
            />
          </div>

          <div className="form-group">
            <label>Return trip:</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.returnTrip === 'yes' ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  name="returnTripYes"
                  checked={formData.returnTrip === 'yes'}
                  onChange={() => handleInputChange('returnTrip', formData.returnTrip === 'yes' ? '' : 'yes')}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.returnTrip === 'no' ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
                  name="returnTripNo"
                  checked={formData.returnTrip === 'no'}
                  onChange={() => handleInputChange('returnTrip', formData.returnTrip === 'no' ? '' : 'no')}
                  className="visually-hidden"
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Distance (km):</label>
            <div className="distance-input-container">
              <input
                type="number"
                className="form-control"
                value={formData.distance > 0 ? (formData.returnTrip === 'yes' ? formData.distance * 2 : formData.distance) : ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  // If return trip is checked, divide by 2 to store the base distance
                  const baseDistance = formData.returnTrip === 'yes' ? value / 2 : value;
                  handleInputChange('distance', baseDistance);
                }}
                placeholder="Enter distance in kilometres"
                step="0.1"
              />
              {formData.distance > 0 && (
                <div className="distance-display">
                  {formData.returnTrip === 'yes' ? (
                    <>
                      Base distance: {formData.distance.toFixed(1)} km<br />
                      Total distance (return trip): {(formData.distance * 2).toFixed(1)} km
                    </>
                  ) : (
                    `Distance: ${formData.distance.toFixed(1)} km`
                  )}
                </div>
              )}
            </div>
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
            <div className="suggestions-spacer" style={{ height: `${carDropdownHeight}px` }}></div>
          </div>

          <div className="form-group">
            <label>Vehicle mileage (L/100km):</label>
            <input
              type="number"
              className="form-control"
              value={vehicleMileage}
              onChange={(e) => setVehicleMileage(e.target.value)}
              placeholder="Enter vehicle mileage"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Petrol cost per litre ($):</label>
            <input
              type="number"
              className="form-control"
              value={petrolCost}
              onChange={(e) => setPetrolCost(e.target.value)}
              placeholder="Enter petrol cost"
              step="0.01"
            />
          </div>

          {calculatedCost !== null && (
            <div className="form-group">
              <label>Calculated Cost of travel:</label>
              <div className="form-control-static travel-cost-total">
                ${calculatedCost.toFixed(2)}
              </div>
            </div>
          )}

          {/* Tip Box */}
          <div className="tip-box">
            <strong>Please note:</strong> These values are based on distance travelled and fuel economy. They don't account for the fact that:
            <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
              <li>Our clients may be stopping/starting. They are not travelling in a straight line</li>
              <li>Unexpected events happen. The client may encounter detours or road closures</li>
              <li>Fuel economy is based around a perfectly functioning vehicle. Wear and tear can reduce fuel economy over time.</li>
            </ul>
            <br />
            With this in mind, use these numbers only as a guideline. Have a conversation with the client to determine what is realistic based on their situation and vehicle condition.
          </div>
        </div>
      )}

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
        paymentCardNumber={formData.paymentCardNumber}
        onSupplierNameChange={(name) => handleInputChange('supplierName', name)}
        onSupplierIdChange={(id) => handleInputChange('supplierId', id)}
        onAmountChange={(amount) => handleInputChange('amount', amount)}
        onRecoveryRateChange={(rate) => handleInputChange('recoveryRate', rate)}
        onDirectCreditChange={(credit) => handleInputChange('directCredit', credit)}
        onPaymentReferenceChange={(reference) => handleInputChange('paymentReference', reference)}
        onPaymentCardNumberChange={(cardNumber) => handleInputChange('paymentCardNumber', cardNumber)}
        additionalPayments={formData.additionalPayments}
        onAdditionalPaymentsChange={(payments) => handleInputChange('additionalPayments', payments)}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default FuneralAssistanceQuestions;


