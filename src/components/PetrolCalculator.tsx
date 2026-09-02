import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteOutput from './NoteOutput';
import { useSettings } from '../contexts/SettingsContext';
import carsCsv from '../data/cars.csv?raw';

interface CarData {
  Model: string;
  'L/100km': number;
}

interface PetrolCalculatorFormData {
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  vehicleMakeModel: string;
  vehicleMileage: string;
  petrolCost: string;
  calculatedCost: number;
}

const PetrolCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { customHeadingFormat } = useSettings();
  const [formData, setFormData] = useState<PetrolCalculatorFormData>({
    startLocation: '',
    destination: '',
    returnTrip: '',
    distance: 0,
    vehicleMakeModel: '',
    vehicleMileage: '',
    petrolCost: '',
    calculatedCost: 0,
  });

  const [carData, setCarData] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState('');
  const [carDropdownHeight, setCarDropdownHeight] = useState(0);

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
      const height = Math.min(filteredCars.length * 50, 200);
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

  useEffect(() => {
    if (formData.distance && formData.petrolCost && formData.vehicleMileage) {
      calculateCost();
    } else {
      setFormData(prev => ({ ...prev, calculatedCost: 0 }));
    }
  }, [formData.distance, formData.petrolCost, formData.vehicleMileage, formData.returnTrip]);

  const calculateCost = () => {
    const distance = formData.distance;
    const petrolCostValue = parseFloat(formData.petrolCost);
    const mileage = parseFloat(formData.vehicleMileage);

    if (distance && petrolCostValue && mileage) {
      let totalDistance = distance;
      if (formData.returnTrip === 'yes') {
        totalDistance = distance * 2;
      }

      const fuelUsed = (totalDistance / 100) * mileage;
      const cost = fuelUsed * petrolCostValue;
      setFormData(prev => ({ ...prev, calculatedCost: cost }));
    }
  };

  const handleInputChange = (field: keyof PetrolCalculatorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCarSelect = (car: CarData) => {
    setFormData(prev => ({
      ...prev,
      vehicleMakeModel: car.Model,
      vehicleMileage: car['L/100km'].toString()
    }));
    setCarSearchTerm(car.Model);
    setShowCarDropdown(false);
  };

  const resetForm = () => {
    setFormData({
      startLocation: '',
      destination: '',
      returnTrip: '',
      distance: 0,
      vehicleMakeModel: '',
      vehicleMileage: '',
      petrolCost: '',
      calculatedCost: 0,
    });
    setCarSearchTerm('');
  };

  const handleBack = () => {
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
            <h1 className="greeting">Petrol Cost Calculator</h1>
            <p className="date">{getCurrentDate()}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button className="copy-btn" onClick={handleBack}>
          ← Back to Services
        </button>
      </div>

      <div className="food-layout">
        <div className="form-sections-container">
          <div className="form-section-card section-visible">
            <div className="section-header">
              <h3>Travel Details</h3>
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
                value={formData.vehicleMileage}
                onChange={(e) => handleInputChange('vehicleMileage', e.target.value)}
                placeholder="Enter vehicle mileage"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Petrol cost per litre ($):</label>
              <input
                type="number"
                className="form-control"
                value={formData.petrolCost}
                onChange={(e) => handleInputChange('petrolCost', e.target.value)}
                placeholder="Enter petrol cost"
                step="0.01"
              />
            </div>

            {formData.calculatedCost > 0 && (
              <div className="form-group">
                <label>Calculated Cost of travel:</label>
                <div className="form-control-static travel-cost-total">
                  ${formData.calculatedCost.toFixed(2)}
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

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="note-section">
          <NoteOutput formData={formData} service="petrol-calculator" onReset={resetForm} customHeadingFormat={customHeadingFormat} />
        </div>
      </div>
    </div>
  );
};

export default PetrolCalculator;
