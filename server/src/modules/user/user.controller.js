import API_RESPONSE from "../../utils/api.js";
import { generateToken } from "../../utils/jwt.js";
import Response from "../../utils/response.js";

import dayjs from "dayjs";
import { isProd } from "../../utils/common.js";
import * as userService from "./user.service.js";
import * as userValidator from "./user.validator.js";

const register = async (req, res) => {
  try {
    const validatedData = await userValidator.validateForRegister(req.body);

    const user = await userService.register(validatedData);

    if (!user) {
      return Response.exception(res, API_RESPONSE.FAILED_TO_CREATE_USER);
    }

    return Response.created(res, API_RESPONSE.USER_CREATED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_REGISTER_USER, error);
  }
};

const login = async (req, res) => {
  try {
    const validatedCredentials = await userValidator.validateForLogin(req.body);

    const user = await userService.login(validatedCredentials);

    const jwtToken = generateToken(user);

    res.cookie("token", jwtToken, {
      expires: dayjs().add(7, "days").toDate(),
      httpOnly: true,
      secure: isProd,
      sameSite: "Strict",
    });

    return Response.success(res, API_RESPONSE.LOGIN_SUCCESSFUL, {
      user,
      token: jwtToken,
    });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_LOGIN_USER, error);
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, { expires: dayjs().toDate() });
  return Response.success(res, API_RESPONSE.LOGOUT_SUCCESSFUL);
};

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

const resetPassword = async (req, res) => {
  try {
    const updatedUser = await userService.resetPassword(req.body);

    return Response.success(res, API_RESPONSE.PASSWORD_UPDATED_SUCCESSFULLY, {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    return Response.exception(
      res,
      API_RESPONSE.FAILED_TO_UPDATE_PASSWORD,
      error,
    );
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

const verifyToken = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    if (!user) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.TOKEN_VERIFIED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_VERIFY_TOKEN, error);
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

    if (!friends) {
      return Response.notFound(res, "Failed to fetch friends");
    }

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

    if (!feed) {
      return Response.notFound(res, "Failed to fetch user feed");
    }

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

    if (!users) {
      return Response.notFound(res, "No users found");
    }

    return Response.success(res, "Users fetched successfully", { users });
  } catch (error) {
    return Response.exception(res, "Failed to search users", error);
  }
};

export {
  register,
  login,
  logout,
  resetPassword,
  updateUser,
  deleteUser,
  verifyToken,
  verifyPhone,
  getCurrentUser,
  getFriends,
  unfriend,
  getUserFeed,
  searchUsers,
};
