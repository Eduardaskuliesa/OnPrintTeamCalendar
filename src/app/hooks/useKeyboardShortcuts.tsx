import { useEffect, RefObject } from "react";

export const useKeyboardShortcuts = (
  isEditing: boolean,
  onCancel: () => void,
  onSave?: () => void,
  ref?: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEditing) return;

      if (event.key === "Enter" && onSave) {
        event.preventDefault();
        onSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref?.current &&
        !ref.current.contains(event.target as Node) &&
        isEditing
      ) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    if (ref) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (ref) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isEditing, onSave, onCancel, ref]);
};
