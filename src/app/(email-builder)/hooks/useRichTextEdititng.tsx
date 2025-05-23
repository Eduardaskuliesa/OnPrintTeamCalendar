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
import FontSize from "tiptap-extension-font-size"
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family"
import Link from "@tiptap/extension-link";
import useToolbarStore, { ComponentType } from "@/app/store/toolbarStore";
import useConstantPanelStore from "@/app/store/constantPanelStore";

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
            default: "margin: 0;",
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


interface UseRichTextEditorProps {
  componentId: string;
  initialContent: string;
  textColor: string;
  componentType: ComponentType
}

const useRichTextEditor = ({
  componentId,
  initialContent,
  textColor,
  componentType
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

  const { openPanel, isOpen, updateContent, closePanel, wasUserClosed } =
    useCodePanelStore();
  const { openPanel: openConstantPanel, isOpen: isOpenConstantPanel, closePanel: closeConstantPanel, wasUserClosed: wasUserClosedConstant } =
    useConstantPanelStore();

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
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'text-blue-500 underline',
        },
      }),
      FontFamily,
      Color.configure(),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      InlineStyle,
      TextAlign.configure({
        types: ["paragraph", "heading"],
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      handleSelectComponent(componentId);
      if (editor) {
        useToolbarStore.getState().openToolbar(componentId, componentType, editor);
      }
    },
    [handleSelectComponent, componentId, editor, componentType]
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
  }, [isEditing, isOpen, closePanel, setIsEditing, closeToolbar, closeConstantPanel]);


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
        if (isOpenConstantPanel) {
          closeConstantPanel(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, isOpenConstantPanel, setIsEditing, closeToolbar, closeConstantPanel]);

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

  useEffect(() => {
    if (!isEditing && isOpenConstantPanel && selectedComponentId === componentId) {
      closeToolbar();
      closeConstantPanel(false);
    }
  }, [isEditing, isOpen, closePanel, selectedComponentId, componentId, closeToolbar, isOpenConstantPanel, closeConstantPanel]);

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
        if (isOpenConstantPanel) {
          closeConstantPanel()
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, closePanel, isOpen, closeToolbar, isOpenConstantPanel, closeConstantPanel]);

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

  useEffect(() => {
    console.log(wasUserClosedConstant)
    if (
      isEditing &&
      selectedComponentId === componentId &&
      !wasUserClosedConstant &&
      editor
    ) {
      openConstantPanel(editor.getHTML(), selectedComponentId);
    }
  }, [selectedComponentId, editor, isEditing, componentId, wasUserClosedConstant, openConstantPanel]);


  return {
    editor,
    isEditing,
    isSelected,
    isOpen,
    editorContainerRef,
    handleClick,
  };
};

export default useRichTextEditor;