import React from "react";

const DICEBEAR_AVATAR_BASE_URL =
  "https://api.dicebear.com/6.x/initials/svg?seed=";

const ChatSidebar = ({
  chats,
  selectedChat,
  setSelectedChat,
  onlineUsers,
  transitionStyle,
}) => {
  return (
    <div className="chatListSidebar w-1/3 flex flex-col gap-2 overflow-y-auto pr-1 bg-dark-glassmorphism-40 rounded-custom-s p-2 border border-primary-gray-30">
      {chats.map((chat) => {
        const isSelected = selectedChat?.id === chat.id;
        const isOnline = onlineUsers.includes(chat.otherUserId);

        return (
          <button
            type="button"
            className={`flex items-center p-3 gap-3 rounded-custom-s cursor-pointer w-full text-left ${
              isSelected
                ? "bg-primary-silver"
                : "bg-dark-glassmorphism-50 hover:bg-dark-glassmorphism-70"
            } ${transitionStyle}`}
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="relative shrink-0">
              <img
                src={
                  chat.otherUserAvatar ||
                  `${DICEBEAR_AVATAR_BASE_URL}${encodeURIComponent(
                    chat.otherUserFirstName || "U",
                  )}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border-xs border-primary-dark object-cover"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                  isSelected ? "border-primary-silver" : "border-dark"
                } ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
              />
            </div>

            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h6
                  className={`font-semibold text-sm truncate ${
                    isSelected ? "text-secondary-dark" : "text-primary-silver"
                  }`}
                >
                  {chat.otherUserFirstName || "User"}
                  {chat.otherUserLastName ? ` ${chat.otherUserLastName}` : ""}
                </h6>
                {chat.unreadCount > 0 && !isSelected && (
                  <span className="shrink-0 bg-primary-cyan text-primary-dark text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <span
                  className={`text-xs truncate opacity-70 ${
                    isSelected ? "text-secondary-dark" : "text-primary-silver"
                  }`}
                >
                  {chat.lastMessage}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatSidebar;
