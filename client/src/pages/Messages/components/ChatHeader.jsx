import React from "react";

const DICEBEAR_AVATAR_BASE_URL =
  "https://api.dicebear.com/6.x/initials/svg?seed=";

const ChatHeader = ({ chat, onlineUsers, typingUser }) => {
  if (!chat) return null;

  const isOnline = onlineUsers.includes(chat.otherUserId);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-dark-glassmorphism-50 rounded-t-custom-s shrink-0">
      <div className="relative">
        <img
          src={
            chat.otherUserAvatar ||
            `${DICEBEAR_AVATAR_BASE_URL}${encodeURIComponent(
              chat.otherUserFirstName || "U",
            )}`
          }
          alt="avatar"
          className="w-8 h-8 rounded-full border-xs border-primary-dark object-cover"
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </div>
      <div>
        <h6 className="text-primary-silver font-semibold text-sm">
          {chat.otherUserFirstName || "User"} {chat.otherUserLastName || ""}
        </h6>
        <span className="text-xs text-primary-silver opacity-60">
          {typingUser ? (
            <span className="text-primary-cyan italic">typing...</span>
          ) : isOnline ? (
            "Online"
          ) : (
            "Offline"
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
