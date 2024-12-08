import { Pencil, Trash2, Loader, ShieldCheck } from "lucide-react";

interface UserActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isAdmin: boolean;
}

export function UserActionButtons({
  onEdit,
  onDelete,
  isDeleting,
  isAdmin,
}: UserActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-2 text-db bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
        title="Edit user"
      >
        <Pencil size={18} />
      </button>
      {isAdmin ? (
        <div className="p-2 text-indigo-600" title="Admin user">
          <ShieldCheck size={18} />
        </div>
      ) : (
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
