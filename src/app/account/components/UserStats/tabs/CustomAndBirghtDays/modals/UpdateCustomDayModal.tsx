"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pizza, X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { useQueryClient } from "@tanstack/react-query";
import { updateCustomDay } from "@/app/lib/actions/customBirthDays/updateCustomDay";
import { CustomDayInput } from "../components/CustomDayInput";

interface UpdateCustomDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name: string;
    date: string;
    customDayId: string;
  };
}

const UpdateCustomDayModal = ({
  isOpen,
  onClose,
  initialData,
}: UpdateCustomDayModalProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    date: initialData?.date || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        date: initialData?.date || "",
      });
    }
  }, [isOpen, initialData]);

  const closeModal = () => {
    onClose();
    setFormData({
      name: "",
      date: "",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await updateCustomDay(
        initialData?.customDayId || "",
        formData
      );
      if (result.success) {
        closeModal();
        toast.success("Šventė sėkmingai atnaujinta");
        await queryClient.invalidateQueries({
          queryKey: ["customDays"],
        });
        return;
      }

      setError(result.error || "Nepavyko atnaujinti šventės");
    } catch (err) {
      console.error(err);
      setError("Įvyko nenumatyta klaida");
    } finally {
      setLoading(false);
    }
  };

  useKeyboardShortcuts(isOpen, closeModal, undefined, formRef);

  return (
    <div
      className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
        isOpen
          ? "bg-black/50 opacity-100 visible"
          : "bg-black/0 opacity-0 invisible"
      }`}
    >
      <div
        ref={formRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
      >
        <div className="flex items-center justify-between pt-4 pb-4 px-6 border-b">
          <div className="flex items-center gap-2">
            <Pizza className="w-5 h-5 text-red-500 mb-1" />
            <h2 className="text-xl font-semibold text-db">Pakeisti šventę</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 p-1 bg-gray-100 hover:bg-gray-200 rounded-sm hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-db mb-1">
                Pavadinimas
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dcoffe"
                placeholder="Įveskite šventės pavadinimą"
                disabled={loading}
              />
            </div>

            <CustomDayInput
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={closeModal}
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
              {loading ? "Keičiama..." : "Pakeisti"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomDayModal;
