import Joi from "joi";
import validator from "validator";

// phone: Joi.string()
//       .required()
//       .custom((value, helpers) => {
//         if (!validator.isMobilePhone(value, "en-IN")) {
//           return helpers.message("Invalid phone number");
//         }
//         return value;
//       }).optional(),

const validateForRegister = async (user) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isStrongPassword(value)) {
          return helpers.message(
            "Password must be strong: Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.",
          );
        }
        return value;
      }),
  });

  return await userSchema.validateAsync(user);
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
  validateForRegister,
  validateForUpdate,
  validateForLogin,
  validateForFeedQuery,
};
