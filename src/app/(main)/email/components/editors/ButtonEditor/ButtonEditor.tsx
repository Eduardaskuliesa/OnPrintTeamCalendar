import React, { useState } from "react";
import ButtonEditorTabs from "./ButtonEditorTabs";
import ButtonContentTab from "./ButtonContentTab";
import ButtonStylesTab from "./ButtonStylesTab";

interface ButtonProps {
  text?: string;
  url?: string;
  target?: string;
  backgroundColor?: string;
  textColor?: string;
  [key: string]: any;
}

interface ButtonComponent {
  id: string;
  type: string;
  props: ButtonProps;
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
  const [localProps, setLocalProps] = useState<ButtonProps>({
    ...component.props,
    target: component.props.target || "_blank",
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

  const handleTargetChange = (value: string) => {
    const updatedProps = {
      ...localProps,
      target: value,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
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
        <ButtonStylesTab localProps={localProps} handleChange={handleChange} />
      )}
    </div>
  );
};

export default ButtonEditor;
