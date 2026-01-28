import dayjs from "dayjs";
import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import { size } from "lodash-es";
import db from "../../db/index.js";
import { Bookmark, Request, User } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";
import { mapUpdateUserDTO } from "./user.dto.js";

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

const getUserById = async (userId, currentUserId = null) => {
  const [user] = await db.select().from(User).where(eq(User.id, userId));

  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;

  if (!currentUserId) {
    return safeUser;
  }

  const [relationship] = await db
    .select()
    .from(Request)
    .where(
      and(
        or(
          and(
            eq(Request.senderId, currentUserId),
            eq(Request.receiverId, userId),
          ),
          and(
            eq(Request.senderId, userId),
            eq(Request.receiverId, currentUserId),
          ),
        ),
      ),
    )
    .orderBy(
      sql`CASE WHEN ${Request.status} = 'pending' THEN 0 WHEN ${Request.status} = 'accepted' THEN 1 ELSE 2 END`,
      desc(Request.createdAt),
    )
    .limit(1);

  let relationshipStatus = "none";
  let requestId = null;

  if (relationship) {
    if (relationship.status === REQUEST_STATUS.ACCEPTED) {
      relationshipStatus = "friends";
    } else if (relationship.status === REQUEST_STATUS.PENDING) {
      if (relationship.senderId === currentUserId) {
        relationshipStatus = "sent";
        requestId = relationship.id;
      } else {
        relationshipStatus = "received";
        requestId = relationship.id;
      }
    }
  }

  return {
    ...safeUser,
    relationshipStatus,
    requestId,
  };
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
    .where(
      and(
        or(eq(Request.senderId, userId), eq(Request.receiverId, userId)),
        or(
          eq(Request.status, REQUEST_STATUS.PENDING),
          eq(Request.status, REQUEST_STATUS.ACCEPTED),
        ),
      ),
    );

  const connectedUserIds = [
    ...new Set(
      requests
        .flatMap((req) => [req.senderId, req.receiverId])
        .filter((id) => id !== userId),
    ),
  ];

  const feed = await db
    .select()
    .from(User)
    .where(
      notInArray(
        User.id,
        connectedUserIds.length > 0 ? [...connectedUserIds, userId] : [userId],
      ),
    );

  const bookmarks = await db
    .select({ bookmarkedId: Bookmark.bookmarkedId })
    .from(Bookmark)
    .where(eq(Bookmark.bookmarkerId, userId));

  const bookmarkedIds = new Set(bookmarks.map((b) => b.bookmarkedId));

  const feedWithBookmarkStatus = feed.map((user) => ({
    ...user,
    isBookmarked: bookmarkedIds.has(user.id),
  }));

  return feedWithBookmarkStatus;
};

const searchUsers = async (query) => {
  const users = await db
    .select()
    .from(User)
    .where(
      or(
        ilike(User.firstName, `%${query}%`),
        ilike(User.lastName, `%${query}%`),
        ilike(User.userName, `%${query}%`),
        sql`EXISTS (
        SELECT 1 FROM unnest(${User.skills}) AS skill
        WHERE skill ILIKE ${`%${query}%`}
      )`,
      ),
    );

  return users;
};

export {
  updateUser,
  deleteUser,
  getUserById,
  getFriends,
  unfriend,
  getUserFeed,
  searchUsers,
};
