import React from "react";
import { FaDesktop } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";

const ViewModeToggle = ({ viewMode, setViewMode }: any) => {
  return (
    <div className="flex space-x-2 mb-2 justify-center">
      <div
        onClick={() => setViewMode("desktop")}
        className={`p-3 bg-gray-200 rounded-md hover:bg-gray-300 hover:cursor-pointer ${viewMode === "desktop" && "bg-gray-300"}`}
      >
        <FaDesktop className="w-4 h-4"></FaDesktop>
      </div>
      <div
        onClick={() => setViewMode("mobile")}
        className= {`p-3 bg-gray-200 hover:bg-gray-300 rounded-md hover:cursor-pointer ${viewMode === "mobile" && "bg-gray-300"}`} 
      >
        <FaMobileAlt className="w-4 h-4"></FaMobileAlt>
      </div>
    </div>
  );
};

export default ViewModeToggle;
