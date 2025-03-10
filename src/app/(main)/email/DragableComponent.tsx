import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";
import Button from "./emailComponents/Button";
import EmailImage from "./emailComponents/Image";

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

  const [{ isOver }, drop] = useDrop({
    accept: COMPONENT_TYPE,
    hover: (item: any, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const renderEmailComponent = () => {
    switch (component.type) {
      case "button":
        return <Button {...component.props} />;
      case "image":
        return <EmailImage {...component.props} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`relative ${isDragging ? "opacity-50" : ""}`}
      onClick={() => onSelectComponent(id)}
    >
      <div
        className={`
          ${isSelected ? "outline outline-2 outline-vdcoffe rounded" : ""}
          ${isOver ? "outline outline-4 outline-vdcoffe rounded" : ""}
          hover:outline hover:outline-2 hover:outline-vdcoffe hover:rounded
          cursor-grab transition-all duration-75
        `}
      >
        {renderEmailComponent()}
      </div>

      {isSelected && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(id);
          }}
          className="absolute top-2 group hover:cursor-pointer -right-10 flex bg-gray-800 bg-opacity-80 rounded text-white py-1 px-2 gap-2 z-10"
        >
          <button className="group-hover:text-red-300">
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;