import { SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

const MessageInput = ({ value, onChange, onSend }) => {
  return (
    <div className="flex items-stretch gap-2 px-4 py-3 bg-dark-glassmorphism-50 rounded-b-custom-s shrink-0">
      <input
        type="text"
        name="message"
        placeholder="Type a message..."
        className="w-full pr-2 pl-4 py-2 rounded-custom-s outline-none bg-dark-glassmorphism-30 border border-primary-gray text-primary-silver text-sm focus:border-primary-cyan transition-colors"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        type="button"
        className="p-2 px-3 rounded-custom-s border-2 border-secondary-silver flex items-center cursor-pointer bg-secondary-silver hover:bg-primary-cyan hover:border-primary-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSend}
        disabled={!value.trim()}
      >
        <HugeiconsIcon icon={SentIcon} className="w-4 h-4 text-primary-dark" />
      </button>
    </div>
  );
};

export default MessageInput;
