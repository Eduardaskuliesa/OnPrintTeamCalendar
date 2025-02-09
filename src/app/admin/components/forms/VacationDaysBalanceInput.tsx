import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';

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
  const [localVacationDays, setLocalVacationDays] = useState(vacationDays === 0 ? '' : vacationDays.toString());
  const [localUpdateAmount, setLocalUpdateAmount] = useState(updateAmount === 0 ? '' : updateAmount.toString());

  useEffect(() => {
    setLocalVacationDays(vacationDays === 0 ? '' : vacationDays.toString());
  }, [vacationDays]);

  useEffect(() => {
    setLocalUpdateAmount(updateAmount === 0 ? '' : updateAmount.toString());
  }, [updateAmount]);

  return (
    <div className={`grid grid-cols-2 gap-4 ${className || ""}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Atostogų dienos
        </label>
        <Input
          type="number"
          name="vacationDays"
          value={localVacationDays}
          onChange={(e) => {
            const val = e.target.value;
            setLocalVacationDays(val);
            onChange("vacationDays", val === '' ? 0 : Number(val));
          }}
          step="0.00000001"
          max="1000"
          min="0"
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
          value={localUpdateAmount}
          onChange={(e) => {
            const val = e.target.value;
            setLocalUpdateAmount(val);
            onChange("updateAmount", val === '' ? 0 : Number(val));
          }}
          step="0.00000001"
          min="0"
          className="w-full h-10 rounded-lg"
          placeholder="0.05479452"
        />
      </div>
    </div>
  );
};

export default VacationDaysBalanceInput;