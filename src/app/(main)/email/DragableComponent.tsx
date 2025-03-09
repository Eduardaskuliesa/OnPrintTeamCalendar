import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Edit, Trash2, GripVertical } from "lucide-react";
import Button from "./emailComponents/Button";

const COMPONENT_TYPE = "EMAIL_COMPONENT";

interface DraggableComponentProps {
  id: string;
  index: number;
  component: any;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  removeComponent: (id: string) => void;
  onSelectComponent: (id: string) => void;
  isSelected: boolean;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  id,
  index,
  component,
  moveComponent,
  removeComponent,
  onSelectComponent,
  isSelected,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: COMPONENT_TYPE,
    hover: (item: any, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const renderEmailComponent = () => {
    switch (component.type) {
      case "button":
        return <Button {...component.props} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`relative ${isDragging ? "opacity-50" : ""} group`}
      onClick={() => onSelectComponent(id)}
    >
      <div
        className={`hover:outline hover:rounded hover:outline-2 hover:outline-db ${isSelected ? "outline outline-2 outline-db rounded" : ""}`}
      >
        {renderEmailComponent()}
      </div>
      <div
        className={`absolute top-2 -right-10  ${isSelected ? "flex" : "hidden"}   bg-gray-800 bg-opacity-80 rounded text-white py-1 px-2 gap-2 z-10`}
      >
        <button
          className="hover:text-red-300"
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default DraggableComponent;
