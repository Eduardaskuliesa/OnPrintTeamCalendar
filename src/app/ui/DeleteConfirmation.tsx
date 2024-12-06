import { RefreshCcw } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  loading: boolean;
  message?: string | JSX.Element;
}

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  message = "Ar tikrai norite ištrinti",
}: DeleteConfirmationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4">Patvirtinkite ištrynimą</h3>
        <p className="mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Atšaukti
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              </>
            ) : (
              "Ištrinti"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
