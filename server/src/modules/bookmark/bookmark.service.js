import dayjs from "dayjs";
import { and, eq, inArray, sql } from "drizzle-orm";
import db from "../../db/index.js";
import { Bookmark, Request, User } from "../../db/schema/index.js";
import { REQUEST_STATUS } from "../../enums/requestStatus.js";
import * as userService from "../user/user.service.js";

const createBookmark = async (payload) => {
  const { bookmarkedId, bookmarkerId } = payload;

  const [existing] = await db
    .select()
    .from(Bookmark)
    .where(
      and(
        eq(Bookmark.bookmarkerId, bookmarkerId),
        eq(Bookmark.bookmarkedId, bookmarkedId),
      ),
    );

  if (existing) throw new Error("User already bookmarked!");

  const [bookmark] = await db
    .insert(Bookmark)
    .values({
      bookmarkerId,
      bookmarkedId,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
    })
    .returning();

  return bookmark;
};

const deleteBookmark = async (payload) => {
  const { bookmarkerId, bookmarkedId } = payload;

  const [deletedBookmark] = await db
    .delete(Bookmark)
    .where(
      and(
        eq(Bookmark.bookmarkedId, bookmarkedId),
        eq(Bookmark.bookmarkerId, bookmarkerId),
      ),
    );

  return deletedBookmark;
};

const getBookmarkedUsers = async (userId) => {
  const friends = await userService.getFriends(userId);
  const friendIdSet = new Set(friends.map((f) => f.id));
  const friendIdsArray = Array.from(friendIdSet);

  let isFriendSql;
  if (friendIdsArray.length > 0) {
    isFriendSql = sql`CASE WHEN ${inArray(User.id, friendIdsArray)} THEN true ELSE false END`;
  } else {
    isFriendSql = sql`false`;
  }

  const bookmarkedUsers = await db
    .select({
      ...User,
      isFriend: isFriendSql,
      hasPendingRequest: sql`CASE WHEN ${db
        .select({ id: Request.id })
        .from(Request)
        .where(
          and(
            eq(Request.senderId, userId),
            eq(Request.receiverId, User.id),
            eq(Request.status, REQUEST_STATUS.PENDING),
          ),
        )
        .limit(1)} IS NOT NULL THEN true ELSE false END`,
    })
    .from(Bookmark)
    .leftJoin(User, eq(User.id, Bookmark.bookmarkedId))
    .where(eq(Bookmark.bookmarkerId, userId));

  return bookmarkedUsers;
};

export { createBookmark, deleteBookmark, getBookmarkedUsers };
