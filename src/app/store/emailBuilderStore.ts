import { create } from "zustand";
import { useEffect, useRef } from "react";
import { getDefaultProps } from "../(main)/email/emailComponents";

export interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  richText?: string;
}

interface EmailBuilderState {
  emailComponents: EmailComponent[];
  selectedComponent: EmailComponent | null;
  isNew: boolean;
  isDirty: boolean;

  setEmailComponents: (components: EmailComponent[]) => void;
  setSelectedComponent: (component: EmailComponent | null) => void;
  setIsNew: (isNew: boolean) => void;
  markAsSaved: () => void;
  handleAddComponent: (type: string) => void;
  handleUpdateComponent: (id: string, updates: Partial<EmailComponent>) => void;
  handleContentUpdate: (id: string, content: string) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  handleSelectComponent: (id: string) => void;
  removeComponent: (id: string) => void;
  resetStore: () => void
}

const initialState = {
  emailComponents: [],
  selectedComponent: null,
  isNew: true,
  isDirty: false
};

const useEmailBuilderStore = create<EmailBuilderState>((set) => ({
  ...initialState,

  emailComponents: [],
  selectedComponent: null,
  isNew: true,
  isDirty: false,

  setEmailComponents: (components) => set({ emailComponents: components }),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setIsNew: (isNew) => set({ isNew }),
  markAsSaved: () => set({ isDirty: false }),

  resetStore: () => set(initialState),

  handleAddComponent: (type) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
    };

    set((state) => ({
      emailComponents: [...state.emailComponents, newComponent],
      selectedComponent: newComponent,
      isDirty: true,
    }));
  },

  handleUpdateComponent: (id, updates) => {
    set((state) => {
      const updatedComponents = state.emailComponents.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      );

      let updatedSelectedComponent = state.selectedComponent;
      if (state.selectedComponent && state.selectedComponent.id === id) {
        updatedSelectedComponent =
          updatedComponents.find((c) => c.id === id) || null;
      }

      return {
        emailComponents: updatedComponents,
        selectedComponent: updatedSelectedComponent,
        isDirty: true,
      };
    });
  },

  handleContentUpdate: (id, content) => {
    set((state) => {
      let updatedComponent = null;
      const updatedComponents = state.emailComponents.map((component) => {
        if (component.id === id) {
          const updated = {
            ...component,
            props: {
              ...component.props,
              content: content,
            },
          };
          updatedComponent = updated;
          return updated;
        }
        return component;
      });

      let updatedSelectedComponent = state.selectedComponent;
      if (
        state.selectedComponent &&
        state.selectedComponent.id === id &&
        updatedComponent
      ) {
        updatedSelectedComponent = updatedComponent;
      }

      return {
        emailComponents: updatedComponents,
        selectedComponent: updatedSelectedComponent,
        isDirty: true,
      };
    });
  },

  moveComponent: (dragIndex, hoverIndex) => {
    set((state) => {
      const newComponents = [...state.emailComponents];
      const draggedItem = newComponents[dragIndex];

      newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, draggedItem);

      return {
        emailComponents: newComponents,
        isDirty: true,
      };
    });
  },

  handleSelectComponent: (id) => {
    set((state) => {
      const component = state.emailComponents.find((c) => c.id === id);
      return component ? { selectedComponent: component } : {};
    });
  },

  removeComponent: (id) => {
    set((state) => {
      const filteredComponents = state.emailComponents.filter(
        (c) => c.id !== id
      );

      if (state.emailComponents.length === 1) {
        localStorage.removeItem("emailBuilderComponents");
      }

      return {
        emailComponents: filteredComponents,
        selectedComponent:
          state.selectedComponent?.id === id ? null : state.selectedComponent,
        isDirty: true,
      };
    });
  },
}));

export const useEmailBuilderUI = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { selectedComponent, setSelectedComponent } = useEmailBuilderStore();

  useEffect(() => {
    const unsubscribe = useEmailBuilderStore.subscribe(
      state => console.log("Store state changed:", state)
    );

    console.log("Current store state:", useEmailBuilderStore.getState());

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    const clickOutsideHandler = (e: MouseEvent) => {
      if (!selectedComponent) return;
      const closestKeepElement =
        e.target instanceof Element
          ? e.target.closest('[data-keep-component="true"]')
          : null;

      if (closestKeepElement) return;

      const isClickInCriticalArea =
        panelRef?.current?.contains(e.target as Node) ||
        canvasRef?.current?.contains(e.target as Node);

      if (!isClickInCriticalArea) {
        setSelectedComponent(null);
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [selectedComponent, panelRef, canvasRef, setSelectedComponent]);

  const { emailComponents, isNew, isDirty } = useEmailBuilderStore();

  useEffect(() => {
    if (emailComponents.length && isNew) {
      localStorage.setItem(
        "emailBuilderComponents",
        JSON.stringify(emailComponents)
      );
    }

    console.log("Mark:", isDirty);
  }, [emailComponents, isNew, isDirty]);

  return {
    panelRef,
    canvasRef,
  };
};

export default useEmailBuilderStore;
