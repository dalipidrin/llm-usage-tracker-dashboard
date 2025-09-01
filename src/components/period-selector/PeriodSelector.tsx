import React from 'react';

interface PeriodSelectorProps {
  period: 'day' | 'week' | 'month';
  onChange: (newPeriod: 'day' | 'week' | 'month') => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ period, onChange }) => {
  const periods: { label: string; value: 'day' | 'week' | 'month' }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {periods.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: period === p.value ? '#3b82f6' : '#fff',
            color: period === p.value ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: period === p.value ? 'bold' : 'normal',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
