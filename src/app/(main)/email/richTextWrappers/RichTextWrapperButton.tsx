import React, { useState, useEffect, useRef } from "react";
import Button, { EmailButtonProps } from "../emailComponents/Button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon } from "lucide-react";

interface EditableButtonProps {
    component: {
        id: string;
        props: EmailButtonProps;
    };
    isSelected: boolean;
    onContentUpdate: (id: string, content: string) => void;
}

const RichTextWrapperButton: React.FC<EditableButtonProps> = ({
    component,
    isSelected,
    onContentUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    // Font weight mapping
    const fontWeightMap = {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    };

    // Initialize TipTap editor with formatting extensions
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                codeBlock: false,
            }),
            Bold,
            Italic,
        ],
        content: component.props.content || "",
        editorProps: {
            attributes: {
                class: "outline-none w-full",
                style: `color: ${component.props.textColor || "#FFFFFF"};`,
            },
        },
        onUpdate: ({ editor }) => {
            // Save content immediately when it changes
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = editor.getHTML();
            const plainText = tempDiv.textContent || '';

            // Update content in real-time
            onContentUpdate(component.id, plainText);
        }
    });

    // Handle clicks outside the editor to close it
    useEffect(() => {
        if (!isEditing) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                editorContainerRef.current &&
                !editorContainerRef.current.contains(event.target as Node) &&
                toolbarRef.current &&
                !toolbarRef.current.contains(event.target as Node)
            ) {
                setIsEditing(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    // Focus editor when entering edit mode
    useEffect(() => {
        if (isEditing && editor) {
            setTimeout(() => editor.commands.focus(), 10);
        }
    }, [isEditing, editor]);

    // Update editor content when component props change
    useEffect(() => {
        if (editor && !isEditing) {
            editor.commands.setContent(component.props.content || "");
        }
    }, [component.props.content, editor, isEditing]);

    // Handle double-click to enter edit mode
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSelected) {
            setIsEditing(true);
        }
    };

    // Create style objects for the button
    const containerStyle = {
        display: "flex",
        justifyContent: component.props.contentAlignment || "center",
        backgroundColor: component.props.containerBackgroundColor || "transparent",
        borderRadius: component.props.containerBorderRadius
            ? `${component.props.containerBorderRadius}px`
            : undefined,
        paddingTop: component.props.padding?.top !== undefined ? `${component.props.padding.top}px` : "0",
        paddingBottom: component.props.padding?.bottom !== undefined ? `${component.props.padding.bottom}px` : "0",
        paddingLeft: component.props.padding?.left !== undefined ? `${component.props.padding.left}px` : "0",
        paddingRight: component.props.padding?.right !== undefined ? `${component.props.padding.right}px` : "0",
    } as React.CSSProperties;

    const buttonStyle = {
        display: "inline-block",
        backgroundColor: component.props.backgroundColor || "#3B82F6",
        color: component.props.textColor || "#FFFFFF",
        fontWeight: fontWeightMap[component.props.fontWeight || "medium"],
        fontSize: `${component.props.fontSize || 16}px`,
        padding: `${component.props.paddingY || 12}px ${component.props.paddingX || 24}px`,
        borderRadius: `${component.props.borderRadius || 0}px`,
        borderStyle: component.props.borderStyle !== "none" ? component.props.borderStyle : "none",
        borderWidth: component.props.borderStyle !== "none" ? `${component.props.borderWidth || 1}px` : 0,
        borderColor: component.props.borderStyle !== "none" ? component.props.borderColor || "transparent" : "transparent",
        textDecoration: "none",
        textAlign: component.props.textAlignment || "center",
        width: component.props.width || "25%",
        lineHeight: "100%",
        minWidth: "100px",
        cursor: isEditing ? "text" : "pointer",
    } as React.CSSProperties;

    // Handle toolbar button clicks
    const handleFormatClick = (formatFunction: () => void) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        formatFunction();
        // Re-focus the editor after format change
        setTimeout(() => editor?.commands.focus(), 10);
    };

    // Simple formatting toolbar component
    const FormattingToolbar = () => (
        <div
            ref={toolbarRef}
            className="flex gap-2 p-1 mb-1 bg-white rounded shadow-sm border border-gray-200"
        >
            <button
                onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    editor?.chain().focus().toggleBold().run();
                }}
                className={`p-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                title="Bold"
                type="button"
            >
                <BoldIcon size={16} />
            </button>
            <button
                onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    editor?.chain().focus().toggleItalic().run();
                }}
                className={`p-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                title="Italic"
                type="button"
            >
                <ItalicIcon size={16} />
            </button>
            <button
                onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    editor?.chain().focus().toggleStrike().run();
                }}
                className={`p-1 rounded ${editor?.isActive('strike') ? 'bg-gray-200' : ''}`}
                title="Strikethrough"
                type="button"
            >
                <UnderlineIcon size={16} />
            </button>
            <div className="border-l border-gray-300 mx-1"></div>
        </div>
    );

    // If editing, render a custom button with TipTap editor and formatting toolbar
    if (isEditing && isSelected && editor) {
        return (
            <div className="relative">
                <div className="-top-10 left-0 z-[100] w-auto">
                    <FormattingToolbar />
                </div>
                <div style={containerStyle} ref={editorContainerRef}>
                    <div
                        style={buttonStyle}
                        className="ring-2 ring-blue-300"
                    >
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

    // Regular button when not editing
    return (
        <div onDoubleClick={handleDoubleClick}>
            <Button {...component.props} />
        </div>
    );
};

export default RichTextWrapperButton;