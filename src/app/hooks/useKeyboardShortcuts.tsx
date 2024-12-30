import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  isOpen: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>; // Keep it required
  onClose: () => void;
  disabled?: boolean;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const useKeyboardShortcuts = ({
  isOpen,
  onSubmit,
  onClose,
  disabled = false,
  formRef,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (!isOpen || disabled) return;

      if (event.key === "Enter") {
        event.preventDefault();
        // Always provide the event since the type requires it
        const fakeEvent = {
          preventDefault: () => {},
        } as React.FormEvent;
        await onSubmit(fakeEvent);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!formRef?.current) return;

      if (isOpen && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onSubmit, onClose, disabled, formRef]);
};
