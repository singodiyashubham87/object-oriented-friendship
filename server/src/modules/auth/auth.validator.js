import Joi from "joi";
import validator from "validator";

const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;

const baseAuthSchemaFields = {
  first_name: Joi.string(),
  last_name: Joi.string(),
  user_name: Joi.string()
    .pattern(USERNAME_REGEX)
    .message(
      "Username must be 3–20 characters long and contain only letters, numbers, or underscores.",
    ),
  email: Joi.string().email(),
  password: Joi.string().custom((value, helpers) => {
    if (!validator.isStrongPassword(value)) {
      return helpers.message(
        "Password must be strong: Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.",
      );
    }
    return value;
  }),
};

const validateForRegister = async (payload) => {
  const registerSchema = Joi.object({
    first_name: baseAuthSchemaFields.first_name.required(),
    last_name: baseAuthSchemaFields.last_name.required(),
    user_name: baseAuthSchemaFields.user_name.required(),
    email: baseAuthSchemaFields.email.required(),
    password: baseAuthSchemaFields.password.required(),
  });

  return await registerSchema.validateAsync(payload);
};

const validateForLogin = async (payload) => {
  const inputSchema = Joi.object({
    username_or_email: Joi.string().required(),
    password: baseAuthSchemaFields.password.required(),
    remember_me: Joi.boolean().optional().default(false),
  });

  const validatedInput = await inputSchema.validateAsync(payload);

  const transformedPayload = {
    password: validatedInput.password,
    remember_me: validatedInput.remember_me,
  };

  const isEmail = validatedInput.username_or_email.includes("@");

  if (isEmail) {
    await baseAuthSchemaFields.email
      .required()
      .validateAsync(validatedInput.username_or_email);
    transformedPayload.email = validatedInput.username_or_email;
  } else {
    await baseAuthSchemaFields.user_name
      .required()
      .validateAsync(validatedInput.username_or_email);
    transformedPayload.user_name = validatedInput.username_or_email;
  }

  return transformedPayload;
};

const validateForForgotPassword = async (payload) => {
  const forgotPasswordSchema = Joi.object({
    email: baseAuthSchemaFields.email.required(),
  });

  return await forgotPasswordSchema.validateAsync(payload);
};

const validateForResetPassword = async (payload) => {
  const resetPasswordSchema = Joi.object({
    token: Joi.string().required().min(1).message("Reset token is required"),
    password: baseAuthSchemaFields.password.required(),
  });

  return await resetPasswordSchema.validateAsync(payload);
};

export {
  validateForRegister,
  validateForLogin,
  validateForForgotPassword,
  validateForResetPassword,
};
