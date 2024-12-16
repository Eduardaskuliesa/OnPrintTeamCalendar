import { Pencil, Trash2, Loader, Settings } from "lucide-react";

interface UserActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onSettings: () => void; // Add this new prop
  isDeleting: boolean;
  isAdmin: boolean;
}

export function UserActionButtons({
  onEdit,
  onDelete,
  onSettings,
  isDeleting,
  isAdmin,
}: UserActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onSettings}
        className="p-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        title="User settings"
      >
        <Settings size={18} />
      </button>
      <button
        onClick={onEdit}
        className="p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
        title="Edit user"
      >
        <Pencil size={18} />
      </button>
      {!isAdmin && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-rose-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center"
          title="Delete user"
        >
          {isDeleting ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      )}
    </div>
  );
}
