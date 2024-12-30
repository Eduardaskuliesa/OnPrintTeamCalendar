// components/shared/selectors/GapSelection.tsx
"use client";

interface GapSelectionProps {
  createGap: boolean;
  onCreateGapChange: (value: boolean) => void;
  gapEndDate: string;
  onGapEndDateChange: (date: string) => void;
  baseEndDate: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  checkboxLabel?: string;
  startLabel?: string;
  endLabel?: string;
}

const GapSelection = ({
  createGap,
  onCreateGapChange,
  gapEndDate,
  onGapEndDateChange,
  baseEndDate,
  disabled = false,
  required = true,
  className = "",
  checkboxLabel = "Add gap days after vacation?",
  startLabel = "Gap Start Date",
  endLabel = "Gap End Date",
}: GapSelectionProps) => {
  const gapStartDate = baseEndDate
    ? new Date(
        new Date(baseEndDate).setDate(new Date(baseEndDate).getDate() + 1)
      )
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="createGap"
          checked={createGap}
          onChange={(e) => onCreateGapChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label
          htmlFor="createGap"
          className="text-sm font-medium text-gray-700"
        >
          {checkboxLabel}
        </label>
      </div>

      {createGap && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {startLabel}
            </label>
            <input
              type="date"
              disabled
              value={gapStartDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {endLabel}
            </label>
            <input
              type="date"
              required={required && createGap}
              disabled={disabled}
              min={gapStartDate}
              value={gapEndDate}
              onChange={(e) => onGapEndDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GapSelection;
