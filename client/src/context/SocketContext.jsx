import { disconnectSocket, getSocket } from "@/config/socket";
import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get user from localStorage (set by ProtectedRoute after token verify)
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const s = getSocket();
    s.connect();
    setSocket(s);

    s.on("connect", () => {
      setIsConnected(true);
    });

    s.on("disconnect", () => {
      setIsConnected(false);
    });

    s.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return () => {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return { socket: null, onlineUsers: [], isConnected: false };
  }
  return context;
};
