import React, { Suspense, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DraggableComponent from "./DragableComponent";
import { EmailComponentType, getDefaultProps } from "./utils/componentRegistry";

const COMPONENT_TYPE = "COMPONENT";
const EMAIL_COMPONENT = "EMAIL_COMPONENT";

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface DragItem {
  type: string;
  id?: string;
  index?: number;
}

interface DraggableEmailCanvasProps {
  components: EmailComponent[];
  setComponents: (components: EmailComponent[]) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  onUpdateComponent: (id: string, props: any) => void;
  removeComponent: (id: string) => void;
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
}

const DraggableEmailCanvas: React.FC<DraggableEmailCanvasProps> = ({
  components,
  setComponents,
  moveComponent,
  removeComponent,
  onSelectComponent,
  selectedComponentId,
  onUpdateComponent,
}) => {
  const [insertPosition, setInsertPosition] = useState<number | null>(null);
  const [isDraggingNew, setIsDraggingNew] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, unknown, { isOver: boolean }>({
    accept: [COMPONENT_TYPE, EMAIL_COMPONENT],
    hover: (item, monitor) => {
      if (item.type && !item.id) {
        setIsDraggingNew(true);

        if (canvasRef.current && components.length > 0) {
          const canvasRect = canvasRef.current.getBoundingClientRect();
          const mouseY = monitor.getClientOffset()?.y || 0;
          const relativeY = mouseY - canvasRect.top;

          const children = Array.from(
            canvasRef.current.querySelectorAll(".component-container")
          );

          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childRect = child.getBoundingClientRect();
            const childMiddleY =
              childRect.top + childRect.height / 2 - canvasRect.top;

            if (relativeY < childMiddleY) {
              setInsertPosition(i);
              return;
            }
          }

          setInsertPosition(components.length);
        } else if (components.length === 0) {
          setInsertPosition(0);
        }
      } else {
        setIsDraggingNew(false);
      }
    },
    drop: (item) => {
      if (item.type && !item.id) {
        const position =
          insertPosition !== null ? insertPosition : components.length;

        const newComponent = {
          id: `${item.type}-${Date.now()}`,
          type: item.type,
          props: getDefaultProps(item.type as EmailComponentType),
        };

        const newComponents = [...components];
        newComponents.splice(position, 0, newComponent);

        setComponents(newComponents);
        onSelectComponent(newComponent.id);

        setInsertPosition(null);
        setIsDraggingNew(false);
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const renderInsertIndicator = (position: number) => {
    if (insertPosition === position && isDraggingNew && isOver) {
      return (
        <div className="h-1 bg-dcoffe w-full my-2 rounded animate-pulse" />
      );
    }
    return null;
  };

  drop(canvasRef);

  if (!isOver) {
    if (insertPosition !== null) setInsertPosition(null);
    if (isDraggingNew) setIsDraggingNew(false);
  }

  return (
    <div
      ref={canvasRef}
      className={`canvas min-h-[calc(100vh-130px)]  ${selectedComponentId ? "overflow-visible" : "overflow-hidden"} hover:overflow-visible  ${
        isOver && isDraggingNew
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300"
      } rounded py-0.5  transition-colors duration-200`}
    >
      {components.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          Drag components here or select from the palette
        </div>
      ) : (
        <div>
          {renderInsertIndicator(0)}
          {components.map((component, index) => {
            if (!component || !component.id) return null;
            return (
              <React.Fragment key={component.id}>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="component-container"
                >
                  <Suspense fallback={<div>Loading....</div>}>
                    <DraggableComponent
                      id={component.id}
                      index={index}
                      component={component}
                      onUpdateComponent={onUpdateComponent}
                      moveComponent={moveComponent}
                      removeComponent={removeComponent}
                      onSelectComponent={onSelectComponent}
                      isSelected={component.id === selectedComponentId}
                    />
                  </Suspense>
                </div>
                {renderInsertIndicator(index + 1)}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DraggableEmailCanvas;
