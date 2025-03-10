import React from 'react';

const EmailPreview = ({ emailHtml, viewMode }) => {
    return (

        <div className={`mx-auto transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
            }`}>
            <iframe
                srcDoc={emailHtml}
                className="w-full h-[600px] border-none bg-white"
                title="Email Template Preview"
            />
        </div>

    );
};

export default EmailPreview;