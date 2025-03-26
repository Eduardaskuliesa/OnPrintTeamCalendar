import React from "react";

const EmailPreview = ({ emailHtml, viewMode }) => {
  return (
    <div
      className={`mx-auto transition-all duration-300 p-0 box-content max-w-2xl flex flex-col overflow-hidden ${
        viewMode === "mobile" ? "max-w-[375px]" : "max-w-2xl"
      }`}
    >
      <iframe
        srcDoc={emailHtml}
        className="w-full h-[600px] border-none box-content max-w-2xl flex flex-col overflow-hidden bg-white"
        title="Email Template Preview"
      />
    </div>
  );
};

export default EmailPreview;
