import Joi from "joi";
import validator from "validator";

const validateForCreate = async (user) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().custom((value, helpers) => {
      if (!validator.isMobilePhone(value, "any")) {
        return helpers.error("any.invalid", {
          message: "Invalid phone number",
        });
      }
      return value;
    }),
    userName: Joi.string(),
    password: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isStrongPassword(value)) {
          return helpers.error("Invalid password");
        }
        return value;
      }),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" }),
  });
};

const validateForUpdate = (newData) => {};

const validateForLogin = (user) => {
  if (!user.email) {
    throw new Error("Please provide your email");
  }
  if (!validator.isEmail(user.email)) {
    throw new Error("Invalid email format");
  }

  if (!user.password) {
    throw new Error("Please provide a password");
  }

  return {
    email: user.email,
    password: user.password,
  };
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
  validateForCreate,
  validateForUpdate,
  validateForLogin,
  validateForFeedQuery,
};
