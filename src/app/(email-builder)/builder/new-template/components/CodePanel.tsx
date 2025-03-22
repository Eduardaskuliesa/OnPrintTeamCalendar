/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useCodePanelStore from "@/app/store/codePanelStore";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";

interface DraggableCodePanelProps {
  canvasRef?: React.RefObject<HTMLDivElement>;
}

const DraggableCodePanel: React.FC<DraggableCodePanelProps> = ({
  canvasRef,
}) => {
  const {
    isOpen,
    content,
    position,
    portalTarget,
    closePanel,
    updateContent,
    updatePosition,
  } = useCodePanelStore();

  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );
  const handleContentUpdate = useEmailBuilderStore(
    (state) => state.handleContentUpdate
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [localContent, setLocalContent] = useState(content);
  const [size, setSize] = useState({ width: 350, height: 300 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (isOpen && !selectedComponentId) {
      closePanel(false);
    }
  }, [selectedComponentId, isOpen, closePanel, content]);

  useEffect(() => {
    return () => {
      if (isDragging) {
        handleDragEnd();
      }
      if (isResizing) {
        handleResizeEnd();
      }
    };
  }, [isDragging, isResizing]);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.x;
      const newY = e.clientY - dragStartPos.y;

      // If canvasRef is provided, restrict movement to canvas boundaries
      if (canvasRef?.current && panelRef.current) {
        const canvasBounds = canvasRef.current.getBoundingClientRect();
        const panelBounds = panelRef.current.getBoundingClientRect();

        // Calculate boundaries
        const minX = canvasBounds.left;
        const maxX = canvasBounds.right - panelBounds.width;
        const minY = canvasBounds.top;
        const maxY = canvasBounds.bottom - panelBounds.height;

        // Restrict position within boundaries
        const constrainedX = Math.max(minX, Math.min(maxX, newX));
        const constrainedY = Math.max(minY, Math.min(maxY, newY));

        updatePosition({
          x: constrainedX,
          y: constrainedY,
        });
      } else {
        // If no canvas reference, use the original behavior
        updatePosition({
          x: newX,
          y: newY,
        });
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle panel resizing
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (isResizing && panelRef.current) {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;

      // Update size based on resize direction
      const newSize = { ...size };

      if (resizeDirection?.includes("e")) {
        newSize.width = Math.max(250, size.width + deltaX);
      }
      if (resizeDirection?.includes("s")) {
        newSize.height = Math.max(150, size.height + deltaY);
      }
      if (resizeDirection?.includes("w")) {
        newSize.width = Math.max(250, size.width - deltaX);
        updatePosition({
          x: position.x + deltaX,
          y: position.y,
        });
      }
      if (resizeDirection?.includes("n")) {
        newSize.height = Math.max(150, size.height - deltaY);
        updatePosition({
          x: position.x,
          y: position.y + deltaY,
        });
      }

      setSize(newSize);
      setDragStartPos({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isDragging, isResizing]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  const applyChanges = () => {
    updateContent(localContent);

    if (selectedComponentId) {
      handleContentUpdate(selectedComponentId, localContent);
    }
  };

  const handleClose = () => {
    closePanel(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      applyChanges();
    }
  };

  useEffect(() => {
    if (isOpen && canvasRef?.current && panelRef.current) {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const panelBounds = panelRef.current.getBoundingClientRect();

      const newPosition = { ...position };
      let needsUpdate = false;

      if (position.x < canvasBounds.left) {
        newPosition.x = canvasBounds.left;
        needsUpdate = true;
      } else if (position.x + panelBounds.width > canvasBounds.right) {
        newPosition.x = canvasBounds.right - panelBounds.width;
        needsUpdate = true;
      }

      if (position.y < canvasBounds.top) {
        newPosition.y = canvasBounds.top;
        needsUpdate = true;
      } else if (position.y + panelBounds.height > canvasBounds.bottom) {
        newPosition.y = canvasBounds.bottom - panelBounds.height;
        needsUpdate = true;
      }

      if (needsUpdate) {
        updatePosition(newPosition);
      }
    }
  }, [isOpen, canvasRef, position]);

  if (!isOpen) return null;

  const target = portalTarget || document.body;

  const resizeHandles = [
    {
      dir: "e",
      style: {
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "6px",
        height: "40px",
        cursor: "e-resize",
        backgroundColor: "#e5e7eb",
        borderRadius: "3px",
        opacity: 0.5,
      },
    },
    {
      dir: "s",
      style: {
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "40px",
        height: "6px",
        cursor: "s-resize",
        backgroundColor: "#e5e7eb",
        borderRadius: "3px",
        opacity: 0.5,
      },
    },
    {
      dir: "se",
      style: {
        bottom: 0,
        left: 0,
        width: "14px",
        height: "14px",
        cursor: "ne-resize",
        backgroundColor: "#e5e7eb",
        borderRadius: "50%",
        opacity: 0.5,
      },
    },
  ];

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: portalTarget ? "absolute" : "fixed",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        borderRadius: "4px",
        width: `${size.width}px`,
      }}
      data-keep-component="true"
    >
      {/* Resize handles */}
      {resizeHandles.map(({ dir, style }) => (
        <div
          key={dir}
          style={{
            position: "absolute",
            ...style,
          }}
          onMouseDown={(e) => handleResizeStart(e, dir)}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.backgroundColor = "#3b82f6";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "0.5";
            e.currentTarget.style.backgroundColor = "#e5e7eb";
          }}
          data-keep-component="true"
        />
      ))}

      <div
        className="bg-slate-50 border-b"
        style={{
          padding: "8px 12px",
          cursor: "move",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onMouseDown={handleDragStart}
        data-keep-component="true"
      >
        <span className="font-medium text-sm">HTML Code</span>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ×
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          height: `${size.height - 80}px`,
        }}
        data-keep-component="true"
      >
        <textarea
          ref={textareaRef}
          className="w-full h-full p-2 text-sm font-mono border border-gray-300 rounded resize-none"
          value={localContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-keep-component="true"
        />
      </div>
      <div
        className="p-2 flex justify-end gap-2"
        data-keep-component="true"
      >
        <button
          onClick={handleClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded"
          type="button"
          data-keep-component="true"
        >
          Cancel
        </button>
        <button
          onClick={applyChanges}
          className="px-3 py-1 bg-db text-white text-sm rounded"
          type="button"
          data-keep-component="true"
        >
          Apply Changes
        </button>
      </div>
    </div>,
    target
  );
};

export default DraggableCodePanel;
