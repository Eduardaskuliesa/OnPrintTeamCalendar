import React, { useState, useEffect } from "react";
import {
  BorderStyle,
  EmailHeadingProps,
} from "../../../emailComponents/Header";
import TextEditorTab from "./TextEditorTabs";
import TextStylesTab from "./TextEditorStyles";

interface EmailTextComponent {
  id: string;
  type: string;
  props: EmailHeadingProps;
}

interface TextEditorProps {
  component: EmailTextComponent;
  updateComponent: (id: string, updates: Partial<EmailTextComponent>) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  component,
  updateComponent,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "styles">("styles");
  const [localProps, setLocalProps] = useState<EmailHeadingProps>({
    ...component.props,
    borderStyle: component.props.borderStyle || "none",
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
      containerBorderRadius: component.props.containerBorderRadius || 0,
      borderStyle: component.props.borderStyle || "none",
      padding: component.props.padding || {
        top: 5,
        bottom: 5,
        left: 0,
        right: 0,
      },
    });
  }, [component.id, component.props]);

  const handleBorderRadius = (containerBorderRadius: number) => {
    const updatedProps = {
      ...localProps,
      containerBorderRadius,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBorderWidth = (borderWidth: number) => {
    const updatedProps = {
      ...localProps,
      borderWidth,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBorderColor = (borderColor: string) => {
    const updateProps = {
      ...localProps,
      borderColor,
    };
    setLocalProps(updateProps);
    updateComponent(component.id, { props: updateProps });
  };

  const handleBorderStyle = (borderStyle: BorderStyle) => {
    const updatedProps = {
      ...localProps,
      borderStyle,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBackgroundColor = (containerBackgroundColor: string) => {
    const updatedProps = {
      ...localProps,
      containerBackgroundColor,
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

  const handleMarginChange = (
    type: "top" | "bottom" | "left" | "right",
    value: number
  ) => {
    const updatedProps = {
      ...localProps,
      margin: {
        ...localProps.margin,
        [type]: value,
      },
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handlePaddingChangeAll = (value: number) => {
    const updatedProps = {
      ...localProps,
      padding: {
        ...localProps.padding,
        top: value,
        bottom: value,
        left: value,
        right: value,
      },
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleMarginChangeAll = (value: number) => {
    const updatedProps = {
      ...localProps,
      margin: {
        ...localProps.margin,
        top: value,
        bottom: value,
        left: value,
        right: value,
      },
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };
  return (
    <div className="">
      <TextEditorTab
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />

      <TextStylesTab
        localProps={localProps}
        handleMarginChangeAll={handleMarginChangeAll}
        handlePaddingChangeAll={handlePaddingChangeAll}
        handlePaddingChange={handlePaddingChange}
        handleMarginChange={handleMarginChange}
        handleBackgroundColor={handleBackgroundColor}
        handleBorderWidth={handleBorderWidth}
        handleBorderStyle={handleBorderStyle}
        handleBorderColor={handleBorderColor}
        handleBorderRadius={handleBorderRadius}
      />
    </div>
  );
};

export default TextEditor;
