/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import { usersActions } from "../lib/actions/users";
import { toast } from "react-toastify";
import { User } from "../types/api";
import { X, Eye, EyeOff, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface CreateUserFormProps {
  onUserCreated: (newUser: User) => void;
  onCancel: () => void;
}

export interface FormData {
  email: string;
  password: string;
  name: string;
  color: string;
  role?: string;
  vacationDays: number;
  birthday?: string;
}

export default function CreateUserForm({
  onUserCreated,
  onCancel,
}: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    vacationDays: 20,
    color: COLORS[0],
    birthday: "",
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
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
    try {
      setLoading(true);
      const response = await usersActions.createUser(formData);

      onUserCreated(response.user);
      toast.success("Vartotojas sėkmingai sukurtas");
      setFormData({
        email: "",
        password: "",
        name: "",
        color: COLORS[0],
        vacationDays: 20,
        birthday: "",
      });
    } catch (error: any) {
      toast.error("Šis elpaštas jau yra užimtas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={formRef} className="bg-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Naujas Vartotojas
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vardas
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
                required
                className="w-full h-10 pr-10 rounded-lg"
                placeholder="••••••••"
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
              value={formData.vacationDays}
              onChange={handleInputChange}
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
            {loading ? "Kuriama..." : "Sukurti"}
          </Button>
        </div>
      </form>
    </div>
  );
}
