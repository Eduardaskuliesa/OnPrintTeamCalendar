import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./MenuBar";

const TipTap = ({ onChange, contentHtml }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: contentHtml,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const htmlContent = editor.getHTML();
        console.log("Editor HTML:", htmlContent);
        onChange(htmlContent);
      }
    },
  });
  return (
    <>
      {/* <EditorProvider
        extensions={[
          StarterKit.configure({
            heading: {
              levels: [1, 2],
            },
          }),
        ]}
        onUpdate={({ editor }) => {
          if (onChange) {
            const htmlContent = editor.getText();
            console.log("Editor HTML:", htmlContent);
            onChange(htmlContent);
          }
        }}
      ></EditorProvider> */}

      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default TipTap;
