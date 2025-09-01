import React, { useState } from 'react';
import SelectFilter from '../select-filter/SelectFilter';
import type { FilterValues } from './FilterValues';
import './FilterBar.css';

// these values are hardcoded for simplicity
const customers = ['customer1', 'customer2', 'customer3'];
const users = ['user1', 'user2', 'user3', 'user4'];
const vendors = ['OpenAI', 'Anthropic', 'Gemini'];
const apiTypes = ['chat', 'completion', 'generation'];

interface FilterBarProps {
  onFilterChange: (filters: {
    customerId?: string;
    userId?: string;
    vendorName?: string;
    apiType?: string;
    fromDate?: string;
    toDate?: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    customer: '',
    user: '',
    vendor: '',
    apiType: '',
    fromDate: '',
    toDate: '',
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    const apiFilters = {
      customerId: updatedFilters.customer || undefined,
      userId: updatedFilters.user || undefined,
      vendorName: updatedFilters.vendor || undefined,
      apiType: updatedFilters.apiType || undefined,
      fromDate: updatedFilters.fromDate || undefined,
      toDate: updatedFilters.toDate || undefined,
    };

    onFilterChange(apiFilters);
  };

  return (
    <div className="filter-bar">
      <SelectFilter
        label="Customer"
        options={customers}
        value={filters.customer}
        onChange={(v) => handleChange('customer', v)}
      />
      <SelectFilter
        label="User"
        options={users}
        value={filters.user}
        onChange={(v) => handleChange('user', v)}
      />
      <SelectFilter
        label="Vendor"
        options={vendors}
        value={filters.vendor}
        onChange={(v) => handleChange('vendor', v)}
      />
      <SelectFilter
        label="API Type"
        options={apiTypes}
        value={filters.apiType}
        onChange={(v) => handleChange('apiType', v)}
      />
      <div className="date-filter">
        <label>From Date</label>
        <input
          id="fromDate" name="fromDate"
          type="date"
          value={filters.fromDate}
          onChange={(e) => handleChange('fromDate', e.target.value)}
        />
      </div>
      <div className="date-filter">
        <label>To Date</label>
        <input
          id="toDate" name="toDate"
          type="date"
          value={filters.toDate}
          onChange={(e) => handleChange('toDate', e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
