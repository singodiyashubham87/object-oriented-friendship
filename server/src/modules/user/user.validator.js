import Joi from "joi";
import validator from "validator";

const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,20}$/;

const baseUserSchemaFields = {
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
  avatar: Joi.string(),
  phone: Joi.string(),
  bio: Joi.string(),
  skills: Joi.array().items(Joi.string()),
};

const validateForRegister = async (payload) => {
  const registerSchema = Joi.object({
    first_name: baseUserSchemaFields.first_name.required(),
    last_name: baseUserSchemaFields.last_name.required(),
    user_name: baseUserSchemaFields.user_name.required(),
    email: baseUserSchemaFields.email.required(),
    password: baseUserSchemaFields.password.required(),
  });

  return await registerSchema.validateAsync(payload);
};

const validateForUpdate = async (payload) => {
  const updateSchema = Joi.object({
    first_name: baseUserSchemaFields.first_name.optional(),
    last_name: baseUserSchemaFields.last_name.optional(),
    email: baseUserSchemaFields.email.optional(),
    avatar: baseUserSchemaFields.avatar.optional(),
    phone: baseUserSchemaFields.phone.optional(),
    bio: baseUserSchemaFields.bio.optional(),
    skills: baseUserSchemaFields.skills.optional(),
  });

  return updateSchema.validateAsync(payload);
};

const validateForLogin = (payload) => {
  const loginSchema = Joi.object({
    email: baseUserSchemaFields.email.required(),
    password: baseUserSchemaFields.password.required(),
  });

  return loginSchema.validateAsync(payload);
};

const validateForResetPassword = (payload) => {
  const forgotPasswordSchema = Joi.object({
    email: baseUserSchemaFields.email.required(),
    password: baseUserSchemaFields.password.required(),
  });

  return forgotPasswordSchema.validateAsync(payload);
};

const validateForFeedQuery = (query) => {
  const validatedQuery = {};

  if (query.page) {
    const page = Number.parseInt(query.page, 10);
    if (Number.isNaN(page) || page < 0) {
      throw new Error("Page number must be a positive integer");
    }
    validatedQuery.page = page;
  }

  if (query.limit) {
    const limit = Number.parseInt(query.limit, 10);
    if (Number.isNaN(limit) || limit <= 0 || limit > 20) {
      throw new Error("Limit must be a positive integer between 1 and 100");
    }
    validatedQuery.limit = limit;
  }

  return validatedQuery;
};

export {
  validateForRegister,
  validateForUpdate,
  validateForLogin,
  validateForResetPassword,
  validateForFeedQuery,
};
