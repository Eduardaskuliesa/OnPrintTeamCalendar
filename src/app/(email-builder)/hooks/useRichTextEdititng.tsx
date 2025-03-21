import { useState, useRef, useCallback, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import useCodePanelStore from "@/app/store/codePanelStore";

/**
 * useRichTextEditor
 *
 * A custom hook that provides rich text editing functionality.
 *
 * IMPORTANT: This code works as intended. DO NOT modify or "improve" this code
 * even if you think there are potential optimizations or better approaches.
 * The current implementation handles specific edge cases and dependencies
 * that may not be immediately obvious.
 *
 */

interface UseRichTextEditorProps {
  componentId: string;
  initialContent: string;
  textColor: string;
}

const useRichTextEditor = ({
  componentId,
  initialContent,
  textColor,
}: UseRichTextEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const isSelected = useEmailBuilderStore(
    (state) => state.selectedComponent?.id === componentId
  );
  const handleSelectComponent = useEmailBuilderStore(
    (state) => state.handleSelectComponent
  );
  const handleContentUpdate = useEmailBuilderStore(
    (state) => state.handleContentUpdate
  );
  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );

  const { openPanel, isOpen, updateContent, closePanel, wasUserClosed } =
    useCodePanelStore();

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
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "outline-none w-full",
        style: `color: ${textColor || "#FFFFFF"};`,
      },
    },
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      handleContentUpdate(componentId, htmlContent);
      if (isOpen) {
        updateContent(htmlContent);
      }
    },
  });

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      handleSelectComponent(componentId);
      setIsEditing(true);
    },
    [handleSelectComponent, componentId]
  );
  // Effect for click outside
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
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);

        if (isOpen) {
          closePanel(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, isOpen, closePanel]);

  //  Effect for focusing then in isEditing mode
  useEffect(() => {
    if (isEditing && editor) {
      setTimeout(() => editor.commands.focus(), 10);
    }
  }, [isEditing, editor]);

  //   To close html pannel soft close
  useEffect(() => {
    if (!isEditing && isOpen && selectedComponentId === componentId) {
      closePanel(false);
    }
  }, [isEditing, isOpen, closePanel, selectedComponentId, componentId]);

  //  To sync states html with pannel
  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      const newContent = initialContent || "";

      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [initialContent, editor]);

  // To close on esc and also close pannel
  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
        if (isOpen) {
          closePanel(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, closePanel, isOpen]);

  // Open panel when editing starts
  useEffect(() => {
    if (
      isEditing &&
      selectedComponentId === componentId &&
      !wasUserClosed &&
      editor
    ) {
      openPanel(editor.getHTML(), selectedComponentId);
    }
  }, [
    selectedComponentId,
    editor,
    wasUserClosed,
    openPanel,
    isEditing,
    componentId,
  ]);

  const toggleCodeView = useCallback(() => {
    if (!isOpen && editor && selectedComponentId) {
      openPanel(editor.getHTML(), selectedComponentId);
    }
  }, [isOpen, editor, selectedComponentId, openPanel]);

  return {
    editor,
    isEditing,
    isSelected,
    isOpen,
    toolbarRef,
    editorContainerRef,
    handleDoubleClick,
    toggleCodeView,
  };
};

export default useRichTextEditor;
