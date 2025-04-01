import API from "../../helpers/api.js";
import Response from "../../helpers/response.js";

import * as userValidator from "./user.validator.js";

const signup = async (req, res) => {
  try {
    const validatedData = await userValidator.validateForCreate(req.body);
    const user = await userService.create(validatedData);
    if (!user) {
      return Response.exception(res, API.FAILED_TO_CREATE_USER);
    }
    return Response.created(res, API.USER_CREATED, { data: { user } });
  } catch (error) {
    return Response.exception(res, API.FAILED_TO_REGISTER_USER, {
      errorMessage: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const validatedCredentials = userValidator.validateForLogin(req.body);
    const user = await User.findOne({
      email: validatedCredentials.email,
    });
    if (!user) {
      return Response.notFound(res, API.USER_NOT_FOUND);
    }
    const isPasswordValid = await user.validatePassword(
      validatedCredentials.password,
    );
    if (!isPasswordValid) {
      return Response.unauthorized(res, API.INVALID_CREDENTIALS);
    }
    const token = await user.getJwtToken();
    res.cookie("token", token);
    return Response.success(res, API.LOGIN_SUCCESSFUL, { data: { token } });
  } catch (error) {
    return Response.exception(res, API.FAILED_TO_LOGIN_USER, {
      errorMessage: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  return Response.success(res, API.LOGOUT_SUCCESSFUL);
};

const forgotPassword = async (req, res) => {
  try {
    const { email, password: newPassword } = req.body;
    if (!newPassword) {
      throw new Error("Please provide a password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password must be strong");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return Response.notFound(res, API.USER_NOT_FOUND);
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    return Response.success(res, API.PASSWORD_UPDATED_SUCCESSFULLY);
  } catch (error) {
    return Response.exception(res, API.FAILED_TO_UPDATE_PASSWORD, {
      errorMessage: error.message,
    });
  }
};

export { signup, login, logout, forgotPassword };
