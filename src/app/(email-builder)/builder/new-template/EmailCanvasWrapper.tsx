"use client";
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import DraggableEmailCanvas from "@/app/(main)/email/DragableEmailCanvas";

interface EmailCanvasWrapperProps {
    canvasRef: React.RefObject<HTMLDivElement>;
    emailComponents: any[];
    setEmailComponents: (components: any[]) => void;
    moveComponent: (dragIndex: number, hoverIndex: number) => void;
    onUpdateComponent: (id: string, props: any) => void
    removeComponent: (id: string) => void;
    handleSelectComponent: (id: string) => void;
    selectedComponentId?: string;
}

const EmailCanvasWrapper: React.FC<EmailCanvasWrapperProps> = ({
    canvasRef,
    emailComponents,
    setEmailComponents,
    moveComponent,
    removeComponent,
    handleSelectComponent,
    selectedComponentId,
    onUpdateComponent,
}) => {
    return (
        <div ref={canvasRef} className="w-full  bg-gray-100">
            <div className="bg-red-100 w-full h-[50px] sticky top-[70px]">
         
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl min-h-screen bg-white">
                    <DraggableEmailCanvas
                        onUpdateComponent={onUpdateComponent}
                        components={emailComponents}
                        setComponents={setEmailComponents}
                        moveComponent={moveComponent}
                        removeComponent={removeComponent}
                        onSelectComponent={handleSelectComponent}
                        selectedComponentId={selectedComponentId}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmailCanvasWrapper;
