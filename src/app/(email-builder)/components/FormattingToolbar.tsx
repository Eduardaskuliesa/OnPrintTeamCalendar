import React, { useCallback, useEffect } from "react";
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
import useToolbarStore from "@/app/store/toolbarStore";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import useCodePanelStore from "@/app/store/codePanelStore";

const FormattingToolbar = () => {
  const { editor, closeToolbar } = useToolbarStore();
  const { openPanel, isOpen } = useCodePanelStore();
  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );

  useEffect(() => {
    if (selectedComponentId === undefined) {
      closeToolbar();
    }
  }, [closeToolbar, selectedComponentId]);

  const toggleCodeView = useCallback(() => {
    if (!isOpen && editor && selectedComponentId) {
      openPanel(editor.getHTML(), selectedComponentId);
    }
  }, [isOpen, editor, selectedComponentId, openPanel]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className="flex gap-2 p-1 mb-1 bg-white rounded shadow-sm border border-gray-200"
      data-keep-component="true"
    >
      {/* Bold */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        title="Bold"
        type="button"
      >
        <BoldIcon size={16} />
      </button>

      {/* Italic */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        title="Italic"
        type="button"
      >
        <ItalicIcon size={16} />
      </button>

      {/* Underline */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-1 rounded ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
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
          editor.chain().focus().setTextAlign("left").run();
        }}
        className={`p-1 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
        title="Align Left"
        type="button"
      >
        <AlignLeftIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
        }}
        className={`p-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
        title="Align Center"
        type="button"
      >
        <AlignCenterIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
        }}
        className={`p-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
        title="Align Right"
        type="button"
      >
        <AlignRightIcon size={16} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign("justify").run();
        }}
        className={`p-1 rounded ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}`}
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
        className={`p-1 rounded ${isOpen ? "bg-gray-200" : ""}`}
        title="HTML Code View"
        type="button"
      >
        <CodeIcon size={16} />
      </button>
    </div>
  );
};

export default FormattingToolbar;
