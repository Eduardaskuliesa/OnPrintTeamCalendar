"use client";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface EmailPasswordInputProps {
  email: string;
  password: string;
  onChange: (field: "email" | "password", value: string) => void;
  passwordRequired?: boolean;
  passwordPlaceholder?: string;
  className?: string;
}

export const EmailPasswordInput = ({
  email,
  password,
  onChange,
  passwordRequired = true,
  passwordPlaceholder = "••••••••",
  className,
}: EmailPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`grid grid-cols-2 gap-4 ${className || ""}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          El. paštas
        </label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
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
            value={password}
            onChange={(e) => onChange("password", e.target.value)}
            required={passwordRequired}
            className="w-full h-10 pr-10 rounded-lg"
            placeholder={passwordPlaceholder}
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
  );
};
