import React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingSection } from "@/types/global-settings";

interface SettingRowProps {
  section: SettingSection;
  onEdit: (section: SettingSection) => void;
}

export const SettingRow = ({ section, onEdit }: SettingRowProps) => {
  return (
    <div className="flex items-center border-b border-slate-300 py-3 last:border-0">
      <div className="flex items-center space-x-4 w-[250px]">
        <div className={`p-2 rounded-lg ${section.bgColor}`}>
          <section.icon className={`w-5 h-5 ${section.color}`} />
        </div>
        <div>
          <p className="font-medium text-gray-950">{section.title}</p>
          <p className="text-sm text-gray-600">
            {section.items.length} settings
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {section.items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm"
          >
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center gap-2">
              {typeof item.value === "boolean" ? (
                <Switch
                  checked={item.value}
                  onClick={() => onEdit(section)}
                  className="data-[state=checked]:bg-green-500"
                />
              ) : (
                <span
                  className="font-medium cursor-pointer"
                  onClick={() => onEdit(section)}
                >
                  {item.value}{" "}
                  {item.label.toLowerCase().includes("days") && "days"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ml-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(section)}>
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
