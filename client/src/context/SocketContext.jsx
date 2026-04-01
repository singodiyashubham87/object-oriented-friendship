import { disconnectSocket, getSocket } from "@/config/socket";
import { chatAPI } from "@/services/api";
import { get } from "lodash-es";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SocketContext = createContext(null);

const fetchUnread = async (setHasUnread) => {
  try {
    const res = await chatAPI.getUnreadCount();
    const count = get(res, "data.data.unreadCount", 0);
    if (count > 0) setHasUnread(true);
  } catch {
    console.error("Failed to fetch unread count");
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const clearUnread = useCallback(() => {
    setHasUnread(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const currentUser = JSON.parse(storedUser);

    fetchUnread(setHasUnread);

    const s = getSocket();
    s.connect();
    setSocket(s);

    s.on("connect", () => {
      setIsConnected(true);
    });

    s.on("disconnect", () => {
      setIsConnected(false);
    });

    s.on("online-users", (activeUserIds) => {
      setOnlineUsers(activeUserIds);
    });

    s.on("new-message", (message) => {
      if (message.senderId !== currentUser.id) {
        setHasUnread(true);
      }
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return () => {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
      setHasUnread(false);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, isConnected, hasUnread, clearUnread }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return {
      socket: null,
      onlineUsers: [],
      isConnected: false,
      hasUnread: false,
      clearUnread: () => {},
    };
  }
  return context;
};
