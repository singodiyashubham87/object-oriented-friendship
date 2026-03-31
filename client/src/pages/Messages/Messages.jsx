import { useSocket } from "@/context/SocketContext";
import { chatAPI } from "@/services/api";
import { Message01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { get } from "lodash-es";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

dayjs.extend(relativeTime);

const Messages = () => {
  const location = useLocation();
  const { socket, onlineUsers } = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const transitionStyle = "ease-in-out transition-all duration-300";

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoadingChats(true);
    try {
      const res = await chatAPI.getAllChats();
      const chatList = get(res, "data.data.chats", []);
      setChats(chatList);

      // Auto-select chat if navigated from Friends page
      const selectedFriendId = location.state?.selectedFriendId;
      if (selectedFriendId) {
        const existingChat = chatList.find(
          (c) => c.otherUserId === selectedFriendId,
        );
        if (existingChat) {
          setSelectedChat(existingChat);
        } else {
          // Create a new chat
          try {
            const chatRes = await chatAPI.createChat(selectedFriendId);
            const newChat = get(chatRes, "data.data.chat", null);
            if (newChat) {
              await fetchChats(); // Refresh to get full chat data with user info
            }
          } catch {
            // Chat creation might fail if not friends
          }
        }
      }
    } catch {
      // Failed to fetch chats
    } finally {
      setIsLoadingChats(false);
    }
  };

  // ── Fetch messages for selected chat ──
  const fetchMessages = useCallback(async (chatId, cursor = null) => {
    setIsLoadingMessages(true);
    try {
      const url = cursor
        ? `/message/${chatId}?cursor=${cursor}`
        : `/message/${chatId}`;
      const res = await chatAPI.getMessages(chatId, cursor);
      const data = get(res, "data.data", {});

      if (cursor) {
        // Prepend older messages
        setMessages((prev) => [...(data.messages || []), ...prev]);
      } else {
        setMessages(data.messages || []);
      }
      setNextCursor(data.nextCursor || null);
      setHasMore(data.hasMore || false);
    } catch {
      // Failed to fetch messages
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // ── When a chat is selected ──
  useEffect(() => {
    if (!selectedChat || !socket) return;

    // Leave previous rooms and join new one
    socket.emit("join-chat", selectedChat.id);
    fetchMessages(selectedChat.id);

    return () => {
      socket.emit("leave-chat", selectedChat.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, socket, fetchMessages]);

  // ── Scroll to bottom on new messages ──
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // ── Socket event listeners ──
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Add to current messages if viewing this chat
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();

      // Update chat list sidebar
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
                unreadCount:
                  message.senderId !== currentUser.id &&
                  message.chatId !== selectedChat?.id
                    ? (chat.unreadCount || 0) + 1
                    : chat.unreadCount,
              }
            : chat,
        ),
      );
    };

    const handleTyping = ({ userId, chatId }) => {
      if (selectedChat && chatId === selectedChat.id) {
        setTypingUser(userId);
      }
    };

    const handleStopTyping = ({ chatId }) => {
      if (selectedChat && chatId === selectedChat.id) {
        setTypingUser(null);
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedChat, currentUser.id, scrollToBottom]);

  // ── Send message ──
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !socket) return;

    socket.emit("send-message", {
      chatId: selectedChat.id,
      content: messageInput.trim(),
      contentType: "text",
    });

    setMessageInput("");

    // Stop typing
    socket.emit("stop-typing", { chatId: selectedChat.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  // ── Handle typing ──
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!socket || !selectedChat) return;

    socket.emit("typing", { chatId: selectedChat.id });

    // Auto stop-typing after 2 seconds of no input
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId: selectedChat.id });
    }, 2000);
  };

  // ── Load more messages (scroll up) ──
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || isLoadingMessages) return;

    if (container.scrollTop === 0) {
      fetchMessages(selectedChat.id, nextCursor);
    }
  };

  // ── No chats state ──
  if (!isLoadingChats && chats.length === 0) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl text-center w-1/2">
          No conversations yet. Send a message to a friend to start chatting!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-between items-center gap-4 w-full h-full bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-hidden px-4 py-4 md:px-6 md:py-6">
      {/* Header */}
      <div className="flex justify-center shrink-0">
        <h2 className="text-2xl md:text-4xl text-primary-silver font-bold uppercase">
          Messages
        </h2>
      </div>

      {/* Main content */}
      <div className="w-full flex-1 flex justify-between items-stretch gap-3 md:gap-4 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="chatListSidebar w-1/3 flex flex-col gap-2 overflow-y-auto pr-1">
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
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <img
                    src={
                      chat.otherUserAvatar ||
                      `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(chat.otherUserFirstName || "U")}`
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

                {/* Name and last message */}
                <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h6
                      className={`font-semibold text-sm truncate ${
                        isSelected
                          ? "text-secondary-dark"
                          : "text-primary-silver"
                      }`}
                    >
                      {chat.otherUserFirstName || "User"}
                      {chat.otherUserLastName
                        ? ` ${chat.otherUserLastName}`
                        : ""}
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
                        isSelected
                          ? "text-secondary-dark"
                          : "text-primary-silver"
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

        {/* Message Panel */}
        <div className="messageContent w-2/3 flex flex-col justify-between rounded-custom-s overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-2 bg-dark-glassmorphism-50 rounded-t-custom-s shrink-0">
                <div className="relative">
                  <img
                    src={
                      selectedChat.otherUserAvatar ||
                      `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(selectedChat.otherUserFirstName || "U")}`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-xs border-primary-dark object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark ${
                      onlineUsers.includes(selectedChat.otherUserId)
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <h6 className="text-primary-silver font-semibold text-sm">
                    {selectedChat.otherUserFirstName || "User"}{" "}
                    {selectedChat.otherUserLastName || ""}
                  </h6>
                  <span className="text-xs text-primary-silver opacity-60">
                    {onlineUsers.includes(selectedChat.otherUserId)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>

              {/* Messages area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 py-3"
                onScroll={handleScroll}
              >
                {/* Load more indicator */}
                {hasMore && (
                  <button
                    type="button"
                    className="text-xs text-primary-silver opacity-50 text-center py-2 hover:opacity-80"
                    onClick={() => fetchMessages(selectedChat.id, nextCursor)}
                    disabled={isLoadingMessages}
                  >
                    {isLoadingMessages ? "Loading..." : "↑ Load older messages"}
                  </button>
                )}

                {messages.map((msg) => {
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
                              `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(currentUser.firstName || "U")}`
                            : msg.senderAvatar ||
                              `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(msg.senderFirstName || "U")}`
                        }
                        alt="avatar"
                        className="w-6 h-6 rounded-full border-xs border-primary-dark shrink-0 object-cover"
                      />
                      <div
                        className={`px-3 py-1.5 rounded-custom-s ${
                          isMine
                            ? "bg-dark-cyan-70 rounded-br-none"
                            : "bg-secondary-silver-70 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm text-primary-silver break-words">
                          {msg.content}
                        </p>
                        <span className="text-[10px] text-primary-silver opacity-40 block text-right mt-0.5">
                          {dayjs(msg.createdAt).format("h:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingUser && (
                  <div className="self-start text-xs text-primary-silver opacity-60 italic px-2 py-1">
                    {selectedChat.otherUserFirstName || "User"} is typing...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="flex items-stretch gap-2 px-4 py-3 bg-dark-glassmorphism-50 rounded-b-custom-s shrink-0">
                <input
                  type="text"
                  name="message"
                  placeholder="Type a message..."
                  className="w-full pr-2 pl-4 py-2 rounded-custom-s outline-none bg-dark-glassmorphism-30 border border-primary-gray text-primary-silver text-sm focus:border-primary-cyan transition-colors"
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  className="p-2 px-3 rounded-custom-s border-2 border-secondary-silver flex items-center cursor-pointer bg-secondary-silver hover:bg-primary-cyan hover:border-primary-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <HugeiconsIcon
                    icon={SentIcon}
                    className="w-4 h-4 text-primary-dark"
                  />
                </button>
              </div>
            </>
          ) : (
            // No chat selected
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <HugeiconsIcon
                icon={Message01Icon}
                className="w-16 h-16 text-primary-silver opacity-20"
              />
              <p className="text-primary-silver opacity-40 text-center text-sm">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
