import React, { useEffect, useState } from 'react';
import IncomeSection, { IncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';
import Calendar from './Calendar';
import { TransitionToWorkFormData } from '../App';

interface TransitionToWorkQuestionsProps {
  formData: TransitionToWorkFormData;
  onFormDataChange: (data: Partial<TransitionToWorkFormData>) => void;
}

interface CarData {
  Model: string;
  'L/100km': number;
}

interface Location {
  placeId: string;
  description: string;
  coordinates?: { lat: number; lng: number };
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

const TransitionToWorkQuestions: React.FC<TransitionToWorkQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['client']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>({
    benefit: 'Benefit',
    employment: 'Employment',
    childSupport: 'Child Support',
    otherIncome: 'Other Income',
    familyTaxCredit: 'Family Tax Credit',
    childDisabilityAllowance: 'Child Disability Allowance'
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
  
  // Google Places API state
  const [fromLocationSuggestions, setFromLocationSuggestions] = useState<Location[]>([]);
  const [toLocationSuggestions, setToLocationSuggestions] = useState<Location[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
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

  // Calculate car dropdown height when filtered cars change
  useEffect(() => {
    if (showCarDropdown && filteredCars.length > 0) {
      const height = Math.min(filteredCars.length * 50, 200); // 50px per car option, max 200px
      setCarDropdownHeight(height);
    } else {
      setCarDropdownHeight(0);
    }
  }, [showCarDropdown, filteredCars]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.car-selector')) {
        setShowCarDropdown(false);
      }
      if (!target.closest('.location-input-container')) {
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
        setFromLocationSuggestions([]);
        setToLocationSuggestions([]);
      }
    };

    if (showCarDropdown || showFromSuggestions || showToSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCarDropdown, showFromSuggestions, showToSuggestions]);

  // Calculate cost when form data changes
  useEffect(() => {
    if (formData.distance && petrolCost && (vehicleMileage || selectedCar)) {
      calculateCost();
    } else {
      setCalculatedCost(null);
    }
  }, [formData.distance, petrolCost, vehicleMileage, selectedCar, formData.returnTrip]);

  const handleInputChange = (field: keyof TransitionToWorkFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof TransitionToWorkFormData['income'], value: number) => {
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
      
      const litersUsed = (totalDistance / 100) * mileage;
      const totalCost = litersUsed * petrolCostValue;
      
      setCalculatedCost(totalCost);
      onFormDataChange({ travelCost: totalCost });
    } else {
      setCalculatedCost(null);
      onFormDataChange({ travelCost: 0 });
    }
  };

  const searchPlaces = async (query: string, isFrom: boolean) => {
    if (!query.trim() || !window.google?.maps?.places?.AutocompleteService) {
      if (isFrom) {
        setFromLocationSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToLocationSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    try {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'nz' }
        },
        (predictions: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const locations: Location[] = predictions.map((prediction: any) => ({
              placeId: prediction.place_id,
              description: prediction.description
            }));

            if (isFrom) {
              setFromLocationSuggestions(locations);
              setShowFromSuggestions(true);
            } else {
              setToLocationSuggestions(locations);
              setShowToSuggestions(true);
            }
          } else {
            if (isFrom) {
              setFromLocationSuggestions([]);
              setShowFromSuggestions(false);
            } else {
              setToLocationSuggestions([]);
              setShowToSuggestions(false);
            }
          }
        }
      );
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const calculateDistance = async (fromLocation: string, toLocation: string) => {
    if (!fromLocation || !toLocation || !window.google?.maps?.DistanceMatrixService) {
      return;
    }

    try {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [fromLocation],
          destinations: [toLocation],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        },
        (response: any, status: any) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
            const element = response.rows[0].elements[0];
            if (element.status === window.google.maps.DistanceMatrixStatus.OK) {
              const distance = element.distance.value / 1000; // Convert to km
              onFormDataChange({ distance: distance });
            }
          }
        }
      );
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
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
          <label>1. What is client needing help with?</label>
          <div className="checkbox-group">
            <label className={`checkbox-btn ${formData.helpType.includes('Job search costs') ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={formData.helpType.includes('Job search costs')}
                onChange={(e) => {
                  const currentTypes = formData.helpType.split(',').filter(t => t.trim());
                  if (e.target.checked) {
                    currentTypes.push('Job search costs');
                  } else {
                    const index = currentTypes.indexOf('Job search costs');
                    if (index > -1) currentTypes.splice(index, 1);
                  }
                  handleInputChange('helpType', currentTypes.join(', '));
                }}
                className="visually-hidden"
              />
              Job search costs
            </label>
            <label className={`checkbox-btn ${formData.helpType.includes('Job placement costs') ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={formData.helpType.includes('Job placement costs')}
                onChange={(e) => {
                  const currentTypes = formData.helpType.split(',').filter(t => t.trim());
                  if (e.target.checked) {
                    currentTypes.push('Job placement costs');
                  } else {
                    const index = currentTypes.indexOf('Job placement costs');
                    if (index > -1) currentTypes.splice(index, 1);
                  }
                  handleInputChange('helpType', currentTypes.join(', '));
                }}
                className="visually-hidden"
              />
              Job placement costs
            </label>
            <label className={`checkbox-btn ${formData.helpType.includes('Bridging costs') ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={formData.helpType.includes('Bridging costs')}
                onChange={(e) => {
                  const currentTypes = formData.helpType.split(',').filter(t => t.trim());
                  if (e.target.checked) {
                    currentTypes.push('Bridging costs');
                  } else {
                    const index = currentTypes.indexOf('Bridging costs');
                    if (index > -1) currentTypes.splice(index, 1);
                  }
                  handleInputChange('helpType', currentTypes.join(', '));
                }}
                className="visually-hidden"
              />
              Bridging costs
            </label>
          </div>
        </div>

        {formData.helpType.includes('Bridging costs') && (
          <div className="form-group">
            <label>When is client's first payday?</label>
            <Calendar
              value={formData.firstPayday}
              onChange={(date: string) => handleInputChange('firstPayday', date)}
            />
          </div>
        )}

        <div className="form-group">
          <label>2. Why is the client needing Transition to Work assistance?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedTransitionToWork}
            onChange={e => handleInputChange('whyNeedTransitionToWork', e.target.value)}
            placeholder="Please describe the client's situation..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>

        <div className="form-group">
          <label>3. Contract uploaded:</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.contractUploaded === 'yes' ? 'selected' : ''}`}>Yes
              <input
                type="checkbox"
                name="contractUploadedYes"
                checked={formData.contractUploaded === 'yes'}
                onChange={() => handleInputChange('contractUploaded', formData.contractUploaded === 'yes' ? '' : 'yes')}
                className="visually-hidden"
              />
            </label>
            <label className={`radio-btn ${formData.contractUploaded === 'no' ? 'selected' : ''}`}>No
              <input
                type="checkbox"
                name="contractUploadedNo"
                checked={formData.contractUploaded === 'no'}
                onChange={() => handleInputChange('contractUploaded', formData.contractUploaded === 'no' ? '' : 'no')}
                className="visually-hidden"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>4. Is client needing help with petrol?</label>
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

      {/* Petrol Calculator */}
      {formData.petrolAssistance === 'yes' && (
        <div className="form-section-card section-visible" data-section="petrol">
          <div className="section-header">
            <h3>Petrol Calculator</h3>
          </div>
          
          <div className="form-group">
            <label>Vehicle Information</label>
            <div className="car-selector">
              <input
                type="text"
                className="form-control"
                placeholder="Search for your car model..."
                value={carSearchTerm}
                onChange={(e) => {
                  setCarSearchTerm(e.target.value);
                  setShowCarDropdown(true);
                }}
                onFocus={() => setShowCarDropdown(true)}
              />
              {showCarDropdown && filteredCars.length > 0 && (
                <div 
                  className="car-dropdown"
                  style={{ height: `${carDropdownHeight}px` }}
                >
                  {filteredCars.map((car, index) => (
                    <div
                      key={index}
                      className="car-option"
                      onClick={() => {
                        setSelectedCar(car.Model);
                        setCarSearchTerm(car.Model);
                        setShowCarDropdown(false);
                        setVehicleMileage('');
                      }}
                    >
                      <span className="car-model">{car.Model}</span>
                      <span className="car-mileage">{car['L/100km']} L/100km</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Or enter manual fuel consumption (L/100km)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 7.5"
              value={vehicleMileage}
              onChange={(e) => {
                setVehicleMileage(e.target.value);
                setSelectedCar('');
                setCarSearchTerm('');
              }}
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Petrol cost per liter ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 2.50"
              value={petrolCost}
              onChange={(e) => setPetrolCost(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>From Location</label>
            <div className="location-input-container">
              <input
                type="text"
                className="form-control"
                placeholder="Enter starting location..."
                value={formData.startLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('startLocation', value);
                  searchPlaces(value, true);
                }}
                onFocus={() => {
                  if (fromLocationSuggestions.length > 0) {
                    setShowFromSuggestions(true);
                  }
                }}
              />
              {showFromSuggestions && fromLocationSuggestions.length > 0 && (
                <div className="location-suggestions">
                  {fromLocationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="location-suggestion"
                      onClick={() => {
                        handleInputChange('startLocation', location.description);
                        setFromLocationSuggestions([]);
                        setShowFromSuggestions(false);
                        if (formData.destination) {
                          calculateDistance(location.description, formData.destination);
                        }
                      }}
                    >
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>To Location</label>
            <div className="location-input-container">
              <input
                type="text"
                className="form-control"
                placeholder="Enter destination..."
                value={formData.destination}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('destination', value);
                  searchPlaces(value, false);
                }}
                onFocus={() => {
                  if (toLocationSuggestions.length > 0) {
                    setShowToSuggestions(true);
                  }
                }}
              />
              {showToSuggestions && toLocationSuggestions.length > 0 && (
                <div className="location-suggestions">
                  {toLocationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="location-suggestion"
                      onClick={() => {
                        handleInputChange('destination', location.description);
                        setToLocationSuggestions([]);
                        setShowToSuggestions(false);
                        if (formData.startLocation) {
                          calculateDistance(formData.startLocation, location.description);
                        }
                      }}
                    >
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Return trip?</label>
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

          {formData.distance > 0 && (
            <div className="form-group">
              <label>Distance</label>
              <input
                type="text"
                className="form-control"
                value={`${formData.distance.toFixed(1)} km`}
                readOnly
              />
            </div>
          )}

          {calculatedCost !== null && (
            <div className="form-group">
              <label>Calculated Travel Cost</label>
              <input
                type="text"
                className="form-control"
                value={`$${calculatedCost.toFixed(2)}`}
                readOnly
              />
            </div>
          )}
        </div>
      )}

      {/* Employer Details */}
      <div className="form-section-card section-visible" data-section="employer">
        <div className="section-header">
          <h3>Employer Details</h3>
        </div>
        <div className="form-group">
          <label>Employer Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.employerName}
            onChange={e => handleInputChange('employerName', e.target.value)}
            placeholder="Enter employer name..."
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <Calendar
            value={formData.startDate}
            onChange={(date: string) => handleInputChange('startDate', date)}
          />
        </div>
        <div className="form-group">
          <label>Hours per week</label>
          <input
            type="number"
            className="form-control"
            value={formData.hoursPerWeek}
            onChange={e => handleInputChange('hoursPerWeek', parseFloat(e.target.value) || 0)}
            placeholder="Enter hours per week..."
            min="0"
            step="0.5"
          />
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
        sectionNumber={formData.petrolAssistance === 'yes' ? 4 : 3}
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
        sectionNumber={formData.petrolAssistance === 'yes' ? 5 : 4}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={formData.petrolAssistance === 'yes' ? 6 : 5}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default TransitionToWorkQuestions;
