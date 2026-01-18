"use client";

import React, { useRef } from "react";
import { ArrowRightLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

interface TransferBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  fromYear: number;
  balanceValue: string;
  isPositive: boolean;
}

const TransferBalanceModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  fromYear,
  balanceValue,
  isPositive,
}: TransferBalanceModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcuts(isOpen, onClose, undefined, modalRef);

  const toYear = fromYear + 1;

  return (
    <div
      className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
        isOpen
          ? "bg-black/50 opacity-100 visible"
          : "bg-black/0 opacity-0 invisible"
      }`}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
      >
        <div className="flex items-center justify-between pt-4 pb-4 px-6 border-b">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-vdcoffe" />
            <h2 className="text-xl font-semibold text-db">
              Perkelti balansą
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 p-1 bg-gray-100 hover:bg-gray-200 rounded-sm hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Metai:</span>
              <span className="font-semibold text-db">
                {fromYear} → {toYear}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tipas:</span>
              <span
                className={`font-semibold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "Viršvalandžiai" : "Skola"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valandos:</span>
              <span
                className={`font-bold text-lg ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {balanceValue}h
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Bus sukurtas naujas darbo valandų įrašas <strong>{toYear}-01-01</strong> datai
            su {isPositive ? "viršvalandžių" : "skolos"} balansu iš {fromYear} metų.
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              className="h-10 rounded-lg hover:bg-gray-200"
            >
              Atšaukti
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Perkeliama...
                </>
              ) : (
                "Perkelti"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferBalanceModal;
