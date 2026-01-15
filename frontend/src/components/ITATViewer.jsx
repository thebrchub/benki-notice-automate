import React from 'react';

const ITATViewer = () => {
  return (
    // REMOVED: "flex flex-col", "Header", "borders", "rounded-lg"
    // KEPT: Only the iframe, full size
    <iframe 
        id="itatFrame" 
        src="https://benkinotice-api.brchub.me/api/proxy/itat/judicial/tribunalorders"
        className="w-full h-full border-none" 
        title="ITAT Website Container"
    />
  );
};

export default ITATViewer;