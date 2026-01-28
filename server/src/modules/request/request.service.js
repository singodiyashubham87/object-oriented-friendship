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
    .onConflictDoUpdate({
      target: [Request.senderId, Request.receiverId],
      set: {
        status: REQUEST_STATUS.PENDING,
        updatedAt: dayjs().toDate(),
      },
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
        eq(Request.id, payload.requestId),
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
        eq(Request.id, payload.requestId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    )
    .returning();

  return request;
};

const cancelRequest = async (payload) => {
  const [request] = await db
    .delete(Request)
    .where(
      and(
        eq(Request.id, payload.requestId),
        eq(Request.status, REQUEST_STATUS.PENDING),
        eq(Request.senderId, payload.userId), // Verify user is the sender
      ),
    )
    .returning();

  return request;
};

const getAllPendingRequest = async (payload) => {
  const allPendingRequests = await db
    .select({
      requestId: Request.id,
      senderId: Request.senderId,
      firstName: User.firstName,
      lastName: User.lastName,
      email: User.email,
      avatar: User.avatar,
      location: User.location,
      id: User.id,
    })
    .from(Request)
    .innerJoin(User, eq(Request.senderId, User.id))
    .where(
      and(
        eq(Request.receiverId, payload.userId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    );

  return allPendingRequests;
};

const getAllSentRequest = async (payload) => {
  const allSentRequests = await db
    .select({
      requestId: Request.id,
      receiverId: Request.receiverId,
      firstName: User.firstName,
      lastName: User.lastName,
      email: User.email,
      avatar: User.avatar,
      location: User.location,
      id: User.id,
    })
    .from(Request)
    .innerJoin(User, eq(Request.receiverId, User.id))
    .where(
      and(
        eq(Request.senderId, payload.userId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    );

  return allSentRequests;
};

export {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getAllPendingRequest,
  getAllSentRequest,
};
