import React, { useState, useEffect } from "react";
import ImageEditorTabs from "./ImageEditorTabs";
import ImageContnetTab from "./ImageContnetTab";
import ImageStylesTab from "./ImageStylesTab";
import { EmailImageProps } from "../../../emailComponents/Image";

interface ButtonComponent {
  id: string;
  type: string;
  props: EmailImageProps;
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
  const [localProps, setLocalProps] = useState<EmailImageProps>({
    ...component.props,
    target: component.props.target || "_blank",
    borderRadius: component.props.borderRadius || 0,
    borderStyle: component.props.borderStyle || "none",
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
      borderRadius: component.props.borderRadius || 0,
      borderStyle: component.props.borderStyle || "none",
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

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedProps = {
      ...localProps,
      [name]: value,
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
        <ImageContnetTab
          localProps={localProps}
          handleChange={handleChange}
          handleAltChange={handleAltChange}
          handleTargetChange={handleTargetChange}
        />
      ) : (
        <ImageStylesTab
        />
      )}
    </div>
  );
};

export default ButtonEditor;
