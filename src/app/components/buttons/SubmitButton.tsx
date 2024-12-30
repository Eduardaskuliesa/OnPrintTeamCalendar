"use client";
import { Loader } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

const SubmitButton = ({
  loading,
  disabled = false,
  text = "Submit",
  loadingText = "Submitting...",
  className = "",
  type = "submit",
  onClick,
}: SubmitButtonProps) => (
  <button
    type={type}
    disabled={loading || disabled}
    onClick={onClick}
    className={`w-full px-4 py-2 text-sm font-medium text-gray-950 bg-lcoffe border border-transparent 
      rounded-md shadow-sm hover:bg-dcoffe focus:outline-none focus:ring-2 focus:ring-slate-50 
      focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2 
      ${className}`}
  >
    {loading ? (
      <>
        <Loader size={16} className="animate-spin"></Loader>
        {loadingText}
      </>
    ) : (
      text
    )}
  </button>
);

export default SubmitButton;
