"use client";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkRecordForm from "./WorkRecordForm";

interface WorkRecordButtonProps {
  userId: string;
}

export default function WorkRecordButton({ userId }: WorkRecordButtonProps) {
  const [showWorkRecordForm, setShowWorkRecordForm] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowWorkRecordForm(true)}
        className="bg-lcoffe text-db hover:bg-dcoffe h-10 flex items-center gap-2"
      >
        <PlusCircle className="h-5 w-5" />
        New Work Record
      </Button>

      {showWorkRecordForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowWorkRecordForm(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <WorkRecordForm
              userId={userId}
              onRecordCreated={() => setShowWorkRecordForm(false)}
              onCancel={() => setShowWorkRecordForm(false)}
              isOpen={showWorkRecordForm}
            />
          </div>
        </div>
      )}
    </>
  );
}
