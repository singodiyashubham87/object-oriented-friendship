import React from "react";
import ChatMessage from "./ChatMessage";

const MessageList = ({
  messages,
  hasMore,
  isLoading,
  onLoadMore,
  nextCursor,
  containerRef,
  endRef,
  onScroll,
  currentUser,
  chatId,
}) => {
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 py-3"
      onScroll={onScroll}
    >
      {hasMore && (
        <button
          type="button"
          className="text-xs text-primary-silver opacity-50 text-center py-2 hover:opacity-80"
          onClick={() => onLoadMore(chatId, nextCursor)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "↑ Load older messages"}
        </button>
      )}

      {messages.map((msg) => (
        <ChatMessage key={msg.id} msg={msg} currentUser={currentUser} />
      ))}

      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
