import { Input } from "@/components/ui/input";

interface VacationDaysBalanceInputProps {
  vacationDays: number;
  updateAmount: number;
  onChange: (field: "vacationDays" | "updateAmount", value: number) => void;
  className?: string;
}

export const VacationDaysBalanceInput = ({
  vacationDays,
  updateAmount,
  onChange,
  className,
}: VacationDaysBalanceInputProps) => {
  const handleInputChange = (
    field: "vacationDays" | "updateAmount",
    value: string
  ) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(field, numValue);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${className || ""}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Atostogų dienos
        </label>
        <Input
          type="number"
          name="vacationDays"
          value={vacationDays || ""} // Convert 0 to empty string
          onChange={(e) => handleInputChange("vacationDays", e.target.value)}
          min="0"
          max="365"
          className="w-full h-10 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dienos prieaugis
        </label>
        <Input
          type="number"
          name="updateAmount"
          value={updateAmount || ""} // Convert 0 to empty string
          onChange={(e) => handleInputChange("updateAmount", e.target.value)}
          step="0.00000001"
          min="0"
          className="w-full h-10 rounded-lg"
          placeholder="0.05479452"
        />
      </div>
    </div>
  );
};
