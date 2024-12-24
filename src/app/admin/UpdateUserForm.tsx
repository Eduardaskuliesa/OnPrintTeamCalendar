"use client";

import React, { useState, useEffect, useRef } from "react";
import { updateUser } from "../lib/actions/users/updateUser";
import { toast } from "react-toastify";
import { User } from "../types/api";
import { X, Eye, EyeOff, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNumericInput } from "../hooks/useNumericInput";
import SettingsToggle from "./SettingsToggleUpdateForm";

const COLORS = [
  "#7986cb",
  "#33b679",
  "#8e24aa",
  "#e67c73",
  "#f6c026",
  "#f5511d",
  "#795548",
  "#e91e63",
  "#3f51b5",
  "#0b8043",
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
  const [showPassword, setShowPassword] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    color: user.color,
    useGlobal: user.useGlobal,
    password: "",
    vacationDays: user.vacationDays,
    birthday: user.birthday || "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (newColor: string) => {
    setFormData((prev) => ({ ...prev, color: newColor }));
    setShowColorPicker(false);
  };

  const handleCustomColorAdd = () => {
    if (customColor && /^#([0-9A-F]{3}){1,2}$/i.test(customColor)) {
      COLORS.push(customColor);
      handleColorSelect(customColor);
      setCustomColor("");
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const hasChanges =
      formData.name !== user.name ||
      formData.email !== user.email ||
      formData.color !== user.color ||
      vacationDays.parseValue() !== user.vacationDays ||
      formData.useGlobal !== user.useGlobal ||
      formData.password !== "" ||
      formData.birthday !== user.birthday;

    if (!hasChanges) {
      onCancel();
      toast.info("Nepadarete jokių pakeitimų");
      return;
    }

    try {
      setLoading(true);
      const result = await updateUser(user.userId, {
        ...formData,
        vacationDays: vacationDays.parseValue(),
      });

      if (result.success) {
        toast.success("Vartotojas sėkmingai atnaujintas");
        const updatedUser = {
          ...user,
          ...formData,
          vacationDays: vacationDays.parseValue(),
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={formRef}
        className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Atnaujinti Vartotoją
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <SettingsToggle
            enabled={formData.useGlobal}
            onToggle={(value) =>
              setFormData((prev) => ({ ...prev, useGlobal: value }))
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vardas Pavardė
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full h-10 rounded-lg"
                placeholder="Jonas Jonaitis"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spalva
              </label>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full h-10 flex items-center justify-between outline-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
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
                  className={`transform transition-transform ${
                    showColorPicker ? "rotate-0" : "rotate-45"
                  }`}
                />
              </button>

              {showColorPicker && (
                <div className="absolute z-10 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 w-full">
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color
                            ? "border-dcoffe scale-110"
                            : "border-gray-200 hover:border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="#FFFFFF"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full h-8"
                    />
                    <Button
                      type="button"
                      onClick={handleCustomColorAdd}
                      variant="outline"
                      size="icon"
                      className="h-8 w-12"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                El. paštas
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full h-10 rounded-lg"
                placeholder="jonas@pavyzdys.lt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slaptažodis
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-10 pr-10 rounded-lg"
                  placeholder="Palikite tuščią, jei nekeičiate"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atostogų dienos
              </label>
              <Input
                type="number"
                name="vacationDays"
                value={vacationDays.value}
                onChange={(e) => vacationDays.setValue(e.target.value)}
                min="0"
                max="365"
                className="w-full h-10 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gimimo data
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  name="birthYear"
                  placeholder="Metai"
                  min="1900"
                  maxLength={4}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value.length > 4) {
                      target.value = target.value.slice(0, 4);
                    }
                  }}
                  max={new Date().getFullYear()}
                  onChange={(e) => {
                    const year = e.target.value;
                    const month = formData.birthday?.split("-")[1] || "";
                    const day = formData.birthday?.split("-")[2] || "";
                    setFormData({
                      ...formData,
                      birthday: year ? `${year}-${month}-${day}` : "",
                    });
                  }}
                  value={formData.birthday?.split("-")[0] || ""}
                  className="w-full h-10 rounded-lg"
                />
                <Input
                  type="number"
                  name="birthMonth"
                  placeholder="Mėn"
                  min="1"
                  max="12"
                  maxLength={2}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value.length > 2) {
                      target.value = target.value.slice(0, 2);
                    }
                  }}
                  onChange={(e) => {
                    const year = formData.birthday?.split("-")[0] || "";
                    const month = e.target.value.padStart(2, "0");
                    const day = formData.birthday?.split("-")[2] || "";
                    setFormData({
                      ...formData,
                      birthday: month ? `${year}-${month}-${day}` : "",
                    });
                  }}
                  value={
                    formData.birthday?.split("-")[1]?.replace(/^0/, "") || ""
                  }
                  className="w-full h-10 rounded-lg"
                />
                <Input
                  type="number"
                  name="birthDay"
                  placeholder="Diena"
                  min="1"
                  max="31"
                  maxLength={2}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value.length > 2) {
                      target.value = target.value.slice(0, 2);
                    }
                  }}
                  onChange={(e) => {
                    const year = formData.birthday?.split("-")[0] || "";
                    const month = formData.birthday?.split("-")[1] || "";
                    const day = e.target.value.padStart(2, "0");
                    setFormData({
                      ...formData,
                      birthday: day ? `${year}-${month}-${day}` : "",
                    });
                  }}
                  value={
                    formData.birthday?.split("-")[2]?.replace(/^0/, "") || ""
                  }
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="h-10 rounded-lg hover:bg-gray-200"
            >
              Atšaukti
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
            >
              {loading ? "Atnaujinama..." : "Atnaujinti"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
