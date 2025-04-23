import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConstantPanelState {
  isOpen: boolean;
  content: string;
  portalTarget: HTMLElement | null;
  position: { x: number; y: number };
  componentId: string | null;
  wasUserClosed: boolean;

  openPanel: (content: string, componentId: string) => void;
  closePanel: (isUserClosed?: boolean) => void; // Flag to indicate if closed by user action
  updateContent: (content: string) => void;
  updatePosition: (position: { x: number; y: number }) => void;
  setPortalTarget: (element: HTMLElement | null) => void;
  handleComponentSelection: (selectedId: string | null) => void; // Handle component selection/deselection
}

const useConstantPanelStore = create<ConstantPanelState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      content: "",
      portalTarget: null,
      position: { x: -100, y: 100 },
      componentId: null,
      wasUserClosed: false,

      openPanel: (content, componentId) =>
        set({
          isOpen: true,
          content,
          componentId,
          wasUserClosed: false,
        }),

      closePanel: (isUserClosed = false) =>
        set({
          isOpen: false,
          content: "",
          wasUserClosed: isUserClosed,
        }),

      updateContent: (content) => set({ content }),

      updatePosition: (position) => set({ position }),

      setPortalTarget: (element) => set({ portalTarget: element }),

      handleComponentSelection: (selectedId) => {
        const { componentId, isOpen, wasUserClosed } = get();
        if (componentId && componentId !== selectedId && isOpen) {
          set({ isOpen: false });
          return;
        }
        if (
          componentId &&
          componentId === selectedId &&
          !isOpen &&
          !wasUserClosed
        ) {
          set({ isOpen: true });
        }
      },
    }),
    {
      name: "constant-panel-storage",
      partialize: (state) => ({
        position: state.position,
        wasUserClosed: state.wasUserClosed,
      }),
    }
  )
);

export default useConstantPanelStore;