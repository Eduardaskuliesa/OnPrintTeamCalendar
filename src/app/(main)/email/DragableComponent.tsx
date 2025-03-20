"use client";
import React, { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash2, ArrowUp, ArrowDown, Copy, GripVertical, Move } from "lucide-react";
import EmailImage from "./emailComponents/Image";
import EmailHeading from "./emailComponents/Header";
import EmailSpacer from "./emailComponents/Spacer";
import EmailText from "./emailComponents/Text";
import RichTextWrapperButton from "./richTextWrappers/RichTextWrapperButton";

const COMPONENT_TYPE = "EMAIL_COMPONENT";

interface DraggableComponentProps {
  id: string;
  index: number;
  component: any;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  removeComponent: (id: string) => void;
  onUpdateComponent: (id: string, props: any) => void;
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
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: COMPONENT_TYPE,
    item: () => {
      return { id, index, type: component.type };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

    isDragging: (monitor) => {
      return monitor.getItem().id === id;
    },
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: COMPONENT_TYPE,
    hover: (item: any, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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
      canDrop: !!monitor.canDrop(),
    }),
  });

  dragPreview(drop(ref));

  useEffect(() => {
    if (dragHandleRef.current || isSelected) {
      drag(dragHandleRef.current);
    }
  }, [drag, isSelected]);

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      moveComponent(index, index - 1);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveComponent(index, index + 1);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Copy component:", id);
  };

  const renderEmailComponent = () => {
    switch (component.type) {
      case "button":
        return <RichTextWrapperButton component={component} />;
      case "image":
        return <EmailImage {...component.props} />;
      case "header":
        return <EmailHeading {...component.props} />;
      case "spacer":
        return <EmailSpacer {...component.props} />;
      case "text":
        return <EmailText {...component.props} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-200 ${
        isDragging ? "opacity-50 scale-[0.97]" : ""
      } ${isOver && canDrop ? "translate-y-1" : ""}`}
      onClick={() => onSelectComponent(id)}
    >
      <div
        className={`
          ${isSelected ? "outline outline-2 overflow-hidden outline-vdcoffe rounded" : ""}
          hover:outline hover:outline-2 hover:outline-vdcoffe hover:rounded
        `}
      >
        {renderEmailComponent()}
      </div>

      {isSelected && (
        <div className="absolute top-0 rounded-sm -left-14 flex flex-col gap-2 z-10">
          <div className="bg-white px-1 py-1 border border-gray-200 rounded shadow-sm flex flex-col items-center">
            <div
              ref={dragHandleRef}
              className="p-1.5 cursor-grab border-b rounded-sm active:cursor-grabbing hover:bg-gray-100 transition-colors w-full text-center"
              title="Drag to reorder"
            >
              <Move size={20} className="text-gray-700 mx-auto" />
            </div>

            <button
              onClick={handleMoveUp}
              className="p-1.5 hover:bg-gray-100 border-b rounded-sm transition-colors w-full text-gray-700"
              title="Move up"
            >
              <ArrowUp size={20} className="mx-auto" />
            </button>

            <button
              onClick={handleMoveDown}
              className="p-1.5 hover:bg-gray-100 border-b rounded-sm transition-colors w-full text-gray-700"
              title="Move down"
            >
              <ArrowDown size={20} className="mx-auto" />
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-100 border-b rounded-sm transition-colors w-full text-gray-700"
              title="Duplicate"
            >
              <Copy size={20} className="mx-auto" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeComponent(id);
              }}
              className="p-1.5 hover:bg-red-50 rounded-sm transition-colors w-full text-gray-700 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={20} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;
