/* eslint-disable @typescript-eslint/no-unused-vars */
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { bookVacation } from "@/app/lib/actions/vacation";
import { toast } from "react-toastify";

interface VacationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
type ErrorType = "OVERLAP" | "GAP_CONFLICT" | "default";

export interface FormData {
  startDate: string;
  endDate: string;
}

const VacationForm = ({ isOpen, onClose, onSuccess }: VacationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  const handleClose = () => {
    setFormData({ startDate: "", endDate: "" });
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await bookVacation(formData);

      if (result.success) {
        toast.success("Atostogos sėkmingai užregistruotos");
        handleClose();
        onSuccess();
        return;
      }

      const errorMessages: Record<ErrorType, string> = {
        OVERLAP: "Šios dienos jau užimtos",
        GAP_CONFLICT: "Reikalingas tarpas atostogaujančiu",
        default: "Įvyko klaida. Bandykite dar kartą",
      };

      setError(
        result.conflictData
          ? errorMessages[result.conflictData.type as ErrorType]
          : errorMessages.default
      );
      toast.error("Nepavyko užregistruoti atostogų");
    } catch (err) {
      setError("Įvyko nenumatyta klaida");
      toast.error("Sistemos klaida");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-vdcoffe" />
            <h2 className="text-xl font-semibold text-gray-900">
              Registruoti atostogas
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pradžios data
              </label>
              <input
                type="date"
                required
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pabaigos data
              </label>
              <input
                type="date"
                required
                disabled={loading}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-gray-950 bg-lcoffe border border-transparent rounded-md shadow-sm hover:bg-dcoffe focus:outline-none focus:ring-2 focus:ring-slate-50 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Siunčiama...
                </>
              ) : (
                "Registruoti"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacationForm;
