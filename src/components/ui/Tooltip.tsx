import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-10 w-64 px-4 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;