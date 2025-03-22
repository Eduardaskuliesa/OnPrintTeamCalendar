import React from "react";
import Button, { EmailButtonProps } from "../emailComponents/Button";
import { EditorContent } from "@tiptap/react";
import useRichTextEditor from "@/app/(email-builder)/hooks/useRichTextEdititng";

interface EditableButtonProps {
  component: {
    id: string;
    props: EmailButtonProps;
  };
}

const RichTextWrapperButton: React.FC<EditableButtonProps> = ({
  component,
}) => {
  const fontWeightMap = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };

  const {
    editor,
    isEditing,
    isSelected,
    editorContainerRef,
    handleDoubleClick,
  } = useRichTextEditor({
    componentId: component.id,
    initialContent: component.props.content || "",
    textColor: component.props.textColor || "#FFFFFF",
  });

  const containerStyle = {
    display: "flex",
    justifyContent: component.props.contentAlignment || "center",
    backgroundColor: component.props.containerBackgroundColor || "transparent",
    borderRadius: component.props.containerBorderRadius
      ? `${component.props.containerBorderRadius}px`
      : undefined,
    paddingTop:
      component.props.padding?.top !== undefined
        ? `${component.props.padding.top}px`
        : "0",
    paddingBottom:
      component.props.padding?.bottom !== undefined
        ? `${component.props.padding.bottom}px`
        : "0",
    paddingLeft:
      component.props.padding?.left !== undefined
        ? `${component.props.padding.left}px`
        : "0",
    paddingRight:
      component.props.padding?.right !== undefined
        ? `${component.props.padding.right}px`
        : "0",
  } as React.CSSProperties;

  const buttonStyle = {
    display: "inline-block",
    backgroundColor: component.props.backgroundColor || "#3B82F6",
    color: component.props.textColor || "#FFFFFF",
    fontWeight: fontWeightMap[component.props.fontWeight || "medium"],
    fontSize: `${component.props.fontSize || 16}px`,
    padding: `${component.props.paddingY || 12}px ${component.props.paddingX || 24}px`,
    borderRadius: `${component.props.borderRadius || 0}px`,
    borderStyle:
      component.props.borderStyle !== "none"
        ? component.props.borderStyle
        : "none",
    borderWidth:
      component.props.borderStyle !== "none"
        ? `${component.props.borderWidth || 1}px`
        : 0,
    borderColor:
      component.props.borderStyle !== "none"
        ? component.props.borderColor || "transparent"
        : "transparent",
    textDecoration: "none",
    textAlign: component.props.textAlignment || "center",
    width: component.props.width || "25%",
    lineHeight: "100%",
    minWidth: "100px",
    cursor: isEditing ? "text" : "pointer",
    whiteSpace: "pre-wrap",
  } as React.CSSProperties;

  if (isEditing && isSelected) {
    return (
      <div className="relative" data-keep-component="true">
        <div style={containerStyle} ref={editorContainerRef}>
          <div style={buttonStyle} className="ring-2 ring-blue-300">
            <EditorContent
              editor={editor}
              style={{
                outline: "none",
                textAlign: component.props.textAlignment || "center",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} data-keep-component="true">
      <Button {...component.props} />
    </div>
  );
};

export default React.memo(RichTextWrapperButton);
