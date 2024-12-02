interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: DeleteConfirmationProps) => {
  if (!isOpen) return null;
  console.log(userName)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4">Patvirtinkite ištrynimą</h3>
        <p className="mb-6">Ar tikrai norite ištrinti {userName} atostogas?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Atšaukti
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Ištrinti
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
