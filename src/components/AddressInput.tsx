import React from 'react';

interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter address',
  label,
  className = '',
}) => {
  return (
    <div className={`address-input-container ${className}`}>
      {label && <label>{label}</label>}
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="address-lookup-note">Address lookup will return soon.</p>
    </div>
  );
};

export default AddressInput;
