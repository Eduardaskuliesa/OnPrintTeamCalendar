"use client";

interface DateSelectionProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  disabled?: boolean;
  required?: boolean;
  startLabel?: string;
  endLabel?: string;
  className?: string;
  minStartDate?: string;
  maxStartDate?: string;
  minEndDate?: string;
  maxEndDate?: string;
}

const DateSelection = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
  required = true,
  startLabel = "Pradžios data",
  endLabel = "Pabaigos data",
  className = "",
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
}: DateSelectionProps) => (
  <div className={`grid grid-cols-2 gap-4 ${className}`}>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {startLabel}
      </label>
      <input
        type="date"
        required={required}
        disabled={disabled}
        value={startDate}
        min={minStartDate}
        max={maxStartDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {endLabel}
      </label>
      <input
        type="date"
        required={required}
        disabled={disabled}
        min={minEndDate || startDate}
        max={maxEndDate}
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
      />
    </div>
  </div>
);

export default DateSelection;
