import React, { useState, useEffect } from "react";
import ImageEditorTabs from "./ImageEditorTabs";
import ImageStylesTab from "./ImageStylesTab";
import {
  BorderStyle,
  ContentAlignment,
  EmailImageProps,
  ImageWidth,
} from "../../../emailComponents/Image";
import ImageContentTab from "./ImageContnetTab";


interface ImageComponent {
  id: string;
  type: string;
  props: EmailImageProps;
}

interface ImageEditorProps {
  component: ImageComponent;
  updateComponent: (id: string, updates: Partial<ImageComponent>) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  component,
  updateComponent,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "styles">("content");
  const [localProps, setLocalProps] = useState<EmailImageProps>({
    ...component.props,
    target: component.props.target || "_blank",
    borderRadius: component.props.borderRadius || 0,
    borderStyle: component.props.borderStyle || "none",
    contentAlignment: component.props.contentAlignment || "center",
    width: component.props.width || "50%",
    padding: component.props.padding || {
      top: 5,
      bottom: 5,
      left: 0,
      right: 0,
    },
    objectFit: component.props.objectFit || "cover",
  });

  useEffect(() => {
    setLocalProps({
      ...component.props,
      target: component.props.target || "_blank",
      borderRadius: component.props.borderRadius || 0,
      borderStyle: component.props.borderStyle || "none",
      contentAlignment: component.props.contentAlignment || "center",
      width: component.props.width || "50%",
      padding: component.props.padding || {
        top: 5,
        bottom: 5,
        left: 0,
        right: 0,
      },
      objectFit: component.props.objectFit || "cover",
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
    borderStyle: BorderStyle
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

  const handleBackgroundColorChange = (containerBackgroundColor: string) => {
    const updateProps = {
      ...localProps,
      containerBackgroundColor,
    };
    setLocalProps(updateProps);
    updateComponent(component.id, { props: updateProps });
  };

  const handleWidthChange = (width: ImageWidth) => {
    console.log("Width change handler called with:", width);
    const updatedProps = {
      ...localProps,
      width,
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

  const handleObjectFitChange = (objectFit: "cover" | "contain" | "fill" | "none" | "scale-down") => {
    const updatedProps = {
      ...localProps,
      objectFit,
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


  return (
    <div className="">
      <ImageEditorTabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />

      {activeTab === "content" ? (
        <ImageContentTab
          handleWidthChange={handleWidthChange}
          handleObjectFitChange={handleObjectFitChange}
          localProps={localProps}
          handleChange={handleChange}
          handleTargetChange={handleTargetChange}
        />
      ) : (
        <ImageStylesTab
          handleBorderWidthChange={handleBorderWidthChange}
          handleBorderColorChange={handleBorderColorChange}
          handleBorderStyleChange={handleBorderStyleChange}
          handleBackgroundColorChange={handleBackgroundColorChange}
          handleShapeChange={handleShapeChange}
          localProps={localProps}
        />
      )}
    </div>
  );
};

export default ImageEditor;