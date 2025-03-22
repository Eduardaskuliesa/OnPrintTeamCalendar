import { useRef, useCallback, useEffect } from "react";
import { Extension } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import useCodePanelStore from "@/app/store/codePanelStore";
import Color from "@tiptap/extension-color";
import useToolbarStore from "@/app/store/toolbarStore";

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

const InlineStyle = Extension.create({
  name: "inlineStyle",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {};
              }

              return {
                style: attributes.style,
              };
            },
          },
        },
      },
    ];
  },
});

// Keep your InlineStyle Extension as is

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
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Get state from email builder store
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

  // Get state from code panel store
  const { openPanel, isOpen, updateContent, closePanel, wasUserClosed } =
    useCodePanelStore();

  const { isEditing, setIsEditing, closeToolbar } = useToolbarStore();

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
      Color,
      InlineStyle,
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
      if (editor) {
        useToolbarStore.getState().openToolbar(componentId, "button", editor);
      }
    },
    [handleSelectComponent, componentId, editor]
  );

  useEffect(() => {}, []);

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
        !editorContainerRef.current.contains(event.target as Node)
      ) {
        closeToolbar();
        if (isOpen) {
          closePanel(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, isOpen, closePanel, setIsEditing, closeToolbar]);

  // Effect for focusing when in editing mode
  useEffect(() => {
    if (isEditing && editor) {
      setTimeout(() => editor.commands.focus(), 10);
    }
  }, [isEditing, editor]);

  // To close HTML panel on soft close
  useEffect(() => {
    if (!isEditing && isOpen && selectedComponentId === componentId) {
      closeToolbar();
      closePanel(false);
    }
  }, [
    isEditing,
    isOpen,
    closePanel,
    selectedComponentId,
    componentId,
    closeToolbar,
  ]);

  // To sync states HTML with panel
  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      const newContent = initialContent || "";

      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [initialContent, editor]);

  // To close on ESC and also close panel
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeToolbar();
        if (isOpen) {
          closePanel(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, closePanel, isOpen, closeToolbar]);

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

  return {
    editor,
    isEditing,
    isSelected,
    isOpen,
    editorContainerRef,
    handleDoubleClick,
  };
};

export default useRichTextEditor;
