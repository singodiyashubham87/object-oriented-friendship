import Joi from "joi";

const validateForCreate = async (payload) => {
  const createSchema = Joi.object({
    senderId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required(),
    receiverId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required(),
  });

  return createSchema.validateAsync(payload);
};

const validateForRequestUpdate = async (payload) => {
  const acceptSchema = Joi.object({
    requestId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required(),
  });

  return acceptSchema.validateAsync(payload);
};

export { validateForCreate, validateForRequestUpdate };
