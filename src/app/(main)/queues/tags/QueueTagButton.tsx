import { useState } from "react";
import { Timer } from "lucide-react";
import QueueTagForm from "./QueueTagForm";
import { LucideIcon } from "lucide-react";

interface QueueTagButtonProps {
  icon?: LucideIcon;
  buttonClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  modalWidth?: string;
  children?: React.ReactNode;
  customOverlayClass?: string;
  customModalClass?: string;
}

export default function QueueTagButton({
  icon: Icon = Timer,
  buttonClassName = "p-2 bg-[#fefaf6] hover:bg-red-100 rounded-lg transition-colors",
  iconClassName = "text-gray-800",
  iconSize = 24,
  modalWidth = "max-w-lg",
  children,
  customOverlayClass = "",
  customModalClass = "",
}: QueueTagButtonProps) {
  const [showQueueTagForm, setShowQueueTagForm] = useState(false);

  const defaultOverlayClass = `fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50`;
  const defaultModalClass = `bg-white rounded-lg w-full mx-4
    transition-all duration-100 ease-out
    motion-safe:transition-[transform,opacity]
    motion-safe:duration-200
    motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1)`;

  return (
    <>
      <button
        onClick={() => setShowQueueTagForm(true)}
        className={buttonClassName}
      >
        {children || <Icon size={iconSize} className={iconClassName} />}
      </button>

      <div
        className={`${defaultOverlayClass} ${customOverlayClass} ${
          showQueueTagForm
            ? "bg-black/50 opacity-100 visible"
            : "bg-black/0 opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setShowQueueTagForm(false)}
      >
        <div
          className={`${defaultModalClass} ${modalWidth} ${customModalClass} ${
            showQueueTagForm
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <QueueTagForm
            onCancel={() => setShowQueueTagForm(false)}
            isOpen={showQueueTagForm}
          />
        </div>
      </div>
    </>
  );
}
