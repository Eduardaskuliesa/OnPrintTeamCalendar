import React, { useRef } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import {
  IoImageOutline,
  IoLinkOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { BsTypeH1 } from "react-icons/bs";
import { FiDivide } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";

// Define item type constant
const COMPONENT_TYPE = "COMPONENT";

interface ComponentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DragItem {
  type: string;
}

interface SimpleComponentsProps {
  onAddComponent: (id: string) => void;
}

const DraggableItem: React.FC<{ component: ComponentItem, onAddComponent: (id: string) => void }> = ({
  component,
  onAddComponent
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: COMPONENT_TYPE,
    item: { type: component.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(divRef)

  return (
    <div
      ref={divRef}
      className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-md border-2 hover:bg-slate-50 transition-colors aspect-square cursor-grab ${isDragging ? "opacity-50" : ""
        }`}
      onClick={() => onAddComponent(component.id)}
    >
      <div className="text-vdcoffe mt-2">{component.icon}</div>
      <span className="text-sm font-medium text-gray-900 mb-2">
        {component.name}
      </span>
      <span><MdDragIndicator className="rotate-90 w-4 h-4 text-gray-500 opacity-70" /></span>
    </div>
  );
};

const SimpleComponents: React.FC<SimpleComponentsProps> = ({ onAddComponent }) => {
  const components: ComponentItem[] = [
    { id: "button", name: "Button", icon: <IoLinkOutline size={24} /> },
    { id: "image", name: "Image", icon: <IoImageOutline size={24} /> },
    { id: "header", name: "Header", icon: <BsTypeH1 size={24} /> },
    { id: "text", name: "Text", icon: <IoDocumentTextOutline size={24} /> },
    { id: "divider", name: "Divider", icon: <FiDivide size={24} /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-[320px]">
      {components.map((component) => (
        <DraggableItem
          key={component.id}
          component={component}
          onAddComponent={onAddComponent}
        />
      ))}
    </div>
  );
};

export default SimpleComponents;