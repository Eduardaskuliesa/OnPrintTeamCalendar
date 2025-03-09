import React from "react";
import {
  IoImageOutline,
  IoLinkOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { BsTypeH1 } from "react-icons/bs";
import { FiDivide } from "react-icons/fi";

interface SimpleComponentsProps {
  onAddComponent: (id: string) => void;
}

const SimpleComponents = ({ onAddComponent }: SimpleComponentsProps) => {
  const components = [
    { id: "button", name: "Button", icon: <IoLinkOutline size={24} /> },
    { id: "image", name: "Image", icon: <IoImageOutline size={24} /> },
    { id: "header", name: "Header", icon: <BsTypeH1 size={24} /> },
    { id: "text", name: "Text", icon: <IoDocumentTextOutline size={24} /> },
    { id: "divider", name: "Divider", icon: <FiDivide size={24} /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-[320px]">
      {components.map((component) => (
        <button
          key={component.id}
          className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md border-2 hover:bg-slate-50 transition-colors aspect-square"
          onClick={() => onAddComponent(component.id)}
        >
          <div className="text-vdcoffe mb-2">{component.icon}</div>
          <span className="text-sm font-medium text-gray-900">
            {component.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SimpleComponents;
