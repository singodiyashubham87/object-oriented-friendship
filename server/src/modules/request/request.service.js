import dayjs from "dayjs";
import { and, eq, inArray } from "drizzle-orm";
import db from "../../db/index.js";
import { Request, User } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";

const createRequest = async (payload) => {
  if (!payload.senderId || !payload.receiverId) {
    throw new Error("Sender ID and Receiver ID are required");
  }

  if (payload.senderId === payload.receiverId) {
    throw new Error("Sender and Receiver cannot be the same");
  }

  const [request] = await db
    .insert(Request)
    .values({
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
    })
    .returning();

  return request;
};

const acceptRequest = async (payload) => {
  const [request] = await db
    .update(Request)
    .set({
      status: REQUEST_STATUS.ACCEPTED,
      updatedAt: dayjs().toDate(),
    })
    .where(
      and(
        eq(Request.senderId, payload.senderId),
        eq(Request.receiverId, payload.receiverId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    )
    .returning();

  return request;
};

const rejectRequest = async (payload) => {
  const [request] = await db
    .update(Request)
    .set({
      status: REQUEST_STATUS.REJECTED,
      updatedAt: dayjs().toDate(),
    })
    .where(
      and(
        eq(Request.senderId, payload.senderId),
        eq(Request.receiverId, payload.receiverId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    )
    .returning();

  return request;
};

const cancelRequest = async (payload) => {
  const [request] = await db
    .delete(Request)
    .where(eq(Request.id, payload.requestId))
    .returning();

  return request;
};

const getAllPendingRequest = async (payload) => {
  const allPendingRequests = await db
    .select({
      senderId: Request.senderId,
    })
    .from(Request)
    .where(
      and(
        eq(Request.receiverId, payload.userId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    );

  const senderIds = allPendingRequests.map((request) => request.senderId);

  const users = await db.select().from(User).where(inArray(User.id, senderIds));

  return users;
};

const getAllSentRequest = async (payload) => {
  const allSentRequests = await db
    .select({
      receiverId: Request.receiverId,
    })
    .from(Request)
    .where(
      and(
        eq(Request.senderId, payload.userId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    );

  const receiverIds = allSentRequests.map((request) => request.receiverId);

  const users = await db
    .select()
    .from(User)
    .where(inArray(User.id, receiverIds));

  return users;
};

export {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getAllPendingRequest,
  getAllSentRequest,
};
