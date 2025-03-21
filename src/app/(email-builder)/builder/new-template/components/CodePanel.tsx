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
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Update local content when store content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Close panel if no component is selected
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
    };
  }, [isDragging]);

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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  const applyChanges = () => {
    // First update the code panel store
    updateContent(localContent);

    // Then update the component content in the email builder store
    if (selectedComponentId) {
      handleContentUpdate(selectedComponentId, localContent);
    }
  };

  const handleClose = () => {
    closePanel(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Apply changes on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      applyChanges();
    }
  };

  // Position panel inside canvas if needed when first opened
  useEffect(() => {
    if (isOpen && canvasRef?.current && panelRef.current) {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const panelBounds = panelRef.current.getBoundingClientRect();

      let newPosition = { ...position };
      let needsUpdate = false;

      // Check if panel is outside canvas boundaries
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
        width: "350px",
      }}
      data-keep-component="true"
    >
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "#f3f4f6",
          borderBottom: "1px solid #e5e7eb",
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
      <div style={{ padding: "10px" }} data-keep-component="true">
        <textarea
          ref={textareaRef}
          className="w-full h-48 p-2 text-sm font-mono border border-gray-300 rounded"
          value={localContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-keep-component="true"
        />
        <div className="mt-2 text-right">
          <button
            onClick={applyChanges}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
            type="button"
            data-keep-component="true"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>,
    target
  );
};

export default DraggableCodePanel;
