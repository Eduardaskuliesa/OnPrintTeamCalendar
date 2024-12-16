import { useEffect } from "react";

export const useKeyboardShortcuts = (
  isEditing: boolean,
  onSave: () => void,
  onCancel: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEditing) return;

      if (event.key === "Enter") {
        event.preventDefault();
        onSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, onSave, onCancel]);
};
