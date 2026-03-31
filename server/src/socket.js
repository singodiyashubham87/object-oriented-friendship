import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import * as messageService from "./modules/message/message.service.js";

// Map<userId, Set<socketId>> — supports multiple tabs per user
const onlineUsers = new Map();

/**
 * Parse cookies from a cookie header string.
 * Avoids adding the 'cookie' npm package as a dependency.
 */
const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;

  for (const pair of cookieHeader.split(";")) {
    const [key, ...valueParts] = pair.trim().split("=");
    if (key) {
      cookies[key.trim()] = decodeURIComponent(valueParts.join("=").trim());
    }
  }
  return cookies;
};

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // ── Auth Middleware (CSWSH-safe) ──
  io.use((socket, next) => {
    // 1. Validate origin
    const origin = socket.handshake.headers.origin;
    const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
    if (origin && origin !== allowedOrigin) {
      return next(new Error("Unauthorized origin"));
    }

    // 2. Extract JWT from cookie
    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) return next(new Error("No cookies provided"));

    const cookies = parseCookies(rawCookies);
    const token = cookies.token;
    if (!token) return next(new Error("No auth token"));

    // 3. Verify JWT (same secret as Express middleware)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  // ── Connection Handler ──
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.info(`[Socket] User ${userId} connected (socket: ${socket.id})`);

    // Track online status (supports multiple tabs)
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("send-message", async ({ chatId, content, contentType }) => {
      try {
        const message = await messageService.createMessage(
          chatId,
          userId,
          content,
          contentType || "text",
        );

        // Emit to everyone in the chat room (including sender for confirmation)
        io.to(chatId).emit("new-message", message);

        // Notify for chat list updates (sidebar refresh)
        io.to(chatId).emit("chat-updated", {
          chatId,
          lastMessage: content,
          lastMessageAt: message.createdAt,
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ── Typing indicators ──
    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("user-typing", { userId, chatId });
    });

    socket.on("stop-typing", ({ chatId }) => {
      socket.to(chatId).emit("user-stop-typing", { userId, chatId });
    });

    // ── Read receipts ──
    socket.on("message-read", async ({ messageId, chatId }) => {
      try {
        await messageService.markAsRead(messageId, userId);
        socket.to(chatId).emit("message-read-ack", { messageId, userId });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ── Disconnect ──
    socket.on("disconnect", () => {
      console.info(
        `[Socket] User ${userId} disconnected (socket: ${socket.id})`,
      );
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
      }
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
}
