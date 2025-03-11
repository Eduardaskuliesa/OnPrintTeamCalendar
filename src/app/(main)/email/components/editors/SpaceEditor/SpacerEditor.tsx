import React, { useState, useEffect } from "react";
import { EmailSpacerProps } from "../../../emailComponents/Spacer";
import SpacerEditorTabs from "./SpacerEditorTabs";
import SpacerEditorStyles from "./SpacerEditorStyles";

interface SpacerComponent {
  id: string;
  type: string;
  props: EmailSpacerProps;
}

interface SpacerEditorProps {
  component: SpacerComponent;
  updateComponent: (id: string, updates: Partial<SpacerComponent>) => void;
}

const SpacerEditor: React.FC<SpacerEditorProps> = ({
  component,
  updateComponent,
}) => {
  const [activeTab, setActiveTab] = useState("styles");
  const [localProps, setLocalProps] = useState<EmailSpacerProps>({
    ...component.props,
    height: component.props.height || 20,
    containerBackgroundColor:
      component.props.containerBackgroundColor || "transparent",
  });

  useEffect(() => {
    setLocalProps({
      ...component.props,
      height: component.props.height || 20,
      containerBackgroundColor:
        component.props.containerBackgroundColor || "transparent",
    });
  }, [component.id, component.props]);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10) || 0;
    const updatedProps = {
      ...localProps,
      height,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  const handleBackgroundColorChange = (containerBackgroundColor: string) => {
    const updatedProps = {
      ...localProps,
      containerBackgroundColor,
    };

    setLocalProps(updatedProps);
    updateComponent(component.id, { props: updatedProps });
  };

  return (
    <div>
      <SpacerEditorTabs
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as "content" | "styles")}
      />
      {activeTab === "styles" && (
        <SpacerEditorStyles
          localProps={localProps}
          handleHeightChange={handleHeightChange}
          handleBackgroundColorChange={handleBackgroundColorChange}
        ></SpacerEditorStyles>
      )}
    </div>
  );
};

export default SpacerEditor;
