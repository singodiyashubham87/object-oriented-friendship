import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import db from "../../db/index.js";
import { Request } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";

const createRequest = async (payload) => {
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
    })
    .where(eq(Request.id, payload.requestId))
    .returning();

  return request;
};

const rejectRequest = async (payload) => {
  const [request] = await db
    .update(Request)
    .set({
      status: REQUEST_STATUS.REJECTED,
    })
    .where(eq(Request.id, payload.requestId))
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
  const [allPendingRequests] = await db
    .select()
    .from(Request)
    .where(
      and(
        eq(Request.receiverId, payload.userId),
        eq(Request.status, REQUEST_STATUS.PENDING),
      ),
    );

  return allPendingRequests;
};

export {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getAllPendingRequest,
};
