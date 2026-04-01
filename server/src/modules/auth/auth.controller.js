import API_RESPONSE from "../../utils/api.js";
import { generateToken } from "../../utils/jwt.js";
import Response from "../../utils/response.js";

import crypto from "node:crypto";
import dayjs from "dayjs";
import { isProd } from "../../utils/common.js";
import * as authService from "./auth.service.js";
import * as authValidator from "./auth.validator.js";

const ACCESS_TOKEN_EXPIRY_HOURS = 1;
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

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

    const jwtToken = generateToken(user, `${ACCESS_TOKEN_EXPIRY_HOURS}h`);

    res.cookie("token", jwtToken, {
      expires: dayjs().add(ACCESS_TOKEN_EXPIRY_HOURS, "hours").toDate(),
      httpOnly: true, // prevent client-side javascript from accessing the cookie
      secure: isProd, // only send cookie over HTTPS in production
      sameSite: isProd ? "None" : "Lax", // allow cross-site cookies in production to bypassing render proxy layer
    });

    if (validatedCredentials.remember_me) {
      const rawRefreshToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawRefreshToken)
        .digest("hex");
      const deviceInfo = req.headers["user-agent"] || "Unknown Device";
      const ipAddress = req.ip || req.connection?.remoteAddress || "Unknown IP";
      const expiresAt = dayjs().add(REFRESH_TOKEN_EXPIRY_DAYS, "days").toDate();

      await authService.createSession(
        user.id,
        tokenHash,
        deviceInfo,
        ipAddress,
        expiresAt,
      );

      res.cookie("refreshToken", rawRefreshToken, {
        expires: expiresAt,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
      });
    } else {
      res.cookie("refreshToken", null, { expires: dayjs().toDate() });
    }

    return Response.success(res, API_RESPONSE.LOGIN_SUCCESSFUL, { user });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.FAILED_TO_LOGIN_USER, error);
  }
};

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    expires: dayjs().toDate(),
  };

  res.cookie("token", null, cookieOptions);
  res.cookie("refreshToken", null, cookieOptions);
  return Response.success(res, API_RESPONSE.LOGOUT_SUCCESSFUL);
};

const forgotPassword = async (req, res) => {
  try {
    const validatedData = await authValidator.validateForForgotPassword(
      req.body,
    );

    await authService.forgotPassword(validatedData.email);

    return Response.success(res, API_RESPONSE.PASSWORD_RESET_EMAIL_SENT, {
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    return Response.exception(
      res,
      API_RESPONSE.FAILED_TO_SEND_RESET_EMAIL,
      error,
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const validatedData = await authValidator.validateForResetPassword(
      req.body,
    );

    const updatedUser = await authService.resetPassword(
      validatedData.token,
      validatedData.password,
    );

    return Response.success(res, API_RESPONSE.PASSWORD_UPDATED_SUCCESSFULLY, {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    // Check if it's a token-related error
    const errorMsg = error.message;
    if (
      ["Invalid", "expired", "used"].some((word) => errorMsg.includes(word))
    ) {
      return Response.exception(
        res,
        API_RESPONSE.INVALID_OR_EXPIRED_TOKEN,
        error,
      );
    }

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

const getSessions = async (req, res) => {
  try {
    let currentTokenHash = null;
    if (req.cookies.refreshToken) {
      currentTokenHash = crypto
        .createHash("sha256")
        .update(req.cookies.refreshToken)
        .digest("hex");
    }

    const sessions = await authService.getSessionsForUser(
      req.user.id,
      currentTokenHash,
    );
    return Response.success(res, API_RESPONSE.REQUEST_SUCCESSFUL, { sessions });
  } catch (error) {
    return Response.exception(res, API_RESPONSE.EXCEPTION_OCCURRED, error);
  }
};

const revokeSession = async (req, res) => {
  try {
    const { id } = req.params;
    await authService.revokeSession(id, req.user.id);
    return Response.success(res, API_RESPONSE.REQUEST_SUCCESSFUL);
  } catch (error) {
    return Response.exception(res, API_RESPONSE.EXCEPTION_OCCURRED, error);
  }
};

const revokeAllOtherSessions = async (req, res) => {
  try {
    await authService.revokeAllOtherSessions(
      req.user.id,
      req.cookies.refreshToken,
    );
    return Response.success(res, API_RESPONSE.REQUEST_SUCCESSFUL);
  } catch (error) {
    return Response.exception(res, API_RESPONSE.EXCEPTION_OCCURRED, error);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return Response.unauthorized(res, API_RESPONSE.UNAUTHORIZED);
    }

    const { user } = await authService.refreshAccessToken(refreshToken);

    const jwtToken = generateToken(user, `${ACCESS_TOKEN_EXPIRY_HOURS}h`);

    res.cookie("token", jwtToken, {
      expires: dayjs().add(ACCESS_TOKEN_EXPIRY_HOURS, "hours").toDate(),
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    });

    return Response.success(res, API_RESPONSE.TOKEN_VERIFIED, {
      token: jwtToken,
    });
  } catch (error) {
    res.cookie("token", null, { expires: dayjs().toDate() });
    res.cookie("refreshToken", null, { expires: dayjs().toDate() });
    return Response.unauthorized(res, API_RESPONSE.UNAUTHORIZED, error);
  }
};

export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyToken,
  getSessions,
  revokeSession,
  revokeAllOtherSessions,
  refreshAccessToken,
};
