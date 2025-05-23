import React, { useState, useEffect } from "react";
import ButtonEditorTabs from "./ButtonEditorTabs";
import ButtonContentTab from "./ButtonContentTab";
import ButtonStylesTab from "./ButtonStylesTab";

import {
  ButtonWidth,
  ContentAlignment,
  EmailButtonProps,
  TextAlignment,
} from "../../../emailComponents/Button";

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
  const [activeTab, setActiveTab] = useState<"content" | "styles" | "text">(
    "content"
  );
  const [localProps, setLocalProps] = useState<EmailButtonProps>({
    ...component.props,
    target: component.props.target || "_blank",
    borderRadius: component.props.borderRadius || 0,
    content: component.props.content || "",
    borderStyle: component.props.borderStyle || "none",
    textAlignment: component.props.textAlignment || "center",
    contentAlignment: component.props.contentAlignment || "center",
    width: component.props.width || "25%",
    padding: component.props.padding || {
      top: 5,
      bottom: 5,
      left: 0,
      right: 0,
    },
  });

  useEffect(() => {
    setLocalProps({
      ...component.props,
      target: component.props.target || "_blank",
      content: component.props.content || "",
      borderRadius: component.props.borderRadius || 0,
      borderStyle: component.props.borderStyle || "none",
      textAlignment: component.props.textAlignment || "center",
      contentAlignment: component.props.contentAlignment || "center",
      width: component.props.width || "25%",
      padding: component.props.padding || {
        top: 5,
        bottom: 5,
        left: 0,
        right: 0,
      },
    });
  }, [component.id, component.props]);

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

  const handleButtonColorChange = (backgroundColor: string) => {
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

  const handleBackgroundColorChange = (containerBackgroundColor: string) => {
    const updateProps = {
      ...localProps,
      containerBackgroundColor,
    };
    setLocalProps(updateProps);
    updateComponent(component.id, { props: updateProps });
  };

  const handleWidthChange = (width: ButtonWidth) => {
    const updatedProps = {
      ...localProps,
      width,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleTextAlignmentChange = (textAlignment: TextAlignment) => {
    const updatedProps = {
      ...localProps,
      textAlignment,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleContentAlignmentChange = (contentAlignment: ContentAlignment) => {
    const updatedProps = {
      ...localProps,
      contentAlignment,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handlePaddingChange = (
    type: "top" | "bottom" | "left" | "right",
    value: number
  ) => {
    const updatedProps = {
      ...localProps,
      padding: {
        ...localProps.padding,
        [type]: value,
      },
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  useEffect(() => {
    setLocalProps((prevProps) => ({
      ...prevProps,
      content: component.props.content || "",
    }));
  }, [component.props.content]);

  const renderTab = () => {
    switch (activeTab) {
      case "content":
        return (
          <ButtonContentTab
            localProps={localProps}
            handleChange={handleChange}
            handleTargetChange={handleTargetChange}
          />
        );
      case "styles":
        return (
          <ButtonStylesTab
            handleWidthChange={handleWidthChange}
            handleContentAlignmentChange={handleContentAlignmentChange}
            handlePaddingChange={handlePaddingChange}
            handleTextAlignmentChange={handleTextAlignmentChange}
            handleBorderColorChange={handleBorderColorChange}
            handleBorderWidthChange={handleBorderWidthChange}
            handleBorderStyleChange={handleBorderStyleChange}
            handleButtonColorChange={handleButtonColorChange}
            handleTextColorChange={handleTextColorChange}
            handleShapeChange={handleShapeChange}
            handleBackgroundColorChange={handleBackgroundColorChange}
            localProps={localProps}
          />
        );
    }
  };
  return (
    <div className="">
      <ButtonEditorTabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />
      {renderTab()}
      {/* {activeTab === "content" ? (
        <ButtonContentTab
          localProps={localProps}
          handleChange={handleChange}
          handleTargetChange={handleTargetChange}
        />
      ) : (
        <ButtonStylesTab
          handleResetDefault={handleResetDefault}
          handleWidthChange={handleWidthChange}
          handleContentAlignmentChange={handleContentAlignmentChange}
          handlePaddingChange={handlePaddingChange}
          handleTextAlignmentChange={handleTextAlignmentChange}
          handleBorderColorChange={handleBorderColorChange}
          handleBorderWidthChange={handleBorderWidthChange}
          handleBorderStyleChange={handleBorderStyleChange}
          handleButtonColorChange={handleButtonColorChange}
          handleTextColorChange={handleTextColorChange}
          handleShapeChange={handleShapeChange}
          handleBackgroundColorChange={handleBackgroundColorChange}
          localProps={localProps}
        />
      )} */}
    </div>
  );
};

export default ButtonEditor;
