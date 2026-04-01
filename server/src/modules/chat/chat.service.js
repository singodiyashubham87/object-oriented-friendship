import { and, desc, eq, or, sql } from "drizzle-orm";
import db from "../../db/index.js";
import { Chat, Message, Request, User } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";

const getAllChats = async (userId) => {
  const chats = await db
    .select({
      id: Chat.id,
      lastMessage: Chat.lastMessage,
      lastMessageAt: Chat.lastMessageAt,
      createdAt: Chat.createdAt,
      // Get the other user's info
      otherUserId: sql`CASE WHEN ${Chat.senderId} = ${userId} THEN ${Chat.receiverId} ELSE ${Chat.senderId} END`,
      otherUserFirstName: sql`CASE WHEN ${Chat.senderId} = ${userId} THEN receiver.first_name ELSE sender.first_name END`,
      otherUserLastName: sql`CASE WHEN ${Chat.senderId} = ${userId} THEN receiver.last_name ELSE sender.last_name END`,
      otherUserAvatar: sql`CASE WHEN ${Chat.senderId} = ${userId} THEN receiver.avatar ELSE sender.avatar END`,
      otherUserUserName: sql`CASE WHEN ${Chat.senderId} = ${userId} THEN receiver.username ELSE sender.username END`,
      // Count unread messages (messages sent by the other user that I haven't read)
      unreadCount: sql`(
        SELECT COUNT(*)::int FROM message
        WHERE message.chat_id = ${Chat.id}
          AND message.sender_id != ${userId}
          AND message.read_at IS NULL
      )`,
    })
    .from(Chat)
    .leftJoin(sql`"user" AS sender`, sql`sender.id = ${Chat.senderId}`)
    .leftJoin(sql`"user" AS receiver`, sql`receiver.id = ${Chat.receiverId}`)
    .where(or(eq(Chat.senderId, userId), eq(Chat.receiverId, userId)))
    .orderBy(desc(Chat.lastMessageAt));

  return chats;
};

const createOrGetChat = async (userId, targetUserId) => {
  if (userId === targetUserId) {
    throw new Error("Cannot create a chat with yourself");
  }

  // Check if they are friends (accepted request in either direction)
  const [friendship] = await db
    .select({ id: Request.id })
    .from(Request)
    .where(
      and(
        eq(Request.status, REQUEST_STATUS.ACCEPTED),
        or(
          and(
            eq(Request.senderId, userId),
            eq(Request.receiverId, targetUserId),
          ),
          and(
            eq(Request.senderId, targetUserId),
            eq(Request.receiverId, userId),
          ),
        ),
      ),
    )
    .limit(1);

  if (!friendship) {
    throw new Error("You can only chat with friends");
  }

  // Check if chat already exists (either direction)
  const [existingChat] = await db
    .select()
    .from(Chat)
    .where(
      or(
        and(eq(Chat.senderId, userId), eq(Chat.receiverId, targetUserId)),
        and(eq(Chat.senderId, targetUserId), eq(Chat.receiverId, userId)),
      ),
    )
    .limit(1);

  if (existingChat) return existingChat;

  // Create new chat
  const [newChat] = await db
    .insert(Chat)
    .values({
      senderId: userId,
      receiverId: targetUserId,
    })
    .returning();

  return newChat;
};

const getTotalUnreadCount = async (userId) => {
  const [result] = await db
    .select({
      count: sql`COUNT(*)::int`,
    })
    .from(Message)
    .innerJoin(Chat, eq(Message.chatId, Chat.id))
    .where(
      and(
        or(eq(Chat.senderId, userId), eq(Chat.receiverId, userId)),
        sql`${Message.senderId} != ${userId}`,
        sql`${Message.readAt} IS NULL`,
      ),
    );

  return result?.count || 0;
};

export { getAllChats, createOrGetChat, getTotalUnreadCount };
