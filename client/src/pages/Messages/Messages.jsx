import { useSocket } from "@/context/SocketContext";
import { chatAPI } from "@/services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { get } from "lodash-es";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import ChatHeader from "./components/ChatHeader";
import ChatPanel from "./components/ChatPanel";
import ChatSidebar from "./components/ChatSidebar";
import EmptyChat from "./components/EmptyChat";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";

dayjs.extend(relativeTime);

const Messages = () => {
  const location = useLocation();
  const { socket, onlineUsers, clearUnread } = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    clearUnread();
  }, [clearUnread]);

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

      const selectedFriendId = location.state?.selectedFriendId;
      if (selectedFriendId) {
        const existingChat = chatList.find(
          (c) => c.otherUserId === selectedFriendId,
        );

        if (existingChat) {
          setSelectedChat(existingChat);
        } else {
          try {
            const chatRes = await chatAPI.createChat(selectedFriendId);
            const newChat = get(chatRes, "data.data.chat", null);
            if (newChat) {
              await fetchChats();
            }
          } catch {
            // Chat creation might fail
          }
        }
      } else if (chatList.length > 0) {
        setSelectedChat(chatList[0]);
      }
    } catch {
      // Failed to fetch chats
    } finally {
      setIsLoadingChats(false);
    }
  };

  const markMessagesAsRead = useCallback(
    (msgs, chatId) => {
      if (!socket) return;
      const unreadFromOther = msgs.filter(
        (m) => m.senderId !== currentUser.id && !m.readAt,
      );
      for (const msg of unreadFromOther) {
        socket.emit("message-read", { messageId: msg.id, chatId });
      }
    },
    [socket, currentUser.id],
  );

  const SCROLL_DELAY_MS = 50;
  const TYPING_TIMEOUT_MS = 2000;

  const scrollToBottom = useCallback((instant = false) => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: instant ? "instant" : "smooth",
        });
      }
    }, SCROLL_DELAY_MS);
  }, []);

  const fetchMessages = useCallback(
    async (chatId, cursor = null) => {
      setIsLoadingMessages(true);
      try {
        const res = await chatAPI.getMessages(chatId, cursor);
        const data = get(res, "data.data", {});
        const fetched = data.messages || [];

        if (cursor) {
          setMessages((prev) => [...fetched, ...prev]);
        } else {
          setMessages(fetched);
          scrollToBottom(true);
        }
        setNextCursor(data.nextCursor || null);
        setHasMore(data.hasMore || false);
        markMessagesAsRead(fetched, chatId);
      } catch {
        // Error fetching messages
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [markMessagesAsRead, scrollToBottom],
  );

  useEffect(() => {
    if (!selectedChat || !socket) return;

    socket.emit("join-chat", selectedChat.id);
    fetchMessages(selectedChat.id);

    return () => {
      socket.emit("leave-chat", selectedChat.id);
    };
  }, [selectedChat, socket, fetchMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;

        const tempIdx = prev.findIndex(
          (m) =>
            typeof m.id === "string" &&
            m.id.startsWith("temp-") &&
            m.senderId === message.senderId &&
            m.content === message.content,
        );
        if (tempIdx !== -1) {
          const updated = [...prev];
          updated[tempIdx] = message;
          return updated;
        }

        return [...prev, message];
      });
      scrollToBottom();

      if (
        selectedChat &&
        message.chatId === selectedChat.id &&
        message.senderId !== currentUser.id
      ) {
        socket.emit("message-read", {
          messageId: message.id,
          chatId: selectedChat.id,
        });
      }

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

    const handleReadAck = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, readAt: new Date().toISOString() } : m,
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
    socket.on("message-read-ack", handleReadAck);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("message-read-ack", handleReadAck);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [socket, selectedChat, currentUser.id, scrollToBottom]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !socket) return;

    const content = messageInput.trim();

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      chatId: selectedChat.id,
      senderId: currentUser.id,
      content,
      contentType: "text",
      readAt: null,
      createdAt: dayjs().toISOString(),
      senderFirstName: currentUser.firstName,
      senderAvatar: currentUser.avatar,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    socket.emit("send-message", {
      chatId: selectedChat.id,
      content,
      contentType: "text",
    });

    setMessageInput("");
    socket.emit("stop-typing", { chatId: selectedChat.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !selectedChat) return;
    socket.emit("typing", { chatId: selectedChat.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId: selectedChat.id });
    }, TYPING_TIMEOUT_MS);
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || isLoadingMessages) return;
    if (container.scrollTop === 0) {
      fetchMessages(selectedChat.id, nextCursor);
    }
  };

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
      <div className="flex justify-center shrink-0">
        <h2 className="text-2xl md:text-4xl text-primary-silver font-bold uppercase">
          Messages
        </h2>
      </div>

      <div className="w-full flex-1 flex justify-between items-stretch gap-3 md:gap-4 overflow-hidden">
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          onlineUsers={onlineUsers}
          transitionStyle={transitionStyle}
        />

        <ChatPanel>
          {selectedChat ? (
            <>
              <ChatHeader
                chat={selectedChat}
                onlineUsers={onlineUsers}
                typingUser={typingUser}
              />
              <MessageList
                messages={messages}
                hasMore={hasMore}
                isLoading={isLoadingMessages}
                onLoadMore={fetchMessages}
                nextCursor={nextCursor}
                containerRef={messagesContainerRef}
                endRef={messagesEndRef}
                onScroll={handleScroll}
                currentUser={currentUser}
                chatId={selectedChat.id}
              />
              <MessageInput
                value={messageInput}
                onChange={handleInputChange}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <EmptyChat />
          )}
        </ChatPanel>
      </div>
    </div>
  );
};

export default Messages;
