/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import useConstantPanelStore from "@/app/store/constantPanelStore";
import useToolbarStore from "@/app/store/toolbarStore";


interface DraggablePanelProps {
  canvasRef?: React.RefObject<HTMLDivElement>;
}

const ConstantPanel: React.FC<DraggablePanelProps> = ({ canvasRef }) => {
  const {
    isOpen,
    position,
    portalTarget,
    closePanel,
    updatePosition,
  } = useConstantPanelStore();
  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );
  const currentEditor = useToolbarStore((state) => state.editor)

  const handleConstantClick = (constant: string) => {
    if (selectedComponentId && currentEditor) {
      currentEditor.commands.insertContent(constant);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // constants to show
  const constants = ["{orderId}", "{firstName}", "{lastName}", "{products}", "{orderDate}"];

  useEffect(() => {
    if (isOpen && !selectedComponentId) {
      closePanel(false);
    }
  }, [isOpen, selectedComponentId, closePanel]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartPos.x;
    const newY = e.clientY - dragStartPos.y;

    if (canvasRef?.current && panelRef.current) {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const panelBounds = panelRef.current.getBoundingClientRect();
      const minX = canvasBounds.left;
      const maxX = canvasBounds.right - panelBounds.width;
      const minY = canvasBounds.top;
      const maxY = canvasBounds.bottom - panelBounds.height;
      updatePosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      });
    } else {
      updatePosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => setIsDragging(false);

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
        width: "250px",
      }}
      data-keep-component="true"
    >
      <div
        style={{
          padding: "8px 12px",
          cursor: "move",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
          borderBottom: "1px solid #e5e7eb",
        }}
        onMouseDown={handleDragStart}
      >
        <span className="font-medium text-sm">Constants</span>
        <button
          onClick={() => closePanel(true)}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ×
        </button>
      </div>
      <div style={{ padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
        {constants.map((constant) => (
          <button
            key={constant}
            onClick={() => {
              handleConstantClick(constant)
            }}
            className="block w-full text-left p-2 mb-1 border border-gray-200 rounded hover:bg-gray-50 text-sm font-mono"
            type="button"
          >
            {constant}
          </button>
        ))}
      </div>
    </div>,
    target
  );
};

export default ConstantPanel;
