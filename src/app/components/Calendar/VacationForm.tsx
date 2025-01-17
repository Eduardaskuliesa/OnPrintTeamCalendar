"use client";

import React, { useState, useEffect, useRef } from "react";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import { bookVacation } from "@/app/lib/actions/vacations/bookVacation";
import { createVacationEvents } from "@/app/utils/eventUtils";
import DateSelection from "../selectors/DateSelection";
import SubmitButton from "../buttons/SubmitButton";
import { Event, VacationData } from "@/app/types/event";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

interface VacationFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onVacationCreated?: (events: Event[]) => void;
}

const VacationForm = ({
  isOpen,
  onClose,
  initialStartDate,
  initialEndDate,
  onVacationCreated,
}: VacationFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (initialStartDate) {
      const start = new Date(initialStartDate);
      start.setDate(start.getDate() + 1);

      const end = initialEndDate
        ? new Date(initialEndDate)
        : new Date(initialStartDate);
      end.setDate(end.getDate());

      setFormData({
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      });
    }
  }, [initialStartDate, initialEndDate]);

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

      if (result.success && result.data) {
        const events = createVacationEvents(result.data as VacationData);
        onVacationCreated?.(events as Event[]);
        toast.success("Rezervacija sėkmingai užregistruota.Laukite patvirtinimo.");
        handleClose();
        return;
      }

      setError(result.error);
      toast.error("Nepavyko užregistruoti atostogų");
    } catch (err) {
      console.error(err);
      setError("Įvyko nenumatyta klaida");
      toast.error("Sistemos klaida");
    } finally {
      setLoading(false);
    }
  };

  useKeyboardShortcuts(isOpen, handleClose, undefined, formRef);

  return (
    <div
      className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
        isOpen
          ? "bg-black/50 opacity-100 visible"
          : "bg-black/0 opacity-0 invisible"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md relative 
          transition-all duration-200 ease-out 
          motion-safe:transition-[transform,opacity] 
          motion-safe:duration-300
          motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1) 
          ${
            isOpen
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-vdcoffe" />
            <h2 className="text-xl font-semibold text-gray-900">
              {initialStartDate
                ? "Registruoti pasirinktas atostogas"
                : "Registruoti atostogas"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 p-0.5 hover:bg-gray-200 rounded-sm hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          <DateSelection
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) =>
              setFormData({ ...formData, startDate: date })
            }
            onEndDateChange={(date) => setFormData({ ...formData, endDate: date })}
            disabled={loading}
            startLabel="Pradžios data"
            endLabel="Pabaigos data"
            minStartDate={new Date().toISOString().split("T")[0]}
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <SubmitButton
              loading={loading}
              text="Registruoti"
              loadingText="Siunčiama..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacationForm;