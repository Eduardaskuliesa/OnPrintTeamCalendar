import React, { useState } from "react";
import ButtonEditorTabs from "./ButtonEditorTabs";
import ButtonContentTab from "./ButtonContentTab";
import ButtonStylesTab from "./ButtonStylesTab";
import { EmailButtonProps } from "../../../emailComponents/Button";

interface ButtonComponent {
  id: string;
  type: string;
  props: EmailButtonProps;
}

interface ButtonEditorProps {
  component: ButtonComponent;
  updateComponent: (id: string, updates: Partial<ButtonComponent>) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = ({
  component,
  updateComponent,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "styles">("content");
  const [localProps, setLocalProps] = useState<EmailButtonProps>({
    ...component.props,
    target: component.props.target || "_blank",
    borderRadius: component.props.borderRadius || 0,
    borderStyle: component.props.borderStyle || "none",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedProps = {
      ...localProps,
      [name]: value,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleTargetChange = (value: "_blank" | "_self") => {
    const updatedProps = {
      ...localProps,
      target: value,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleShapeChange = (borderRadius: number) => {
    const updatedProps = {
      ...localProps,
      borderRadius,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBorderStyleChange = (
    borderStyle: "none" | "solid" | "dashed" | "dotted" | "double"
  ) => {
    const updatedProps = {
      ...localProps,
      borderStyle,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBorderWidthChange = (borderWidth: number) => {
    const updatedProps = {
      ...localProps,
      borderWidth,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBorderColorChange = (borderColor: string) => {
    const updatedProps = {
      ...localProps,
      borderColor,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBackgroundColorChange = (backgroundColor: string) => {
    const updateProps = {
      ...localProps,
      backgroundColor,
    };
    setLocalProps(updateProps);
    updateComponent(component.id, { props: updateProps });
  };

  const handleTextColorChange = (textColor: string) => {
    const updateProps = {
      ...localProps,
      textColor,
    };

    setLocalProps(updateProps);
    updateComponent(component.id, { props: updateProps });
  };

  return (
    <div className="">
      <ButtonEditorTabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />

      {activeTab === "content" ? (
        <ButtonContentTab
          localProps={localProps}
          handleChange={handleChange}
          handleTargetChange={handleTargetChange}
        />
      ) : (
        <ButtonStylesTab
          handleBorderColorChange={handleBorderColorChange}
          handleBorderWidthChange={handleBorderWidthChange}
          handleBorderStyleChange={handleBorderStyleChange}
          handleBackgroundColorChange={handleBackgroundColorChange}
          handleTextColorChange={handleTextColorChange}
          handleShapeChange={handleShapeChange}
          localProps={localProps}
        />
      )}
    </div>
  );
};

export default ButtonEditor;
