import React, { useState, useEffect } from "react";
import HeaderEditorTab from "./HeaderEditorTab";
import HeaderContentTab from "./HeaderContentTab";
import HeaderStylesTab from "./HeaderStylesTab";
import {
  BorderStyle,
  EmailHeadingProps,
} from "../../../emailComponents/Header";

interface HeaderComponent {
  id: string;
  type: string;
  props: EmailHeadingProps;
}

interface HeaderEditorProps {
  component: HeaderComponent;
  updateComponent: (id: string, updates: Partial<HeaderComponent>) => void;
}

const HeaderEditor: React.FC<HeaderEditorProps> = ({
  component,
  updateComponent,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "styles">("styles");
  const [localProps, setLocalProps] = useState<EmailHeadingProps>({
    ...component.props,
    borderStyle: component.props.borderStyle || "none",
    contentAlignment: component.props.contentAlignment || "center",
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
      textAlignment: component.props.textAlignment || "center",
      contentAlignment: component.props.contentAlignment || "flex-start",
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

  return (
    <div className="">
      <HeaderEditorTab
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />

      {activeTab === "content" ? (
        <HeaderContentTab />
      ) : (
        <HeaderStylesTab
          localProps={localProps}
          handlePaddingChange={handlePaddingChange}
          handleMarginChange={handleMarginChange}
          handleBackgroundColor={handleBackgroundColor}
          handleBorderWidth={handleBorderWidth}
          handleBorderStyle={handleBorderStyle}
          handleBorderColor={handleBorderColor}
          handleBorderRadius={handleBorderRadius}
        />
      )}
    </div>
  );
};

export default HeaderEditor;
