import React, { useState, useEffect, useRef } from "react";
import Button, { EmailButtonProps } from "../emailComponents/Button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import {
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Code as CodeIcon,
} from "lucide-react";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import DraggableCodePanel from "@/app/(email-builder)/builder/new-template/components/CodePanel";

interface EditableButtonProps {
  component: {
    id: string;
    props: EmailButtonProps;
  };
}

const RichTextWrapperButton: React.FC<EditableButtonProps> = ({
  component,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  const isSelected = useEmailBuilderStore(
    (state) => state.selectedComponent?.id === component.id
  );
  const handleSelectComponent = useEmailBuilderStore(
    (state) => state.handleSelectComponent
  );
  const handleContentUpdate = useEmailBuilderStore(
    (state) => state.handleContentUpdate
  );

  const fontWeightMap = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
      }),
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: component.props.content || "",
    editorProps: {
      attributes: {
        class: "outline-none w-full",
        style: `color: ${component.props.textColor || "#FFFFFF"};`,
      },
    },
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      handleContentUpdate(component.id, htmlContent);

      // Update the HTML code view if it's open
      if (showHtmlCode) {
        setHtmlCode(htmlContent);
      }
    },
  });

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element) {
        const keepElement = event.target.closest(
          '[data-keep-component="true"]'
        );
        if (keepElement) return;
      }

      if (
        editorContainerRef.current &&
        !editorContainerRef.current.contains(event.target as Node) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        (codeEditorRef.current === null || !codeEditorRef.current.contains(event.target as Node))
      ) {
        setIsEditing(false);
        setShowHtmlCode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && editor && !showHtmlCode) {
      setTimeout(() => editor.commands.focus(), 10);
    }
  }, [isEditing, editor, showHtmlCode]);

  useEffect(() => {
    if (editor && !isEditing) {
      editor.commands.setContent(component.props.content || "");
    }
  }, [component.props.content, editor, isEditing]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleSelectComponent(component.id);
    setIsEditing(true);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
        setShowHtmlCode(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);

  const toggleCodeView = () => {
    if (!showHtmlCode && editor) {
      setHtmlCode(editor.getHTML());
    }
    setShowHtmlCode(!showHtmlCode);
  };

  const applyHtmlChanges = (newHtml: string) => {
    if (editor) {
      try {
        editor.commands.setContent(newHtml);
        handleContentUpdate(component.id, newHtml);
      } catch (error) {
        console.error("Error setting content:", error);
        editor.commands.setContent(component.props.content || "");
      }
    }
  };



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

  const FormattingToolbar = () => (
    <div
      ref={toolbarRef}
      className="flex gap-2 p-1 mb-1 bg-white rounded shadow-sm border border-gray-200"
      data-keep-component="true"
    >
      {/* Bold */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleBold().run();
        }}
        className={`p-1 rounded ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
        title="Bold"
        type="button"
      >
        <BoldIcon size={16} />
      </button>

      {/* Italic */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleItalic().run();
        }}
        className={`p-1 rounded ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
        title="Italic"
        type="button"
      >
        <ItalicIcon size={16} />
      </button>

      {/* Underline */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().toggleUnderline().run();
        }}
        className={`p-1 rounded ${editor?.isActive("underline") ? "bg-gray-200" : ""}`}
        title="Underline"
        type="button"
      >
        <UnderlineIcon size={16} />
      </button>

      <div className="border-l border-gray-300 mx-1"></div>

      {/* Text Alignment */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('left').run();
        }}
        className={`p-1 rounded ${editor?.isActive({ textAlign: 'left' }) ? "bg-gray-200" : ""}`}
        title="Align Left"
        type="button"
      >
        <AlignLeftIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('center').run();
        }}
        className={`p-1 rounded ${editor?.isActive({ textAlign: 'center' }) ? "bg-gray-200" : ""}`}
        title="Align Center"
        type="button"
      >
        <AlignCenterIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('right').run();
        }}
        className={`p-1 rounded ${editor?.isActive({ textAlign: 'right' }) ? "bg-gray-200" : ""}`}
        title="Align Right"
        type="button"
      >
        <AlignRightIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor?.chain().focus().setTextAlign('justify').run();
        }}
        className={`p-1 rounded ${editor?.isActive({ textAlign: 'justify' }) ? "bg-gray-200" : ""}`}
        title="Justify"
        type="button"
      >
        <AlignJustifyIcon size={16} />
      </button>

      <div className="border-l border-gray-300 mx-1"></div>

      {/* HTML Code View */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleCodeView();
        }}
        className={`p-1 rounded ${showHtmlCode ? "bg-gray-200" : ""}`}
        title="HTML Code View"
        type="button"
      >
        <CodeIcon size={16} />
      </button>
    </div>
  );



  if (isEditing && isSelected) {
    return (
      <div className="relative" data-keep-component="true">
        <div className="-top-10 left-0 z-[100] w-auto">
          <FormattingToolbar />
        </div>
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
        {showHtmlCode && (
          <DraggableCodePanel
            initialContent={htmlCode}
            onContentChange={applyHtmlChanges}
            onClose={() => setShowHtmlCode(false)}
            initialPosition={{ x: 100, y: 100 }}
          />
        )}
      </div>
    );
  }

  // Regular button when not editing
  return (
    <div className="text-center" onDoubleClick={handleDoubleClick} data-keep-component="true">
      <Button {...component.props} />
    </div>
  );
};

export default React.memo(RichTextWrapperButton);