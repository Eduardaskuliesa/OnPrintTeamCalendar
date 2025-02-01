import {
  Pencil,
  Trash2,
  Loader,
  Settings,
  Briefcase,
  Palmtree,
} from "lucide-react";

interface UserActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onSettings: () => void;
  onVacation: () => void;
  isDeleting: boolean;
  isAdmin: boolean;
  onWorkRecords: () => void;
}

export function UserActionButtons({
  onEdit,
  onDelete,
  onSettings,
  onWorkRecords,
  onVacation,
  isDeleting,
  isAdmin,
}: UserActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onSettings}
        className="p-2 text-slate-800 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
        title="Vartotojo atostogų nustatymai"
      >
        <Settings size={18} />
      </button>
      <button
        onClick={onVacation}
        className="p-2 text-green-800 bg-green-200 rounded-md hover:bg-green-300 transition-colors"
        title="Vartotojo atostogų sąrašas"
      >
        <Palmtree size={18} />
      </button>
      <button
        onClick={onWorkRecords}
        className="p-2 text-sky-800 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors"
        title="Vartotojo darbo valandos"
      >
        <Briefcase size={18} />
      </button>
      <button
        onClick={onEdit}
        className="p-2 text-teal-800 bg-teal-100 rounded-md hover:bg-teal-200 transition-colors"
        title="Vartotojo duomenys"
      >
        <Pencil size={18} />
      </button>
      {!isAdmin && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-rose-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center"
          title="Ištrinti vartotoją"
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
