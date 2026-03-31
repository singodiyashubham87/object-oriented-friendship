import { io } from "socket.io-client";

const RECONNECT_DELAY = 1000;
const RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY_MAX = 5000;
const SOCKET_URL =
  import.meta.env.VITE_SERVER_BASE_URL?.replace("/api", "") ||
  "http://localhost:8000";

// Singleton Design Pattern
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: RECONNECT_DELAY_MAX,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
