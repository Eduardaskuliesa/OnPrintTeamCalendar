import React from "react";
import { EditorContent } from "@tiptap/react";
import useRichTextEditor from "@/app/(email-builder)/hooks/useRichTextEdititng";
import EmailText, { EmailTextProps } from "../emailComponents/Text";

interface EditableEmailTextProps {
    component: {
        id: string;
        props: EmailTextProps;
    };
}

const RichTextWrapperText: React.FC<EditableEmailTextProps> = ({
    component,
}) => {
    console.log(component.props.content)
    const {
        editor,
        isEditing,
        isSelected,
        editorContainerRef,
        handleClick,
    } = useRichTextEditor({
        componentId: component.id,
        initialContent: component.props.content || "",
        textColor: component.props.textColor || "#000000",
        componentType: 'text'
    });

    const containerStyle = {
        display: "flex",
        justifyContent: component.props.contentAlignment || "center",
        backgroundColor: component.props.containerBackgroundColor || "transparent",
        borderRadius: component.props.containerBorderRadius
            ? `${component.props.containerBorderRadius}px`
            : undefined,
        borderStyle: component.props.borderStyle || undefined,
        borderColor: component.props.borderColor || undefined,
        borderWidth: component.props.borderWidth
            ? `${component.props.borderWidth}px`
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
        marginTop:
            component.props.margin?.top !== undefined
                ? `${component.props.margin.top}px`
                : "0",
        marginBottom:
            component.props.margin?.bottom !== undefined
                ? `${component.props.margin.bottom}px`
                : "0",
        marginLeft:
            component.props.margin?.left !== undefined
                ? `${component.props.margin.left}px`
                : "0",
        marginRight:
            component.props.margin?.right !== undefined
                ? `${component.props.margin.right}px`
                : "0",
        width: "100%",
    } as React.CSSProperties;

    const textStyle = {
        fontSize: component.props.textSize || "16px",
        color: component.props.textColor || "#000000",
        outline: "none",
        margin: 0,
        padding: 0,
    } as React.CSSProperties;

    if (isEditing && isSelected) {
        return (
            <div className="relative" data-keep-component="true">
                <div style={containerStyle} ref={editorContainerRef}>
                    <div style={{
                        lineHeight: '24px'
                    }} className="ring-2 ring-blue-300 w-full">
                        <EditorContent
                            editor={editor}
                            style={{
                                ...textStyle,
                                textAlign: component.props.textAlignment || "left",
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div onClick={handleClick} data-keep-component="true">
            <EmailText {...component.props} />
        </div>
    );
};

export default React.memo(RichTextWrapperText);