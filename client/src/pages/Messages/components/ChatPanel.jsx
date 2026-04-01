import React from "react";

const ChatPanel = ({ children }) => {
  return (
    <div className="messageContent w-2/3 flex flex-col justify-between rounded-custom-s overflow-hidden bg-dark-glassmorphism-40 border border-primary-gray-30">
      {children}
    </div>
  );
};

export default ChatPanel;
