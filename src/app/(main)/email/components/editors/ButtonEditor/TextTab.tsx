import React from "react";
import TipTap from "../TipTap/TipTap";

interface TextTapProps {
  handleContentChange: (content: string) => void;
  contentHtml: string;
}

const TextTab: React.FC<TextTapProps> = ({
  handleContentChange,
  contentHtml,
}) => {
  return (
    <div>
      Test
      <TipTap onChange={handleContentChange} contentHtml={contentHtml} />
    </div>
  );
};

export default TextTab;
