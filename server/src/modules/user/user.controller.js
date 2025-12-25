import API_RESPONSE from "../../utils/api.js";
import Response from "../../utils/response.js";

import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import * as userService from "./user.service.js";
import * as userValidator from "./user.validator.js";

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const validatedData = await userValidator.validateForUpdate(req.body);

    const updatedUser = await userService.updateUser({
      id: userId,
      ...validatedData,
    });

    if (!updatedUser) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.USER_UPDATED, {
      user: updatedUser,
    });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_UPDATE_USER, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.USER_DELETED, {
      user: deletedUser,
    });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_DELETE_USER, error);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    if (!user) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.USER_FETCHED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_FETCH_USER, error);
  }
};

const verifyPhone = async (req, res) => {
  try {
    const userId = req.params.id;
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return Response.badRequest(res, API_RESPONSE.PHONE_NUMBER_REQUIRED);
    }
    const user = await userService.verifyPhone(userId, phoneNumber);
    return Response.success(res, API_RESPONSE.PHONE_VERIFIED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_VERIFY_PHONE, error);
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await userService.getFriends(userId);

    return Response.success(res, "", { friends });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_FETCH_USER, error);
  }
};

const unfriend = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const userId = req.user.id;

    const result = await userService.unfriend({
      userId,
      friendId,
    });

    if (!result) {
      return Response.notFound(res, "User not found");
    }

    return Response.success(res, "Unfriend successful", {
      unfriendedUser: friendId,
    });
  } catch (error) {
    return Response.exception(res, "Failed to unfriend", error);
  }
};

const getUserFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const feed = await userService.getUserFeed(userId);

    return Response.success(res, "", { feed });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_FETCH_USER, error);
  }
};

const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return Response.badRequest(res, "Query parameter 'q' is required");
    }

    const users = await userService.searchUsers(query);

    return Response.success(res, "Users fetched successfully", { users });
  } catch (error) {
    return Response.exception(res, "Failed to search users", error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user?.id;

    const user = await userService.getUserById(userId, currentUserId);

    if (!user) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.USER_FETCHED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_FETCH_USER, error);
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return Response.badRequest(res, "No file uploaded");
    }

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return Response.badRequest(
        res,
        "Invalid file type. Only JPEG, JPG, PNG are allowed",
      );
    }

    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `avatar_${Date.now()}`,
          resource_type: "image",
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });

    return Response.success(res, "Image uploaded successfully", {
      url: imageUrl,
    });
  } catch (error) {
    return Response.exception(res, "Failed to upload image", error);
  }
};

export {
  updateUser,
  deleteUser,
  verifyPhone,
  getCurrentUser,
  getUserById,
  getFriends,
  unfriend,
  getUserFeed,
  searchUsers,
  uploadAvatar,
};
