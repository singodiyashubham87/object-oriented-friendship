import dayjs from "dayjs";
import db from "./db/index.js";
import { Request, User } from "./db/schema/index.js";
import { REQUEST_STATUS } from "./enums/requestStatus.js";

const main = async () => {
  try {
    const allUsers = await db.select().from(User).limit(15);

    const userIds = allUsers
      .map((user) => user.id)
      .filter((id) => id !== "f7448ada-3425-4747-9789-4ea7bce6da6b");

    for (const userId of userIds) {
      await db
        .insert(Request)
        .values({
          senderId: userId,
          receiverId: "f7448ada-3425-4747-9789-4ea7bce6da6b",
          status: REQUEST_STATUS.PENDING,
          createdAt: dayjs().toDate(),
          updatedAt: dayjs().toDate(),
        })
        .onConflictDoNothing()
        .returning();
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

main();
