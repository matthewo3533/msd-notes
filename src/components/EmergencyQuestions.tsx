import React, { useEffect, useRef, useState } from 'react';
import IncomeSection, { IncomeLabels, createDefaultIncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';
import ExpandableSection from './ExpandableSection';
import { EmergencyFormData } from '../App';
import FormattedTextarea from './FormattedTextarea';

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => any;
          PlacesService: new (div: HTMLElement) => any;
          PlacesServiceStatus: {
            OK: string;
          };
        };
        Geocoder: new () => any;
        GeocoderStatus: {
          OK: string;
        };
        DistanceMatrixService: new () => any;
        DistanceMatrixStatus: {
          OK: string;
          NOT_FOUND: string;
          ZERO_RESULTS: string;
        };
        TravelMode: {
          DRIVING: string;
        };
        UnitSystem: {
          METRIC: string;
        };
      };
    };
  }
}

interface CarData {
  Model: string;
  'L/100km': number;
}

interface Location {
  placeId: string;
  description: string;
}

interface EmergencyQuestionsProps {
  formData: EmergencyFormData;
  onFormDataChange: (data: Partial<EmergencyFormData>) => void;
}

const EmergencyQuestions: React.FC<EmergencyQuestionsProps> = ({ formData, onFormDataChange }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['client']));
  const [incomeLabels, setIncomeLabels] = useState<IncomeLabels>(() => {
    if (formData.incomeLabels) {
      return { ...formData.incomeLabels };
    }
    return createDefaultIncomeLabels();
  });
  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [vehicleMileage, setVehicleMileage] = useState('');
  const [petrolCost, setPetrolCost] = useState('');
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [fromLocationSuggestions, setFromLocationSuggestions] = useState<Location[]>([]);
  const [toLocationSuggestions, setToLocationSuggestions] = useState<Location[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [distanceCalculationError, setDistanceCalculationError] = useState<string>('');
  const [showDistanceError, setShowDistanceError] = useState(false);
  const [fromPlaceId, setFromPlaceId] = useState<string>('');
  const [toPlaceId, setToPlaceId] = useState<string>('');
  const [fromSuggestionsHeight, setFromSuggestionsHeight] = useState(0);
  const [toSuggestionsHeight, setToSuggestionsHeight] = useState(0);
  const [carDropdownHeight, setCarDropdownHeight] = useState(0);
  const distanceCache = useRef<Map<string, number>>(new Map());
  const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
  const autocompleteService = useRef<any>(null);
  const distanceMatrixService = useRef<any>(null);

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

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        distanceMatrixService.current = new window.google.maps.DistanceMatrixService();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        distanceMatrixService.current = new window.google.maps.DistanceMatrixService();
      };
      document.head.appendChild(script);
    };

    if (GOOGLE_API_KEY) {
      loadGoogleMapsAPI();
    }
  }, [GOOGLE_API_KEY]);

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
        setCarData([{ Model: 'Toyota Corolla 1.8L', 'L/100km': 7.1 }]);
        setFilteredCars([{ Model: 'Toyota Corolla 1.8L', 'L/100km': 7.1 }]);
      }
    };

    loadCarData();
  }, []);

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

  useEffect(() => {
    if (showCarDropdown && filteredCars.length > 0) {
      setCarDropdownHeight(Math.min(filteredCars.length * 50, 200));
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
      if (!target.closest('.location-input-container')) {
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
        setFromLocationSuggestions([]);
        setToLocationSuggestions([]);
        setFromSuggestionsHeight(0);
        setToSuggestionsHeight(0);
      }
    };

    if (showCarDropdown || showFromSuggestions || showToSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCarDropdown, showFromSuggestions, showToSuggestions]);

  useEffect(() => {
    if (formData.distance && petrolCost && (vehicleMileage || selectedCar)) {
      calculateCost();
    } else {
      setCalculatedCost(null);
      onFormDataChange({ travelCost: 0 });
    }
  }, [formData.distance, petrolCost, vehicleMileage, selectedCar, formData.returnTrip]);

  const handleInputChange = (field: keyof EmergencyFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof EmergencyFormData['income'], value: number) => {
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

  const calculateCost = () => {
    const distance = parseFloat(formData.distance.toString());
    const petrolCostValue = parseFloat(petrolCost);
    let mileage = parseFloat(vehicleMileage);

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

  const handleCarSelect = (car: CarData) => {
    setSelectedCar(car.Model);
    setVehicleMileage(car['L/100km'].toString());
    setCarSearchTerm(car.Model);
    setShowCarDropdown(false);
  };

  const searchPlaces = async (query: string): Promise<Location[]> => {
    if (!query.trim() || query.length < 3) return [];
    if (!autocompleteService.current) return [];

    return new Promise((resolve) => {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'nz' }
        },
        (predictions: any[], status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(
              predictions.map((prediction) => ({
                placeId: prediction.place_id,
                description: prediction.description
              }))
            );
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  const calculateDistance = async (fromPid: string, toPid: string): Promise<number | null> => {
    const cacheKey = `${fromPid}-${toPid}`;
    if (distanceCache.current.has(cacheKey)) {
      return distanceCache.current.get(cacheKey)!;
    }

    if (!distanceMatrixService.current) return null;

    return new Promise((resolve) => {
      distanceMatrixService.current.getDistanceMatrix(
        {
          origins: [{ placeId: fromPid }],
          destinations: [{ placeId: toPid }],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        },
        (response: any, status: string) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const element = response.rows[0].elements[0];
            if (element.status === window.google.maps.DistanceMatrixStatus.OK) {
              const distKm = element.distance.value / 1000;
              distanceCache.current.set(cacheKey, distKm);
              resolve(distKm);
              return;
            }
          }
          resolve(null);
        }
      );
    });
  };

  const handleFromLocationSearch = async (query: string) => {
    const suggestions = await searchPlaces(query);
    setFromLocationSuggestions(suggestions);
    setShowFromSuggestions(suggestions.length > 0);
    setFromSuggestionsHeight(Math.min(suggestions.length * 50, 200));
  };

  const handleToLocationSearch = async (query: string) => {
    const suggestions = await searchPlaces(query);
    setToLocationSuggestions(suggestions);
    setShowToSuggestions(suggestions.length > 0);
    setToSuggestionsHeight(Math.min(suggestions.length * 50, 200));
  };

  const calculateDistanceBetweenLocations = async (fromPid: string, toPid: string) => {
    setDistanceCalculationError('');
    setShowDistanceError(false);
    try {
      const dist = await calculateDistance(fromPid, toPid);
      if (dist !== null) {
        onFormDataChange({ distance: dist });
      } else {
        setDistanceCalculationError('Unable to calculate distance. Please check the addresses.');
        setShowDistanceError(true);
      }
    } catch {
      setDistanceCalculationError('Error calculating distance. Please try again.');
      setShowDistanceError(true);
    }
  };

  const handleFromLocationSelect = async (location: Location) => {
    onFormDataChange({ startLocation: location.description });
    setFromPlaceId(location.placeId);
    setFromLocationSuggestions([]);
    setShowFromSuggestions(false);
    setFromSuggestionsHeight(0);
    if (toPlaceId) {
      await calculateDistanceBetweenLocations(location.placeId, toPlaceId);
    }
  };

  const handleToLocationSelect = async (location: Location) => {
    onFormDataChange({ destination: location.description });
    setToPlaceId(location.placeId);
    setToLocationSuggestions([]);
    setShowToSuggestions(false);
    setToSuggestionsHeight(0);
    if (fromPlaceId) {
      await calculateDistanceBetweenLocations(fromPlaceId, location.placeId);
    }
  };

  useEffect(() => {
    if (formData.petrolAssistance !== 'yes') {
      setFromPlaceId('');
      setToPlaceId('');
      setDistanceCalculationError('');
      setShowDistanceError(false);
      setCalculatedCost(null);
      onFormDataChange({ distance: 0, travelCost: 0 });
    }
  }, [formData.petrolAssistance]);

  useEffect(() => {
    if (!formData.startLocation) setFromPlaceId('');
    if (!formData.destination) setToPlaceId('');
    if (!formData.startLocation || !formData.destination) {
      onFormDataChange({ distance: 0 });
      setDistanceCalculationError('');
      setShowDistanceError(false);
    }
  }, [formData.startLocation, formData.destination]);

  return (
    <div className="form-sections-container">

      {/* General Questions */}
      <ExpandableSection
        title="General Questions"
        dataSection="client"
        isVisible={visibleSections.has('client')}
        defaultExpanded={true}
      >
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
          <FormattedTextarea
            label="1. Why is the client needing emergency payment assistance?"
            value={formData.whyNeedEmergencyPayment}
            onChange={(value) => handleInputChange('whyNeedEmergencyPayment', value)}
            placeholder="Please describe the client's emergency situation..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <FormattedTextarea
            label="2. What reasonable steps is the client taken to improve their situation?"
            value={formData.reasonableSteps}
            onChange={(value) => handleInputChange('reasonableSteps', value)}
            placeholder="Describe steps taken to address the emergency..."
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>3. Is client needing help with petrol?</label>
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
      </ExpandableSection>

      {formData.petrolAssistance === 'yes' && (
        <ExpandableSection
          title="Petrol Calculator"
          dataSection="petrol"
          isVisible={true}
          defaultExpanded={true}
        >
          <div className="form-group">
            <label>From:</label>
            <div className="location-input-container">
              <input
                type="text"
                className="form-control"
                value={formData.startLocation}
                onChange={(e) => {
                  handleInputChange('startLocation', e.target.value);
                  handleFromLocationSearch(e.target.value);
                }}
                onFocus={() => {
                  if (formData.startLocation) handleFromLocationSearch(formData.startLocation);
                }}
                placeholder="Enter starting location"
              />
              {showFromSuggestions && fromLocationSuggestions.length > 0 && (
                <div className="address-suggestions">
                  {fromLocationSuggestions.map((location, index) => (
                    <div key={index} className="address-suggestion" onClick={() => handleFromLocationSelect(location)}>
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="suggestions-spacer" style={{ height: `${fromSuggestionsHeight}px` }}></div>
          </div>

          <div className="form-group">
            <label>To:</label>
            <div className="location-input-container">
              <input
                type="text"
                className="form-control"
                value={formData.destination}
                onChange={(e) => {
                  handleInputChange('destination', e.target.value);
                  handleToLocationSearch(e.target.value);
                }}
                onFocus={() => {
                  if (formData.destination) handleToLocationSearch(formData.destination);
                }}
                placeholder="Enter destination"
              />
              {showToSuggestions && toLocationSuggestions.length > 0 && (
                <div className="address-suggestions">
                  {toLocationSuggestions.map((location, index) => (
                    <div key={index} className="address-suggestion" onClick={() => handleToLocationSelect(location)}>
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="suggestions-spacer" style={{ height: `${toSuggestionsHeight}px` }}></div>
          </div>

          <div className="form-group">
            <label>Return trip:</label>
            <div className="radio-group">
              <label className={`radio-btn ${formData.returnTrip === 'yes' ? 'selected' : ''}`}>Yes
                <input
                  type="checkbox"
                  checked={formData.returnTrip === 'yes'}
                  onChange={() => handleInputChange('returnTrip', formData.returnTrip === 'yes' ? '' : 'yes')}
                  className="visually-hidden"
                />
              </label>
              <label className={`radio-btn ${formData.returnTrip === 'no' ? 'selected' : ''}`}>No
                <input
                  type="checkbox"
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
                  const baseDistance = formData.returnTrip === 'yes' ? value / 2 : value;
                  handleInputChange('distance', baseDistance);
                }}
                placeholder="Enter distance manually or use address lookup above"
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
                    `Calculated distance: ${formData.distance.toFixed(1)} km`
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
                    <div key={index} className="car-option" onClick={() => handleCarSelect(car)}>
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

          {showDistanceError && (
            <div className="form-group">
              <div className="error-message">
                {distanceCalculationError}
                <br />
                <small>You can manually enter the distance above.</small>
              </div>
            </div>
          )}
        </ExpandableSection>
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

export default EmergencyQuestions;
