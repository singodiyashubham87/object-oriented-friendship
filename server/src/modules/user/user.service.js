import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { and, eq, inArray, or } from "drizzle-orm";
import { size } from "lodash-es";
import db from "../../db/index.js";
import { Request, User } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";
import { mapUpdateUserDTO } from "./user.dto.js";

const BASE_PLACEHOLDER_IMG_URL = "https://api.dicebear.com/6.x/initials/svg";
const SALT_ROUNDS_FOR_HASHING = 10;

const register = async (payload) => {
  const existingUser = await db
    .select()
    .from(User)
    .where(
      or(eq(User.userName, payload.user_name), eq(User.email, payload.email)),
    );

  if (size(existingUser)) {
    throw new Error("User with this username or email already exists");
  }

  // Hash the password before storing to db
  const hashedPassword = await bcrypt.hash(
    payload.password,
    SALT_ROUNDS_FOR_HASHING,
  );

  const userData = {
    firstName: payload.first_name,
    lastName: payload.last_name,
    userName: payload.user_name,
    email: payload.email,
    password: hashedPassword,
    profilePic: `${BASE_PLACEHOLDER_IMG_URL}?seed=${encodeURIComponent(payload.user_name)}`,
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
  };

  // Destructing array first element since drizzle or sql in general return array of modified rows
  const [user] = await db.insert(User).values(userData).returning();

  const { password, ...safeUser } = user;

  return safeUser;
};

const login = async (payload) => {
  const [user] = await db
    .select()
    .from(User)
    .where(
      or(
        eq(User.userName, payload.username_or_email),
        eq(User.email, payload.username_or_email),
      ),
    );
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password);

  if (!isValidPassword) {
    throw new Error("Incorrect Password, please try again");
  }

  const { password, ...safeUser } = user;

  return safeUser;
};

const updateUser = async (payload) => {
  const { id, ...rest } = payload;
  if (!id) throw new Error("User ID is required");

  const userData = mapUpdateUserDTO(rest);
  if (size(userData) === 0) throw new Error("Nothing to update");

  userData.updatedAt = dayjs().toDate();

  const [updatedUser] = await db
    .update(User)
    .set(userData)
    .where(eq(User.id, id))
    .returning();

  return updatedUser;
};

const deleteUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const [deletedUser] = await db
    .delete(User)
    .where(eq(User.id, userId))
    .returning();

  return deletedUser;
};

const resetPassword = async (payload) => {
  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.email, payload.email));

  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(
    payload.password,
    SALT_ROUNDS_FOR_HASHING,
  );

  const [updatedUser] = await db
    .update(User)
    .set({ password: hashedPassword })
    .where(eq(User.email, payload.email))
    .returning();

  return updatedUser;
};

const getUserById = async (userId) => {
  const [user] = await db.select().from(User).where(eq(User.id, userId));

  const { password, ...safeUser } = user;

  return safeUser;
};

const getFriends = async (userId) => {
  const rows = await db
    .select({
      senderId: Request.senderId,
      receiverId: Request.receiverId,
    })
    .from(Request)
    .where(
      and(
        or(eq(Request.senderId, userId), eq(Request.receiverId, userId)),
        eq(Request.status, REQUEST_STATUS.ACCEPTED),
      ),
    );

  const friendIdsList = rows.map((row) =>
    row.senderId === userId ? row.receiverId : row.senderId,
  );

  const friends = await db
    .select()
    .from(User)
    .where(inArray(User.id, friendIdsList));

  return friends;
};

const unfriend = async (payload) => {
  const { userId, friendId } = payload;
  const isFriendIdExist = await db
    .select()
    .from(User)
    .where(eq(User.id, friendId));
  if (!isFriendIdExist) {
    throw new Error("User does not exist.");
  }

  const isBothFriends = await db
    .select()
    .from(Request)
    .where(
      or(
        and(eq(Request.senderId, userId), eq(Request.receiverId, friendId)),
        and(eq(Request.senderId, friendId), eq(Request.receiverId, userId)),
      ),
    );

  if (!isBothFriends) {
    throw new Error("Provided user is not a friend of logged in user");
  }

  const [updatedRequest] = await db
    .update(Request)
    .set({
      status: REQUEST_STATUS.REJECTED,
      updatedAt: dayjs().toDate(),
    })
    .where(
      or(
        and(eq(Request.senderId, userId), eq(Request.receiverId, friendId)),
        and(eq(Request.senderId, friendId), eq(Request.receiverId, userId)),
      ),
    )
    .returning();

  return updatedRequest;
};

const getUserFeed = async (userId) => {
  const requests = await db
    .select({
      senderId: Request.senderId,
      receiverId: Request.receiverId,
    })
    .from(Request)
    .where(or(eq(Request.senderId, userId), eq(Request.receiverId, userId)));

  const unknownUserIdsList = requests
    .flatMap((req) => [req.receiverId, req.senderId])
    .filter((id) => id !== userId);

  const feed = await db
    .select()
    .from(User)
    .where(inArray(User.id, unknownUserIdsList));

  return feed;
};

export {
  register,
  login,
  updateUser,
  deleteUser,
  resetPassword,
  getUserById,
  getFriends,
  unfriend,
  getUserFeed,
};
