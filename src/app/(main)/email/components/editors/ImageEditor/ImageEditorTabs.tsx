import React from "react";
import { motion } from "framer-motion";

interface ImageEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ImageEditorTabs: React.FC<ImageEditorTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-row gap-4  mb-6 ">
      <div className="border-b relative">
        <button
          className={`py-2 px-4 font-medium relative z-10 text-lg ${activeTab === "content" ? "text-vdcoffe" : "text-gray-900"
            }`}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={`py-2 px-4 font-medium relative text-lg z-10 ${activeTab === "styles" ? "text-vdcoffe" : "text-gray-900"
            }`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <motion.div
          className="absolute bottom-0 h-0.5 bg-vdcoffe z-0"
          initial={false}
          animate={{
            left: activeTab === "content" ? "0%" : "50%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default ImageEditorTabs;
