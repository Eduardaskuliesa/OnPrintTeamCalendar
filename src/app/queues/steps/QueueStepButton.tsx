import { useState } from "react";
import { Timer } from "lucide-react";
import QueueStepForm from "./QueueStepForm";
import { LucideIcon } from "lucide-react";

interface QueueStepButtonProps {
  icon?: LucideIcon;
  buttonClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  modalWidth?: string;
  children?: React.ReactNode;
  customOverlayClass?: string;
  customModalClass?: string;
}

export default function QueueStepButton({
  icon: Icon = Timer,
  buttonClassName = "p-2 bg-[#fefaf6] hover:bg-red-100 rounded-lg transition-colors",
  iconClassName = "text-gray-800",
  iconSize = 24,
  modalWidth = "max-w-lg",
  children,
  customOverlayClass = "",
  customModalClass = "",
}: QueueStepButtonProps) {
  const [showQueueStepForm, setShowQueueStepForm] = useState(false);

  const defaultOverlayClass = `fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50`;
  const defaultModalClass = `bg-white rounded-lg w-full mx-4
    transition-all duration-100 ease-out
    motion-safe:transition-[transform,opacity]
    motion-safe:duration-200
    motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1)`;

  return (
    <>
      <button
        onClick={() => setShowQueueStepForm(true)}
        className={buttonClassName}
      >
        {children || <Icon size={iconSize} className={iconClassName} />}
      </button>

      <div
        className={`${defaultOverlayClass} ${customOverlayClass} ${
          showQueueStepForm
            ? "bg-black/50 opacity-100 visible"
            : "bg-black/0 opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setShowQueueStepForm(false)}
      >
        <div
          className={`${defaultModalClass} ${modalWidth} ${customModalClass} ${
            showQueueStepForm
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <QueueStepForm
            onCancel={() => setShowQueueStepForm(false)}
            isOpen={showQueueStepForm}
          />
        </div>
      </div>
    </>
  );
}
