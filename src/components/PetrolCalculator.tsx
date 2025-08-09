import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';

interface CarData {
  Model: string;
  'L/100km': number;
}

interface PetrolCalculatorProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  isStandalone?: boolean;
}

const PetrolCalculator: React.FC<PetrolCalculatorProps> = ({ 
  currentTheme = 'dark-blue', 
  onThemeChange = () => {}, 
  isStandalone = true 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    distance: '',
    returnTrip: false,
    petrolCost: '',
    vehicleMileage: '',
    selectedCar: '',
    carSearchTerm: ''
  });
  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
      carSearchTerm: ''
    });
    setCalculatedCost(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount);
  };

  return (
    <div className="container">
      {isStandalone && (
        <div className="header">
          <div className="header-top">
            <div className="greeting-section">
              <h1 className="greeting">Petrol Cost Calculator</h1>
            </div>
            <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>
        </div>
      )}
      
      <div className="form-sections-container">
        <div 
          ref={(el) => { sectionRefs.current['calculator'] = el; }}
          data-section="calculator"
          className={`form-section-card ${visibleSections.has('calculator') ? 'section-visible' : ''}`}
        >
          <div className="section-header">
            <h3>Petrol Cost Calculator</h3>
            <div className="section-number">1</div>
          </div>
          
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
