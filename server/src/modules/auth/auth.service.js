import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { eq, or } from "drizzle-orm";
import { size } from "lodash-es";
import db from "../../db/index.js";
import { User } from "../../db/schema/index.js";

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
    profilePic: `${BASE_PLACEHOLDER_IMG_URL}?seed=${encodeURIComponent(
      payload.user_name,
    )}`,
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
  };

  // Destructing array first element since drizzle or sql in general return array of modified rows
  const [user] = await db.insert(User).values(userData).returning();

  const { password, ...safeUser } = user;

  return safeUser;
};

const login = async (payload) => {
  const { user_name, email } = payload;

  let condition;
  if (user_name && email) {
    condition = or(eq(User.userName, user_name), eq(User.email, email));
  } else if (user_name) {
    condition = eq(User.userName, user_name);
  } else if (email) {
    condition = eq(User.email, email);
  }

  const [user] = await db.select().from(User).where(condition);

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

export { register, login, resetPassword, getUserById };
