import dayjs from "dayjs";
import { and, desc, eq, lt, or, sql } from "drizzle-orm";
import db from "../../db/index.js";
import { Chat, Message, User } from "../../db/schema/index.js";

const MESSAGES_PER_PAGE = 50;

const getMessages = async (chatId, userId, cursor) => {
  // Verify user belongs to this chat
  const [chat] = await db
    .select({ id: Chat.id })
    .from(Chat)
    .where(
      and(
        eq(Chat.id, chatId),
        or(eq(Chat.senderId, userId), eq(Chat.receiverId, userId)),
      ),
    )
    .limit(1);

  if (!chat) {
    throw new Error("Chat not found or you are not a participant");
  }

  // Build query conditions
  const conditions = [eq(Message.chatId, chatId)];
  if (cursor) {
    conditions.push(lt(Message.createdAt, new Date(cursor)));
  }

  const messages = await db
    .select({
      id: Message.id,
      chatId: Message.chatId,
      senderId: Message.senderId,
      content: Message.content,
      contentType: Message.contentType,
      readAt: Message.readAt,
      createdAt: Message.createdAt,
      senderFirstName: User.firstName,
      senderAvatar: User.avatar,
    })
    .from(Message)
    .leftJoin(User, eq(User.id, Message.senderId))
    .where(and(...conditions))
    .orderBy(desc(Message.createdAt))
    .limit(MESSAGES_PER_PAGE + 1);

  const hasMore = messages.length > MESSAGES_PER_PAGE;
  const trimmedMessages = hasMore
    ? messages.slice(0, MESSAGES_PER_PAGE)
    : messages;

  // Reverse so messages are in chronological order (oldest first)
  const chronologicalMessages = trimmedMessages.reverse();

  const nextCursor = hasMore
    ? trimmedMessages[trimmedMessages.length - 1].createdAt.toISOString()
    : null;

  return {
    messages: chronologicalMessages,
    nextCursor,
    hasMore,
  };
};

const createMessage = async (
  chatId,
  senderId,
  content,
  contentType = "text",
) => {
  if (!content?.trim()) {
    throw new Error("Message content cannot be empty");
  }

  // Verify sender belongs to this chat
  const [chat] = await db
    .select()
    .from(Chat)
    .where(
      and(
        eq(Chat.id, chatId),
        or(eq(Chat.senderId, senderId), eq(Chat.receiverId, senderId)),
      ),
    )
    .limit(1);

  if (!chat) {
    throw new Error("Chat not found or you are not a participant");
  }

  const now = dayjs().toDate();

  // Insert message
  const [message] = await db
    .insert(Message)
    .values({
      chatId,
      senderId,
      content: content.trim(),
      contentType,
      createdAt: now,
    })
    .returning();

  // Update chat's last message
  await db
    .update(Chat)
    .set({
      lastMessage: content.trim(),
      lastMessageAt: now,
      updatedAt: now,
    })
    .where(eq(Chat.id, chatId));

  // Get sender info for the response
  const [sender] = await db
    .select({
      firstName: User.firstName,
      avatar: User.avatar,
    })
    .from(User)
    .where(eq(User.id, senderId))
    .limit(1);

  return {
    ...message,
    senderFirstName: sender?.firstName,
    senderAvatar: sender?.avatar,
  };
};

const markAsRead = async (messageId, userId) => {
  // Only mark as read if the user is NOT the sender
  const [message] = await db
    .select()
    .from(Message)
    .where(eq(Message.id, messageId))
    .limit(1);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId === userId) {
    return message; // Don't mark own messages as read
  }

  const [updated] = await db
    .update(Message)
    .set({ readAt: dayjs().toDate() })
    .where(and(eq(Message.id, messageId), sql`${Message.readAt} IS NULL`))
    .returning();

  return updated || message;
};

export { getMessages, createMessage, markAsRead };
