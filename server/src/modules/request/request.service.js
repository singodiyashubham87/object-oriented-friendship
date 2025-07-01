import dayjs from "dayjs";
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
    .where({ id: payload.requestId })
    .returning();

  return request;
};

const rejectRequest = async (payload) => {
  const [request] = await db
    .update(Request)
    .set({
      status: REQUEST_STATUS.REJECTED,
    })
    .where({ id: payload.requestId })
    .returning();

  return request;
};

export { createRequest, acceptRequest, rejectRequest };
