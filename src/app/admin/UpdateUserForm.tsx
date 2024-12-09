/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect, useRef } from "react";
import { updateUser } from "../lib/actions/users";
import { toast } from "react-toastify";
import { User } from "../types/api";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

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
  const [formData, setFormData] = useState({
    name: user.name,
    color: user.color,
    gapDays: user.gapDays,
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "gapDays" && value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: 0,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setShowColorPicker(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const hasChanges =
      formData.name !== user.name ||
      formData.color !== user.color ||
      Number(formData.gapDays) !== user.gapDays;

    if (!hasChanges) {
      onCancel()
      toast.info("Nepadarete jokių pakeitimų");
      return;
    }

    try {
      setLoading(true);
      await updateUser(user.email, {
        ...formData,
        gapDays: Number(formData.gapDays),
      });
      toast.success("Vartotojas sėkmingai atnaujintas");

      const updatedUser = {
        ...user,
        ...formData,
        gapDays: Number(formData.gapDays),
        updatedAt: new Date().toISOString(),
      };
      onUserUpdated(updatedUser);
      await update({ force: true });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vardas
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent transition-all"
              placeholder="Jonas Jonaitis"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atostogu Tarpas
            </label>
            <input
              type="number"
              name="gapDays"
              min="0"
              step="1"
              value={formData.gapDays}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Ensure zero is properly handled on blur
                if (e.target.value === "") {
                  setFormData((prev) => ({
                    ...prev,
                    gapDays: 0,
                  }));
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent transition-all"
              placeholder="Atostogu Tarpas"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spalva
            </label>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-gray-700">Pasirinkti spalvą</span>
              </div>
              <X
                size={18}
                className={`transform transition-transform ${showColorPicker ? "rotate-0" : "rotate-45"
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
                      className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color
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
