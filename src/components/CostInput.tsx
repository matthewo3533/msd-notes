import React, { useState, useRef, useEffect } from 'react';

interface CostInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const costSuggestions = [
  'Rent',
  'Food',
  'Petrol',
  'Power bill',
  'Hire Purchase',
  'Loans',
  'Phone bill',
  'Internet',
  'Insurance',
  'Medical',
  'Transport',
  'Childcare',
  'School fees',
  'Clothing',
  'Entertainment',
  'Other'
];

const CostInput: React.FC<CostInputProps> = ({ value, onChange, placeholder = "Type cost..." }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(costSuggestions);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (newValue.trim() === '') {
      setFilteredSuggestions(costSuggestions);
    } else {
      const filtered = costSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    setFilteredSuggestions(costSuggestions);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
      handleSuggestionClick(filteredSuggestions[0]);
    }
  };

  return (
    <div className="cost-input-container" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {showDropdown && filteredSuggestions.length > 0 && (
        <div className="cost-dropdown">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cost-suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CostInput; 