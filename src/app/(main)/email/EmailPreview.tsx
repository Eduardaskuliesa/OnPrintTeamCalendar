import React from "react";

const EmailPreview = ({ emailHtml, viewMode }: any) => {
  return (
    <div
      className={`mx-auto transition-all duration-300 p-0  max-w-2xl flex flex-col overflow-visible  ${
        viewMode === "mobile" ? "max-w-[375px]" : "max-w-2xl"
      }`}
    >
      <iframe
        srcDoc={emailHtml}
        className="w-full h-[600px]  border-none  max-w-2xl flex flex-col overflow-visible  bg-white"
        title="Email Template Preview"
      />
    </div>
  );
};

export default EmailPreview;
