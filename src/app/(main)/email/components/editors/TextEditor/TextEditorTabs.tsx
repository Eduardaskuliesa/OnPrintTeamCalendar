import { motion } from "framer-motion";
import React from "react";

interface TextEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TextEditorTab: React.FC<TextEditorTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-row gap-4  mb-6 ">
      <div className="border-b relative">
        <button
          className={`py-2 px-4 font-medium relative text-lg z-10 ${
            activeTab === "styles" ? "text-vdcoffe" : "text-gray-900"
          }`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <motion.div
          className="absolute bottom-0 h-0.5 bg-vdcoffe z-0"
          initial={false}
          animate={{
            left: activeTab === "content" ? "0%" : "0%",
            width: "100%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default TextEditorTab;
