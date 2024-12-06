/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { updatePassword } from "../lib/actions/users";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface PasswordError {
  field: "currentPassword" | "newPassword" | null;
  message: string;
}

export default function PasswordForm() {
  const { data: session } = useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PasswordError | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if current and new password are the same
    if (passwordData.currentPassword === passwordData.newPassword) {
      const newPasswordError: PasswordError = {
        field: "newPassword",
        message: "Slaptažodis negali būti toks pat kaip dabartinis",
      };
      setError(newPasswordError);
      toast.error(newPasswordError.message);

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);

      setLoading(false);
      return;
    }

    try {
      await updatePassword(
        session?.user.email,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Slaptažodis sėkmingai pakeistas");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      if (err.message === "Invalid current password") {
        setError({
          field: "currentPassword",
          message: "Neteisingas dabartinis slaptažodis",
        });
      } else if (err.message === "User not found") {
        setError({
          field: null,
          message: "Vartotojas nerastas",
        });
      } else {
        setError({
          field: null,
          message: "Įvyko klaida keičiant slaptažodį",
        });
      }
      toast.error(
        err.message === "Invalid current password"
          ? "Neteisingas dabartinis slaptažodis"
          : "Įvyko klaida keičiant slaptažodį"
      );
      setTimeout(() => {
        setError(null);
      }, 7000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="bg-slate-50 rounded-lg shadow-md border-2 border-blue-50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Keisti slaptažodį</h2>
          {error?.field === null && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error.message}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-db">
                Dabartinis slaptažodis
              </label>
              <div className="flex relative mt-1">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  required
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className={`flex-1 pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent ${
                    error?.field === "currentPassword"
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="ml-2 text-gray-600 absolute right-2 top-3 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {error?.field === "currentPassword" && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-db">
                Naujas slaptažodis
              </label>
              <div className="flex relative mt-1">
                <input
                  required
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className={`flex-1 pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent ${
                    error?.field === "newPassword"
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-3 text-gray-600 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error?.field === "newPassword" && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-lcoffe text-gray-950 rounded-lg hover:bg-dcoffe transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                "Keičiama..."
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Pakeisti
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
