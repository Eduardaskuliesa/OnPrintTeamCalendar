/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { getDefaultProps } from "../emailComponents";

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  richText?: string;
}

export function useEmailBuilder(initialComponents: EmailComponent[] = []) {
  const [emailComponents, setEmailComponents] =
    useState<EmailComponent[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] =
    useState<EmailComponent | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddComponent = (type: string) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
    };

    setEmailComponents([...emailComponents, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handleUpdateComponent = (
    id: string,
    updates: Partial<EmailComponent>
  ) => {
    setEmailComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      )
    );
  };

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const newComponents = [...emailComponents];
    const draggedItem = newComponents[dragIndex];

    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedItem);

    setEmailComponents(newComponents);
  };

  const handleSelectComponent = (id: string) => {
    const component = emailComponents.find((c) => c.id === id);
    if (component) {
      setSelectedComponent(component);
    }
  };

  const removeComponent = (id: string) => {
    setEmailComponents(emailComponents.filter((c) => c.id !== id));
    if (selectedComponent?.id === id) setSelectedComponent(null);
  };

  const clickOutsideHandler = (e: MouseEvent) => {
    if (!selectedComponent) return;
    const closestKeepElement =
      e.target instanceof Element
        ? e.target.closest('[data-keep-component="true"]')
        : null;

    if (closestKeepElement) return;

    const isClickInCriticalArea =
      panelRef.current?.contains(e.target as Node) ||
      canvasRef.current?.contains(e.target as Node);

    if (!isClickInCriticalArea) {
      setSelectedComponent(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [selectedComponent]);

  useEffect(() => {
    if (emailComponents.length) {
      localStorage.setItem(
        "emailBuilderComponents",
        JSON.stringify(emailComponents)
      );
    }
  }, [emailComponents]);

  return {
    emailComponents,
    setEmailComponents,
    selectedComponent,
    setSelectedComponent,

    panelRef,
    canvasRef,

    handleAddComponent,
    handleUpdateComponent,
    moveComponent,
    handleSelectComponent,
    removeComponent,
  };
}
