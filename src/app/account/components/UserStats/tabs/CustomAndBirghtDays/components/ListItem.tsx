import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Birthday, CustomDay } from "../types";

interface ListItemProps {
  item: Birthday | CustomDay;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const ListItem = ({ item, onUpdate, onDelete, formatDate }: ListItemProps) => (
  <div className="flex items-center justify-between bg-slate-50 border border-blue-50 shadow-sm px-3 py-2 rounded-lg">
    <div className="flex items-center gap-3">
      <span className="font-medium text-sm text-gray-800">{item.name}</span>
      <span className="text-sm text-gray-600">{formatDate(item.fullDate)}</span>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() =>
          onUpdate("birthdayId" in item ? item.birthdayId : item.customDayId)
        }
      >
        <Pencil
          size={16}
          className="text-slate-700 hover:text-slate-900 transition-colors"
        />
      </button>
      <button
        onClick={() =>
          onDelete("birthdayId" in item ? item.birthdayId : item.customDayId)
        }
      >
        <Trash2
          size={16}
          className="text-red-600 hover:text-red-800 transition-colors"
        />
      </button>
    </div>
  </div>
);
export default ListItem;
