"use client";
import { useState } from "react";
import { Briefcase } from "lucide-react";
import WorkRecordForm from "./WorkRecordForm";

interface WorkRecordButtonProps {
  userId: string;
}

export default function WorkRecordButton({ userId }: WorkRecordButtonProps) {
  const [showWorkRecordForm, setShowWorkRecordForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowWorkRecordForm(true)}
        className="p-2 bg-[#fefaf6] hover:bg-red-100 rounded-lg transition-colors"
      >
        <Briefcase size={24} className="text-gray-800" />
      </button>

      <div
        className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
          showWorkRecordForm
            ? "bg-black/50 opacity-100 visible"
            : "bg-black/0 opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setShowWorkRecordForm(false)}
      >
        <div
          className={`bg-white rounded-lg max-w-lg w-full mx-4  
              transition-all duration-100 ease-out 
          motion-safe:transition-[transform,opacity] 
          motion-safe:duration-200
          motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1)  ${
            showWorkRecordForm
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <WorkRecordForm
            userId={userId}
            onCancel={() => setShowWorkRecordForm(false)}
            isOpen={showWorkRecordForm}
          />
        </div>
      </div>
    </>
  );
}
