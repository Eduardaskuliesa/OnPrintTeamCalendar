"use client";
import { Input } from "@/components/ui/input";

interface NameSurnameInputProps {
  name: string;
  surname: string;
  onChange: (field: "name" | "surname", value: string) => void;
  className?: string;
}

export const NameSurnameInput = ({
  name,
  surname,
  onChange,
  className,
}: NameSurnameInputProps) => {
  return (
    <div className={`grid grid-cols-1 xsm:grid-cols-2 gap-4 ${className || ""}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vardas
        </label>
        <Input
          type="text"
          name="name"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          className="w-full h-10 rounded-lg"
          placeholder="Jonas"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pavardė
        </label>
        <Input
          type="text"
          name="surname"
          value={surname}
          onChange={(e) => onChange("surname", e.target.value)}
          required
          className="w-full h-10 rounded-lg"
          placeholder="Jonaitis"
        />
      </div>
    </div>
  );
};
