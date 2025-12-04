import Joi from "joi";

const baseUserSchemaFields = {
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  avatar: Joi.string(),
  phone: Joi.string(),
  bio: Joi.string(),
  skills: Joi.array().items(Joi.string()),
  location: Joi.string(),
  gender: Joi.string(),
  age: Joi.number(),
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
    location: baseUserSchemaFields.location.optional(),
    gender: baseUserSchemaFields.gender.optional(),
    age: baseUserSchemaFields.age.optional(),
  });

  return updateSchema.validateAsync(payload);
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

export { validateForUpdate, validateForFeedQuery };
