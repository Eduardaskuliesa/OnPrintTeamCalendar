"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown } from "lucide-react";

interface RoleJobTitleInputProps {
  role: string;
  jobTitle: string;
  onChange: (field: "role" | "jobTitle", value: string) => void;
  className?: string;
}

export const RoleJobTitleInput = ({
  role,
  jobTitle,
  onChange,
  className,
}: RoleJobTitleInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (value: string) => {
    onChange("role", value);
    setIsOpen(false);
  };

  return (
    <div
      className={`grid grid-cols-1 xsm:grid-cols-2 gap-4 ${className || ""}`}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Svetainės Rolė
        </label>
        <div className="relative" ref={selectRef}>
          <div
            className="w-full h-10 rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{role === "ADMIN" ? "Administratorius" : "Darbuotojas"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
          {isOpen && (
            <div className="absolute w-full rounded-md border bg-popover text-popover-foreground shadow-md z-10">
              <div className="p-1">
                <div
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelectChange("USER")}
                >
                  Darbuotojas
                  {role === "USER" && (
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check></Check>
                    </span>
                  )}
                </div>
                <div
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelectChange("ADMIN")}
                >
                  Administratorius
                  {role === "ADMIN" && (
                    <span className="absolute  right-2  flex h-3.5 w-3.5 items-center justify-center">
                      <Check></Check>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pareigos
        </label>
        <Input
          type="text"
          name="jobTitle"
          value={jobTitle}
          onChange={(e) => onChange("jobTitle", e.target.value)}
          required
          className="w-full h-10 rounded-lg"
          placeholder="Buhalteris"
        />
      </div>
    </div>
  );
};
