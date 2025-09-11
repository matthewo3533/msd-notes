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
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    // Only reset selection if we're filtering (typing), not if dropdown was already open
    if (selectedIndex >= 0) {
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (!showDropdown) {
      setShowDropdown(true);
      setFilteredSuggestions(costSuggestions);
      setSelectedIndex(-1); // Reset selection when focusing for the first time
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Tab') {
        // Tab pressed when dropdown is closed - allow normal tab behavior
        return;
      }
      // Allow arrow keys to open dropdown when it's closed
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setShowDropdown(true);
        setFilteredSuggestions(costSuggestions);
        setSelectedIndex(e.key === 'ArrowDown' ? 0 : filteredSuggestions.length - 1);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = selectedIndex < filteredSuggestions.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
        scrollToSelectedOption(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredSuggestions.length - 1;
        setSelectedIndex(prevIndex);
        scrollToSelectedOption(prevIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else if (filteredSuggestions.length > 0) {
          handleSuggestionClick(filteredSuggestions[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
        break;
      case 'Tab':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        // Move to next focusable element
        const focusableElements = document.querySelectorAll(
          'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const currentIndex = Array.from(focusableElements).indexOf(inputRef.current!);
        const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
        if (nextElement) {
          nextElement.focus();
        }
        break;
    }
  };

  const scrollToSelectedOption = (index: number) => {
    if (dropdownRef.current) {
      const suggestions = dropdownRef.current.querySelectorAll('.cost-suggestion');
      const selectedElement = suggestions[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
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
        <div className="cost-dropdown" tabIndex={-1}>
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`cost-suggestion ${index === selectedIndex ? 'selected' : ''}`}
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