import dayjs from "dayjs";
import db from "../../db/index.js";
import { Request } from "../../db/schema/index.js";

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

export { createRequest };
