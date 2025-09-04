import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface PetrolCalculatorProps {
  isStandalone?: boolean;
}

const PetrolCalculator: React.FC<PetrolCalculatorProps> = ({ 
  isStandalone = true 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    distance: '',
    returnTrip: false,
    petrolCost: '',
    vehicleMileage: '',
    selectedCar: '',
    carSearchTerm: '',
    fromLocation: '',
    toLocation: '',
    fromLocationData: null as Location | null,
    toLocationData: null as Location | null,
    useLocationCalculation: false
  });
  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Google Places API state
  const [fromLocationSuggestions, setFromLocationSuggestions] = useState<Location[]>([]);
  const [toLocationSuggestions, setToLocationSuggestions] = useState<Location[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceCalculationError, setDistanceCalculationError] = useState<string>('');
  const [showDistanceError, setShowDistanceError] = useState(false);
  
  // Layout management for suggestions
  const [suggestionsHeight, setSuggestionsHeight] = useState(0);
  const [carDropdownHeight, setCarDropdownHeight] = useState(0);
  
  // Cache for distance calculations to minimize API calls
  const distanceCache = useRef<Map<string, number>>(new Map());
  
  // Google Places API configuration
  const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
  
  // Google Places service references
  const placesService = useRef<any>(null);
  const autocompleteService = useRef<any>(null);
  const geocoder = useRef<any>(null);
  const distanceMatrixService = useRef<any>(null);

  // Load Google Places API
  useEffect(() => {
    if (!GOOGLE_API_KEY) {
      console.error('Google Places API key not found. Please set VITE_GOOGLE_API_KEY in your .env file');
      return;
    }

    const loadGooglePlacesAPI = () => {
      if (window.google && window.google.maps) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
        geocoder.current = new window.google.maps.Geocoder();
        distanceMatrixService.current = new window.google.maps.DistanceMatrixService();
        return;
      }
      
      // If Google Maps API is not loaded, load it
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
          geocoder.current = new window.google.maps.Geocoder();
          distanceMatrixService.current = new window.google.maps.DistanceMatrixService();
        }
      };
      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, [GOOGLE_API_KEY]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Make the first section visible immediately
    setVisibleSections(new Set(['calculator']));
    
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

  // Load car data from CSV
  useEffect(() => {
    const loadCarData = async () => {
      try {
        const response = await fetch('/data/cars.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        const cars: CarData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 2) {
            cars.push({
              Model: values[0].trim(),
              'L/100km': parseFloat(values[1].trim())
            });
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
    if (formData.carSearchTerm) {
      const filtered = carData.filter(car => 
        car.Model.toLowerCase().includes(formData.carSearchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(carData);
    }
  }, [formData.carSearchTerm, carData]);

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
    };

    if (showCarDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCarDropdown]);

  // Close location suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-input-container')) {
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
        setFromLocationSuggestions([]);
        setToLocationSuggestions([]);
        // Only reset height if no suggestions are visible
        if (!showFromSuggestions && !showToSuggestions) {
          setSuggestionsHeight(0);
        }
      }
    };

    if (showFromSuggestions || showToSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFromSuggestions, showToSuggestions]);

  // Calculate cost when form data changes
  useEffect(() => {
    if (formData.distance && formData.petrolCost && (formData.vehicleMileage || formData.selectedCar)) {
      calculateCost();
    } else {
      setCalculatedCost(null);
    }
  }, [formData]);

  const calculateCost = () => {
    const distance = parseFloat(formData.distance);
    const petrolCost = parseFloat(formData.petrolCost);
    let mileage = parseFloat(formData.vehicleMileage);
    
    // If no manual mileage, use selected car's mileage
    if (!mileage && formData.selectedCar) {
      const selectedCar = carData.find(car => car.Model === formData.selectedCar);
      if (selectedCar) {
        mileage = selectedCar['L/100km'];
      }
    }
    
    if (distance && petrolCost && mileage) {
      let totalDistance = distance;
      if (formData.returnTrip) {
        totalDistance = distance * 2;
      }
      
      const fuelUsed = (totalDistance / 100) * mileage;
      const cost = fuelUsed * petrolCost;
      setCalculatedCost(cost);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCarSelect = (car: CarData) => {
    setFormData(prev => ({
      ...prev,
      selectedCar: car.Model,
      vehicleMileage: car['L/100km'].toString(),
      carSearchTerm: car.Model,
      showCarDropdown: false
    }));
    setShowCarDropdown(false);
  };

  const resetForm = () => {
    setFormData({
      distance: '',
      returnTrip: false,
      petrolCost: '',
      vehicleMileage: '',
      selectedCar: '',
      carSearchTerm: '',
      fromLocation: '',
      toLocation: '',
      fromLocationData: null,
      toLocationData: null,
      useLocationCalculation: false
    });
    setCalculatedCost(null);
    setDistanceCalculationError('');
    setShowDistanceError(false);
    setFromLocationSuggestions([]);
    setToLocationSuggestions([]);
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
          // Don't restrict types - this allows searching for addresses, businesses, and POIs
          componentRestrictions: { country: 'nz' } // Restrict to New Zealand only
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
          if (status === window.google.maps.DistanceMatrixStatus.OK && 
              response && 
              response.rows && 
              response.rows[0] && 
              response.rows[0].elements && 
              response.rows[0].elements[0]) {
            
            const element = response.rows[0].elements[0];
            if (element.status === window.google.maps.DistanceMatrixStatus.OK) {
              // Distance is returned in meters, convert to kilometers
              const distanceInKm = element.distance.value / 1000;
              
              // Cache the result
              distanceCache.current.set(cacheKey, distanceInKm);
              resolve(distanceInKm);
            } else {
              console.error('Distance Matrix element status:', element.status);
              resolve(null);
            }
          } else {
            console.error('Distance Matrix API error:', status);
            resolve(null);
          }
        }
      );
    });
  };

  // Debounce function to reduce API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleLocationSearch = async (query: string, type: 'from' | 'to') => {
    if (query.length < 3) {
      if (type === 'from') {
        setFromLocationSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToLocationSuggestions([]);
        setShowToSuggestions(false);
      }
      // Only reset suggestions height if no suggestions are visible from either field
      if (!showFromSuggestions && !showToSuggestions) {
        setSuggestionsHeight(0);
      }
      return;
    }

    const suggestions = await searchPlaces(query);
    
    if (type === 'from') {
      setFromLocationSuggestions(suggestions);
      setShowFromSuggestions(suggestions.length > 0);
      // Adjust layout height based on suggestions
      if (suggestions.length > 0) {
        setSuggestionsHeight(Math.min(suggestions.length * 50, 200)); // 50px per suggestion, max 200px
        // Scroll the input into view to show suggestions
        setTimeout(() => {
          const fromInput = document.querySelector('.location-input-container input[placeholder="Enter starting location"]');
          if (fromInput) {
            fromInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    } else {
      setToLocationSuggestions(suggestions);
      setShowToSuggestions(suggestions.length > 0);
      // Adjust layout height based on suggestions
      if (suggestions.length > 0) {
        setSuggestionsHeight(Math.min(suggestions.length * 50, 200)); // 50px per suggestion, max 200px
        // Scroll the input into view to show suggestions
        setTimeout(() => {
          const toInput = document.querySelector('.location-input-container input[placeholder="Enter destination location"]');
          if (toInput) {
            toInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    }
  };

  // Debounced version of location search
  const debouncedLocationSearch = debounce(handleLocationSearch, 300);

  const handleLocationSelect = async (location: Location, type: 'from' | 'to') => {
    const locationField = type === 'from' ? 'fromLocation' : 'toLocation';
    const locationDataField = type === 'from' ? 'fromLocationData' : 'toLocationData';
    
    setFormData(prev => ({
      ...prev,
      [locationField]: location.description,
      [locationDataField]: location
    }));

    if (type === 'from') {
      setShowFromSuggestions(false);
      setFromLocationSuggestions([]);
    } else {
      setShowToSuggestions(false);
      setToLocationSuggestions([]);
    }

    // Reset suggestions height when hiding suggestions
    if (!showFromSuggestions && !showToSuggestions) {
      setSuggestionsHeight(0);
    }

    // Auto-calculate distance if both locations are set
    if (formData.fromLocation && (type === 'to' ? location.description : formData.toLocation)) {
      await calculateDistanceFromLocations();
    }
  };

  const calculateDistanceFromLocations = async () => {
    if (!formData.fromLocation || !formData.toLocation) return;
    
    setIsCalculatingDistance(true);
    setDistanceCalculationError('');
    setShowDistanceError(false); // Reset error display
    
    try {
      // Use the stored location data instead of searching through suggestions
      const fromLocation = formData.fromLocationData;
      const toLocation = formData.toLocationData;
      
      if (!fromLocation || !toLocation) {
        throw new Error('Please select locations from the suggestions');
      }

      const distance = await calculateDistance(fromLocation.placeId, toLocation.placeId);
      
      if (distance !== null) {
        setFormData(prev => ({
          ...prev,
          distance: distance.toFixed(1),
          useLocationCalculation: true
        }));
      } else {
        throw new Error('Could not calculate distance');
      }
    } catch (error) {
      setDistanceCalculationError(error instanceof Error ? error.message : 'Error calculating distance');
      setShowDistanceError(true); // Show error when calculation fails
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount);
  };

  return (
    <div className="container petrol-calculator">
      {isStandalone && (
        <div className="header">
          <div className="header-top">
            <div className="greeting-section">
              <h1 className="greeting">Petrol Cost Calculator</h1>
            </div>
          </div>
        </div>
      )}
      
      <div className="form-sections-container">
        <div 
          ref={(el) => { sectionRefs.current['calculator'] = el; }}
          data-section="calculator"
          className={`form-section-card ${visibleSections.has('calculator') ? 'section-visible' : ''}`}
        >
          {/* Distance Section */}
          <div className="section-header">
            <h3>Distance</h3>
          </div>
          
          {/* Location-based Distance Calculation */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.useLocationCalculation}
                onChange={(e) => handleInputChange('useLocationCalculation', e.target.checked)}
              />
              <span>Calculate distance from locations</span>
            </label>
          </div>

          {formData.useLocationCalculation && (
            <>
              <div className="form-group">
                <label>From Location</label>
                <div className="location-input-container">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.fromLocation}
                    onChange={(e) => {
                      handleInputChange('fromLocation', e.target.value);
                      debouncedLocationSearch(e.target.value, 'from');
                    }}
                    placeholder="Enter starting location"
                  />
                  {showFromSuggestions && fromLocationSuggestions.length > 0 && (
                    <div className="location-suggestions">
                      {fromLocationSuggestions.map((location, index) => (
                        <div
                          key={index}
                          className="location-suggestion"
                          onClick={() => handleLocationSelect(location, 'from')}
                        >
                          {location.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dynamic spacer to push content down when suggestions appear */}
              {suggestionsHeight > 0 && showFromSuggestions && (
                <div 
                  className="suggestions-spacer" 
                  style={{ height: `${suggestionsHeight}px` }}
                />
              )}

              <div className="form-group">
                <label>To Location</label>
                <div className="location-input-container">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.toLocation}
                    onChange={(e) => {
                      handleInputChange('toLocation', e.target.value);
                      debouncedLocationSearch(e.target.value, 'to');
                    }}
                    placeholder="Enter destination location"
                  />
                  {showToSuggestions && toLocationSuggestions.length > 0 && (
                    <div className="location-suggestions">
                      {toLocationSuggestions.map((location, index) => (
                        <div
                          key={index}
                          className="location-suggestion"
                          onClick={() => handleLocationSelect(location, 'to')}
                        >
                          {location.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic spacer for To Location suggestions */}
              {suggestionsHeight > 0 && showToSuggestions && (
                <div 
                  className="suggestions-spacer" 
                  style={{ height: `${suggestionsHeight}px` }}
                />
              )}

              {isCalculatingDistance && (
                <div className="loading-message">
                  Calculating distance...
                </div>
              )}

               {showDistanceError && distanceCalculationError && (
                 <div className="error-message">
                   {distanceCalculationError}
                 </div>
               )}

              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={calculateDistanceFromLocations}
                  disabled={!formData.fromLocation || !formData.toLocation || isCalculatingDistance}
                >
                  Calculate Distance
                </button>
                
              </div>
            </>
          )}

          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              className="form-control"
              value={formData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              placeholder="Enter distance in kilometers"
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.returnTrip}
                onChange={(e) => handleInputChange('returnTrip', e.target.checked)}
              />
              <span>Return trip</span>
            </label>
          </div>

          {/* Petrol Section */}
          <div className="section-header">
            <h3>Petrol</h3>
          </div>

          <div className="form-group">
            <label>Petrol cost per litre ($)</label>
            <input
              type="number"
              className="form-control"
              value={formData.petrolCost}
              onChange={(e) => handleInputChange('petrolCost', e.target.value)}
              placeholder="Enter petrol cost per litre"
              min="0"
              step="0.01"
            />
            <a 
              href="https://www.gaspy.nz/stats.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-under-input"
            >
              Check current fuel costs
            </a>
          </div>

          {/* Fuel Economy Section */}
          <div className="section-header">
            <h3>Fuel Economy</h3>
          </div>

          <div className="form-group">
            <label>Vehicle mileage (L/100km)</label>
            <div className="mileage-input-container">
              <input
                type="number"
                className="form-control"
                value={formData.vehicleMileage}
                onChange={(e) => handleInputChange('vehicleMileage', e.target.value)}
                placeholder="Enter vehicle mileage"
                min="0"
                step="0.1"
              />
              <div className="or-divider">or</div>
              <div className="car-selector">
                <input
                  type="text"
                  className="form-control"
                  value={formData.carSearchTerm}
                  onChange={(e) => handleInputChange('carSearchTerm', e.target.value)}
                  onFocus={() => setShowCarDropdown(true)}
                  placeholder="Search for a car model"
                />
                {showCarDropdown && filteredCars.length > 0 && (
                  <div className="car-dropdown">
                    {filteredCars.map((car, index) => (
                      <div
                        key={index}
                        className="car-option"
                        onClick={() => handleCarSelect(car)}
                      >
                        {car.Model} ({car['L/100km']} L/100km)
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Dynamic spacer for car dropdown */}
              <div 
                className="suggestions-spacer" 
                style={{ height: `${carDropdownHeight}px` }}
              />
            </div>
          </div>

          {calculatedCost !== null && (
            <div className="calculation-result">
              <h3>Calculation Result</h3>
              <div className="result-details">
                {(() => {
                  const distance = parseFloat(formData.distance || '0');
                  const totalDistance = formData.returnTrip ? distance * 2 : distance;
                  const mileage = parseFloat(formData.vehicleMileage || '0');
                  const fuelUsed = (totalDistance / 100) * mileage;
                  
                  return (
                    <>
                      <p><strong>Total distance:</strong> {totalDistance} km</p>
                      <p><strong>Fuel used:</strong> {fuelUsed.toFixed(2)} L</p>
                      <p><strong>Total cost:</strong> <span className="cost-highlight">{formatCurrency(calculatedCost)}</span></p>
                    </>
                  );
                })()}
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

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={resetForm}
            >
              Reset
            </button>
            {isStandalone && (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetrolCalculator;
