import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import _ from "lodash";
import db from "../../db/index.js";
import { User } from "../../db/schema/index.js";

const BASE_PLACEHOLDER_IMG_URL = "https://api.dicebear.com/6.x/initials/svg";
const SALT_ROUNDS_FOR_HASHING = 10;

const register = async (validatedData) => {
  const existingUser = await db
    .select()
    .from(User)
    .where(eq(User.userName, validatedData.userName));

  if (_.size(existingUser)) {
    throw new Error("User already exists");
  }

  // Hash the password before storing to db
  const hashedPassword = await bcrypt.hash(
    validatedData.password,
    SALT_ROUNDS_FOR_HASHING,
  );

  const userData = {
    ...validatedData,
    password: hashedPassword,
    profilePic: `${BASE_PLACEHOLDER_IMG_URL}?seed=${encodeURIComponent(validatedData.userName)}`,
  };

  const inserted = await db.insert(User).values(userData).returning();
  return inserted[0];
};

export { register };
