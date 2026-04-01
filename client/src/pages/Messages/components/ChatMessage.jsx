import dayjs from "dayjs";
import React from "react";

const DICEBEAR_AVATAR_BASE_URL =
  "https://api.dicebear.com/6.x/initials/svg?seed=";

const TickStatus = ({ msg, currentUserId }) => {
  const isMine = msg.senderId === currentUserId;
  if (!isMine) return null;

  if (msg.readAt) {
    return (
      <span
        className="inline-flex items-center ml-1 text-[10px] text-[#ffffff99]"
        title="Seen"
      >
        ✓✓
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center ml-1 text-[10px] text-[#ffffff99]"
      title="Delivered"
    >
      ✓
    </span>
  );
};

const ChatMessage = ({ msg, currentUser }) => {
  const isMine = msg.senderId === currentUser.id;

  return (
    <div
      className={`flex gap-2 items-end max-w-[80%] ${
        isMine ? "self-end flex-row-reverse" : "self-start"
      }`}
      key={msg.id}
    >
      <img
        src={
          isMine
            ? currentUser.avatar ||
              `${DICEBEAR_AVATAR_BASE_URL}${encodeURIComponent(
                currentUser.firstName || "U",
              )}`
            : msg.senderAvatar ||
              `${DICEBEAR_AVATAR_BASE_URL}${encodeURIComponent(
                msg.senderFirstName || "U",
              )}`
        }
        alt="avatar"
        className="w-6 h-6 rounded-full border-xs border-primary-dark shrink-0 object-cover"
      />
      <div
        className={`px-3 py-1.5 rounded-custom-s ${
          isMine
            ? "bg-[#005C4B] rounded-br-none"
            : "bg-dark-glassmorphism-60 rounded-bl-none"
        }`}
      >
        <p className="text-sm text-primary-silver break-words">{msg.content}</p>
        <span className="text-[10px] text-primary-silver opacity-40 flex items-center justify-end gap-0.5 mt-0.5">
          {dayjs(msg.createdAt).format("h:mm A")}
          <TickStatus msg={msg} currentUserId={currentUser.id} />
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
