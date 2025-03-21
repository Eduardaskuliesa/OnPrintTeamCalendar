import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DraggableCodePanelProps {
    initialContent: string;
    onContentChange: (content: string) => void;
    onClose: () => void;
    initialPosition?: { x: number; y: number };
}

const DraggableCodePanel: React.FC<DraggableCodePanelProps> = ({
    initialContent,
    onContentChange,
    onClose,
    initialPosition = { x: 100, y: 100 },
}) => {
    const [content, setContent] = useState(initialContent);
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Drag handlers
    const handleDragStart = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartPos({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleDragMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStartPos.x,
                y: e.clientY - dragStartPos.y,
            });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Add event listeners for drag
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

    // Handle content change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    // Apply changes
    const applyChanges = () => {
        onContentChange(content);
    };

    return createPortal(
        <div
            style={{
                position: "fixed",
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
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
            <div style={{ padding: "10px" }} data-keep-component="true">
                <textarea
                    ref={textareaRef}
                    className="w-full h-48 p-2 text-sm font-mono border border-gray-300 rounded"
                    value={content}
                    onChange={handleChange}
                    data-keep-component="true"
                />
                <div className="mt-2 text-right">
                    <button
                        onClick={applyChanges}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                        data-keep-component="true"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DraggableCodePanel;