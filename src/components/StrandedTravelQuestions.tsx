import React, { useEffect, useState, useRef } from 'react';
import IncomeSection, { IncomeLabels } from './IncomeSection';
import PaymentSection from './PaymentSection';
import DecisionSection from './DecisionSection';

// Google Maps API TypeScript declarations
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
  coordinates?: { lat: number; lng: number };
}

interface StrandedTravelFormData {
  clientId: boolean | null;
  whyNeedStrandedTravelAssistance: string;
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

interface StrandedTravelQuestionsProps {
  formData: StrandedTravelFormData;
  onFormDataChange: (data: Partial<StrandedTravelFormData>) => void;
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

const StrandedTravelQuestions: React.FC<StrandedTravelQuestionsProps> = ({ formData, onFormDataChange }) => {
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
  const [distanceCalculationError, setDistanceCalculationError] = useState<string>('');
  const [showDistanceError, setShowDistanceError] = useState(false);
  
  // Store place IDs for distance calculation
  const [fromPlaceId, setFromPlaceId] = useState<string>('');
  const [toPlaceId, setToPlaceId] = useState<string>('');
  
  // Layout management for suggestions
  const [suggestionsHeight, setSuggestionsHeight] = useState(0);
  const [carDropdownHeight, setCarDropdownHeight] = useState(0);
  
  // Cache for distance calculations to minimize API calls
  const distanceCache = useRef<Map<string, number>>(new Map());
  
  // Google Places API configuration
  const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
  
  // Google Places service references
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

  // Load Google Maps API
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
        if (!showFromSuggestions && !showToSuggestions) {
          setSuggestionsHeight(0);
        }
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

  const handleInputChange = (field: keyof StrandedTravelFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  const handleIncomeChange = (field: keyof StrandedTravelFormData['income'], value: number) => {
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
    setSelectedCar(car.Model);
    setVehicleMileage(car['L/100km'].toString());
    setCarSearchTerm(car.Model);
    setShowCarDropdown(false);
  };

  // Google Places API functions
  const searchPlaces = async (query: string): Promise<Location[]> => {
    if (!query.trim() || query.length < 3) return [];
    
    if (!autocompleteService.current) {
      console.error('Google Places API not loaded yet');
      return [];
    }
    
    return new Promise((resolve) => {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'nz' }
        },
        (predictions: any[], status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const locations = predictions.map((prediction) => ({
              placeId: prediction.place_id,
              description: prediction.description
            }));
            resolve(locations);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  const calculateDistance = async (fromPlaceId: string, toPlaceId: string): Promise<number | null> => {
    // Check cache first
    const cacheKey = `${fromPlaceId}-${toPlaceId}`;
    if (distanceCache.current.has(cacheKey)) {
      return distanceCache.current.get(cacheKey)!;
    }

    if (!distanceMatrixService.current) {
      console.error('Google Distance Matrix API not loaded yet');
      return null;
    }

    return new Promise((resolve) => {
      distanceMatrixService.current.getDistanceMatrix(
        {
          origins: [{ placeId: fromPlaceId }],
          destinations: [{ placeId: toPlaceId }],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        },
        (response: any, status: string) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const element = response.rows[0].elements[0];
            if (element.status === window.google.maps.DistanceMatrixStatus.OK) {
              const distance = element.distance.value / 1000; // Convert to km
              distanceCache.current.set(cacheKey, distance);
              resolve(distance);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  const handleFromLocationSearch = async (query: string) => {
    const suggestions = await searchPlaces(query);
    setFromLocationSuggestions(suggestions);
    setShowFromSuggestions(suggestions.length > 0);
    setSuggestionsHeight(Math.min(suggestions.length * 50, 200));
  };

  const handleToLocationSearch = async (query: string) => {
    const suggestions = await searchPlaces(query);
    setToLocationSuggestions(suggestions);
    setShowToSuggestions(suggestions.length > 0);
    setSuggestionsHeight(Math.min(suggestions.length * 50, 200));
  };

  const handleFromLocationSelect = async (location: Location) => {
    onFormDataChange({ startLocation: location.description });
    setFromPlaceId(location.placeId);
    setFromLocationSuggestions([]);
    setShowFromSuggestions(false);
    setSuggestionsHeight(0);
    
    // Calculate distance if both locations are set
    if (toPlaceId) {
      await calculateDistanceBetweenLocations(location.placeId, toPlaceId);
    }
  };

  const handleToLocationSelect = async (location: Location) => {
    onFormDataChange({ destination: location.description });
    setToPlaceId(location.placeId);
    setToLocationSuggestions([]);
    setShowToSuggestions(false);
    setSuggestionsHeight(0);
    
    // Calculate distance if both locations are set
    if (fromPlaceId) {
      await calculateDistanceBetweenLocations(fromPlaceId, location.placeId);
    }
  };

  const calculateDistanceBetweenLocations = async (fromPlaceId: string, toPlaceId: string) => {
    setDistanceCalculationError('');
    setShowDistanceError(false);
    
    try {
      const distance = await calculateDistance(fromPlaceId, toPlaceId);
      if (distance !== null) {
        onFormDataChange({ distance: distance });
      } else {
        setDistanceCalculationError('Unable to calculate distance. Please check the addresses.');
        setShowDistanceError(true);
      }
    } catch (error) {
      setDistanceCalculationError('Error calculating distance. Please try again.');
      setShowDistanceError(true);
    }
  };

  // Reset place IDs when petrol assistance is changed to 'no'
  useEffect(() => {
    if (formData.petrolAssistance !== 'yes') {
      setFromPlaceId('');
      setToPlaceId('');
      setDistanceCalculationError('');
      setShowDistanceError(false);
    }
  }, [formData.petrolAssistance]);

  // Clear distance when locations are manually cleared
  useEffect(() => {
    if (!formData.startLocation) {
      setFromPlaceId('');
    }
    if (!formData.destination) {
      setToPlaceId('');
    }
    if (!formData.startLocation || !formData.destination) {
      onFormDataChange({ distance: 0 });
      setDistanceCalculationError('');
      setShowDistanceError(false);
    }
  }, [formData.startLocation, formData.destination]);

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
          <label>1. Why is the client needing stranded travel assistance?</label>
          <textarea
            className="form-control"
            value={formData.whyNeedStrandedTravelAssistance}
            onChange={e => handleInputChange('whyNeedStrandedTravelAssistance', e.target.value)}
            placeholder="Please describe the client's situation and why they are stranded..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
          />
        </div>

        <div className="form-group">
          <label>2. What reasonable steps has the client taken to improve their situation?</label>
          <textarea
            className="form-control"
            value={formData.reasonableSteps}
            onChange={e => handleInputChange('reasonableSteps', e.target.value)}
            placeholder="Describe steps taken to resolve the stranded situation..."
            ref={el => autoResizeTextarea(el)}
            onInput={e => autoResizeTextarea(e.currentTarget)}
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
                  if (formData.startLocation) {
                    handleFromLocationSearch(formData.startLocation);
                  }
                }}
                placeholder="Enter starting location"
              />
              {showFromSuggestions && fromLocationSuggestions.length > 0 && (
                <div className="address-suggestions">
                  {fromLocationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="address-suggestion"
                      onClick={() => handleFromLocationSelect(location)}
                    >
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="suggestions-spacer" style={{ height: `${suggestionsHeight}px` }}></div>
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
                  if (formData.destination) {
                    handleToLocationSearch(formData.destination);
                  }
                }}
                placeholder="Enter destination"
              />
              {showToSuggestions && toLocationSuggestions.length > 0 && (
                <div className="address-suggestions">
                  {toLocationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="address-suggestion"
                      onClick={() => handleToLocationSelect(location)}
                    >
                      {location.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="suggestions-spacer" style={{ height: `${suggestionsHeight}px` }}></div>
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
              <div className="form-control-static">
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

          {showDistanceError && (
            <div className="form-group">
              <div className="error-message">
                {distanceCalculationError}
                <br />
                <small>You can manually enter the distance above.</small>
              </div>
            </div>
          )}
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
        sectionNumber={formData.petrolAssistance === 'yes' ? 3 : 2}
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
        sectionNumber={formData.petrolAssistance === 'yes' ? 4 : 3}
        isVisible={visibleSections.has('payment')}
      />

      {/* Decision Section */}
      <DecisionSection
        decision={formData.decision}
        decisionReason={formData.decisionReason}
        onDecisionChange={(decision) => handleInputChange('decision', decision)}
        onDecisionReasonChange={(reason) => handleInputChange('decisionReason', reason)}
        sectionNumber={formData.petrolAssistance === 'yes' ? 5 : 4}
        isVisible={visibleSections.has('decision')}
      />
    </div>
  );
};

export default StrandedTravelQuestions;
