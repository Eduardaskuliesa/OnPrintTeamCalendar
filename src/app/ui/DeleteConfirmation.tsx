import { RefreshCcw } from "lucide-react";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  loading: boolean;
  message?: string | JSX.Element;
  reverseButtons?: boolean;
}

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  message = "Ar tikrai norite ištrinti",
  reverseButtons = false,
}: DeleteConfirmationProps) => {
  useKeyboardShortcuts(isOpen, onClose);
  const deleteButton = (
    <button
      onClick={onConfirm}
      disabled={loading}
      className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-150"
    >
      {loading ? (
        <>
          <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
        </>
      ) : (
        "Ištrinti"
      )}
    </button>
  );

  const cancelButton = (
    <button
      onClick={onClose}
      disabled={loading}
      className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
    >
      Atšaukti
    </button>
  );

  return (
    <div
      className={`fixed inset-0 transition-all duration-150 ease-out flex items-center justify-center z-50 ${
        isOpen
          ? "bg-black/50 opacity-100 visible pointer-events-auto"
          : "bg-black/0 opacity-0 invisible pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-sm w-full
          transition-all duration-200
          motion-safe:transition-[transform,opacity]
          motion-safe:duration-200
          motion-safe:cubic-bezier(0.25, 0.1, 0.1, 1.5)
          ${
            isOpen
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-98 opacity-0 -translate-y-1"
          }
        `}
      >
        <h3 className="text-lg font-medium mb-4">Patvirtinkite ištrynimą</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          {reverseButtons ? (
            <>
              {deleteButton}
              {cancelButton}
            </>
          ) : (
            <>
              {cancelButton}
              {deleteButton}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
