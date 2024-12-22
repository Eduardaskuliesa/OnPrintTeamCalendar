/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { updateUser } from "../lib/actions/users/updateUser";
import { toast } from "react-toastify";
import { User } from "../types/api";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { useNumericInput } from "../hooks/useNumericInput";
import SettingsToggle from "./SettingsToggleUpdateForm";

const COLORS = [
  "#7986cb", // Blue
  "#33b679", // Green
  "#8e24aa", // Purple
  "#e67c73", // Red
  "#f6c026", // Yellow
  "#f5511d", // Orange
  "#795548", // Light Brown
  "#e91e63", // Pink
  "#3f51b5", // Indigo
  "#0b8043", // Dark Green
];

interface UpdateUserFormProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onCancel: () => void;
}

export default function UpdateUserForm({
  user,
  onUserUpdated,
  onCancel,
}: UpdateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.color);
  const [useGlobal, setUseGlobal] = useState(user.useGlobal);

  const vacationDays = useNumericInput(user.vacationDays);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleColorSelect = (newColor: string) => {
    setColor(newColor);
    setShowColorPicker(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const hasChanges =
      name !== user.name ||
      color !== user.color ||
      vacationDays.parseValue() !== user.vacationDays ||
      useGlobal !== user.useGlobal;

    if (!hasChanges) {
      onCancel();
      toast.info("Nepadarete jokių pakeitimų");
      return;
    }

    try {
      setLoading(true);
      const result = await updateUser(user.email, {
        name,
        color,
        vacationDays: vacationDays.parseValue(),
        useGlobal,
      });

      if (result.success) {
        toast.success("Vartotojas sėkmingai atnaujintas");
        const updatedUser = {
          ...user,
          name,
          color,
          vacationDays: vacationDays.parseValue(),
          useGlobal,
          updatedAt: new Date().toISOString(),
        };
        onUserUpdated(updatedUser);
        await update({ force: true });
      } else {
        toast.error(result.error || "Nepavyko atnaujinti vartotojo");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  console.log(useGlobal);
  return (
    <div className="fixed inset-0 mt-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={formRef}
        className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Atnaujinti Vartotoją
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">
                Vardas
              </Label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
                placeholder="Jonas Jonaitis"
              />
            </div>
            <div className="w-32">
              <Label className="text-sm font-medium text-gray-700">
                Atostogų Dienos
              </Label>
              <input
                type="text"
                value={vacationDays.value}
                onChange={(e) => vacationDays.setValue(e.target.value)}
                min="0"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <Label
              htmlFor="useGlobal"
              className="text-md font-medium leading-none"
            >
              Nauduoti -
            </Label>
            <SettingsToggle enabled={useGlobal} onToggle={setUseGlobal} />
          </div>

          <div className="relative">
            <Label className="text-sm font-medium text-gray-700">Spalva</Label>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center justify-between px-4 py-2 mt-1 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-700">Pasirinkti spalvą</span>
              </div>
              <X
                size={18}
                className={`transform transition-transform ${
                  showColorPicker ? "rotate-0" : "rotate-45"
                }`}
              />
            </button>

            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 w-64 right-0">
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border-2  transition-all ${
                        color === color
                          ? "border-dcoffe scale-110"
                          : "border-gray-200 hover:border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-lcoffe text-db rounded-md hover:bg-dcoffe transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Atnaujinama..." : "Atnaujinti"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
