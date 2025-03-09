import React from "react";
import DraggableComponent from "./DragableComponent";

interface DraggableEmailCanvasProps {
  components: any[];
  setComponents: (components: any[]) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  removeComponent: (id: string) => void;
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
}

const DraggableEmailCanvas: React.FC<DraggableEmailCanvasProps> = ({
  components,
  moveComponent,
  removeComponent,
  onSelectComponent,
  selectedComponentId,
}) => {
  return (
    <div className="min-h-[400px] border-2 border-dashed border-gray-300  rounded bg-gray-50">
      {components.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          Drag components here or select from the palette
        </div>
      ) : (
        <div>
          {components.map((component, index) => (
            <DraggableComponent
              key={component.id}
              id={component.id}
              index={index}
              component={component}
              moveComponent={moveComponent}
              removeComponent={removeComponent}
              onSelectComponent={onSelectComponent}
              isSelected={component.id === selectedComponentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableEmailCanvas;
