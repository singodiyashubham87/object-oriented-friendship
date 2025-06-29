import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { size } from "lodash-es";
import db from "../../db/index.js";
import { User } from "../../db/schema/index.js";
import { mapUpdateUserDTO } from "./user.dto.js";

const BASE_PLACEHOLDER_IMG_URL = "https://api.dicebear.com/6.x/initials/svg";
const SALT_ROUNDS_FOR_HASHING = 10;

const register = async (payload) => {
  const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.email, payload.email));

  if (size(existingUser)) {
    throw new Error("User already exists");
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
    .where(eq(User.email, payload.email));
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

export { register, login, updateUser };
