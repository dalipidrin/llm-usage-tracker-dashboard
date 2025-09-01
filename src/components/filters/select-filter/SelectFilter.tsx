import React from 'react';
import './SelectFilter.css';

interface SelectFilterProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="select-filter">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilter;
