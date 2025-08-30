import React, { useState, useEffect, useRef } from 'react';

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
      };
    };
  }
}

interface Location {
  placeId: string;
  description: string;
}

interface AddressInputProps {
  value: string;
  onChange: (address: string, locationData?: Location) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter address",
  label,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsHeight, setSuggestionsHeight] = useState(0);
  
  // Google Places API configuration
  const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
  
  // Google Places service references
  const autocompleteService = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load Google Places API
  useEffect(() => {
    if (!GOOGLE_API_KEY) {
      console.error('Google Places API key not found. Please set VITE_GOOGLE_API_KEY in your .env file');
      return;
    }

    const loadGooglePlacesAPI = () => {
      if (window.google && window.google.maps) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
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
        }
      };
      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, [GOOGLE_API_KEY]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.address-input-container')) {
        setShowSuggestions(false);
        setSuggestions([]);
        setSuggestionsHeight(0);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  // Search places using Google Places API
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

  // Debounce function to reduce API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleAddressSearch = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsHeight(0);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    try {
      const response = await new Promise((resolve, reject) => {
        autocompleteService.current.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: 'nz' },
            types: ['address']
          },
          (predictions: any[], status: string) => {
            if (status === 'OK') {
              resolve(predictions);
            } else {
              reject(new Error(`Places API error: ${status}`));
            }
          }
        );
      });

      const addressSuggestions = (response as any[]).map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description
      }));

      setSuggestions(addressSuggestions);
      
      // Adjust layout height based on suggestions
      if (addressSuggestions.length > 0) {
        setSuggestionsHeight(Math.min(addressSuggestions.length * 50, 200)); // 50px per suggestion, max 200px
        // Scroll the input into view to show suggestions
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        setSuggestionsHeight(0);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
      setSuggestionsHeight(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced version of address search
  const debouncedAddressSearch = debounce(handleAddressSearch, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedAddressSearch(newValue);
  };

  const handleSuggestionSelect = (location: Location) => {
    onChange(location.description, location);
    setShowSuggestions(false);
    setSuggestions([]);
    setSuggestionsHeight(0);
  };

  return (
    <div className={`address-input-container ${className}`}>
      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />
      {showSuggestions && (
        <div className="address-suggestions" ref={suggestionsRef}>
          {isLoading ? (
            <div className="address-loading">Loading addresses...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((location, index) => (
              <div
                key={index}
                className="address-suggestion"
                onClick={() => handleSuggestionSelect(location)}
              >
                {location.description}
              </div>
            ))
          ) : (
            <div className="address-loading">No addresses found</div>
          )}
        </div>
      )}
      
      {/* Dynamic spacer to push content down when suggestions appear */}
      {suggestionsHeight > 0 && showSuggestions && (
        <div 
          className="suggestions-spacer" 
          style={{ height: `${suggestionsHeight}px` }}
        />
      )}
    </div>
  );
};

export default AddressInput;
