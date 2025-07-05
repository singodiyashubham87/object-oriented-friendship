import Response from "../../utils/response.js";
import * as bookmarkService from "./bookmark.service.js";

const createBookmark = async (req, res) => {
  try {
    const bookmarkedId = req.params.userId;
    const bookmarkerId = req.user.id;

    if (!bookmarkerId) throw new Error("Bookmarker id is required");
    if (!bookmarkedId) throw Error("User not authenticated");

    const bookmarkedUser = await bookmarkService.createBookmark({
      bookmarkerId,
      bookmarkedId,
    });

    return Response.success(res, "Bookmarked successful", { bookmarkedUser });
  } catch (error) {
    return Response.exception(res, "Failed to bookmark user", error);
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const bookmarkedId = req.params.userId;
    const bookmarkerId = req.user.id;

    if (!bookmarkerId) throw new Error("Bookmarker id is required");
    if (!bookmarkedId) throw Error("User not authenticated");

    const deletedBookmark = await bookmarkService.deleteBookmark({
      bookmarkerId,
      bookmarkedId,
    });

    return Response.success(res, "Bookmark removed successful", {
      deletedBookmark,
    });
  } catch (error) {
    return Response.exception(res, "Failed to bookmark user", error);
  }
};

const getBookmarkedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarkedUsers = await bookmarkService.getBookmarkedUsers(userId);

    return Response.success(res, "Bookmarks fetched successful", {
      bookmarkedUsers,
    });
  } catch (error) {
    return Response.exception(res, "Failed to fetch bookmarks", error);
  }
};

export { createBookmark, deleteBookmark, getBookmarkedUsers };
