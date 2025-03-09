import React from "react";
import { HiOutlineTemplate } from "react-icons/hi";

interface PrebuiltComponentsProps {
  onAddComponent: (id: string, type: string) => void;
}

const PrebuiltComponents = ({ onAddComponent }: PrebuiltComponentsProps) => {
  const prebuiltTemplates = [
    {
      id: "welcome",
      name: "Welcome Email",
      icon: <HiOutlineTemplate size={24} />,
    },
    {
      id: "newsletter",
      name: "Newsletter",
      icon: <HiOutlineTemplate size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {prebuiltTemplates.map((template) => (
        <button
          key={template.id}
          className="flex items-center p-4 bg-white border-2 rounded-lg shadow-md hover:bg-slate-50 transition-colors"
          onClick={() => onAddComponent(template.id, "prebuilt")}
        >
          <div className="text-vdcoffe mr-3">{template.icon}</div>
          <span className="text-sm font-medium text-gray-900">
            {template.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PrebuiltComponents;
