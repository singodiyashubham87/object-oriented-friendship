import API_RESPONSE from "../../utils/api.js";
import { generateToken } from "../../utils/jwt.js";
import Response from "../../utils/response.js";

import dayjs from "dayjs";
import { isProd } from "../../utils/common.js";
import * as authService from "./auth.service.js";
import * as authValidator from "./auth.validator.js";

const register = async (req, res) => {
  try {
    const validatedData = await authValidator.validateForRegister(req.body);

    const user = await authService.register(validatedData);

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
    const validatedCredentials = await authValidator.validateForLogin(req.body);

    const user = await authService.login(validatedCredentials);

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

const resetPassword = async (req, res) => {
  try {
    const updatedUser = await authService.resetPassword(req.body);

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

const verifyToken = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await authService.getUserById(userId);

    if (!user) {
      return Response.notFound(res, API_RESPONSE.USER_NOT_FOUND);
    }

    return Response.success(res, API_RESPONSE.TOKEN_VERIFIED, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_VERIFY_TOKEN, error);
  }
};

export { register, login, logout, resetPassword, verifyToken };
