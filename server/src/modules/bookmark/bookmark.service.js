import dayjs from "dayjs";
import { and, eq, inArray } from "drizzle-orm";
import db from "../../db/index.js";
import { Bookmark, User } from "../../db/schema/index.js";

const createBookmark = async (payload) => {
  const { bookmarkedId, bookmarkerId } = payload;

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
  const bookmarks = await db
    .select()
    .from(Bookmark)
    .where(eq(Bookmark.bookmarkerId, userId));

  const bookmarkedUserIdsList = bookmarks.map(
    (bookmark) => bookmark.bookmarkedId,
  );

  const bookmarkedUsers = await db
    .select()
    .from(User)
    .where(inArray(User.id, bookmarkedUserIdsList));

  return bookmarkedUsers;
};

export { createBookmark, deleteBookmark, getBookmarkedUsers };
