import { create } from "zustand";
import { Editor } from "@tiptap/react";

type ComponentType = "button" | "text" | "image" | "divider" | null;

interface ToolbarState {
  isVisible: boolean;
  isEditing: boolean;
  componentId: string | null;
  componentType: ComponentType;
  editor: Editor | null;

  openToolbar: (
    componentId: string,
    componentType: ComponentType,
    editor: Editor | null
  ) => void;
  closeToolbar: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

const useToolbarStore = create<ToolbarState>()((set) => ({
  isVisible: false,
  isEditing: false,
  componentId: null,
  componentType: null,
  editor: null,

  openToolbar: (componentId, componentType, editor) =>
    set({
      isVisible: true,
      isEditing: true,
      componentId,
      componentType,
      editor,
    }),

  closeToolbar: () =>
    set({
      isVisible: false,
      isEditing: false,
    }),

  setIsEditing: (isEditing) => set({ isEditing }),
}));

export default useToolbarStore;
