import Response from "../../utils/response.js";
import * as requestService from "./request.service.js";
import * as requestValidator from "./request.validator.js";

const sendConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.toUserId;
    const senderId = req.user.id;

    const validatedData = await requestValidator.validateForCreate({
      receiverId,
      senderId,
    });

    const request = await requestService.createRequest(validatedData);

    if (!request) {
      throw new Error("Failed to send request");
    }

    return Response.created(res, "Request sent successfully");
  } catch (error) {
    return Response.exception(res, "Failed to send connection request", error);
  }
};

const acceptConnectionRequest = async (req, res) => {
  const requestId = req.params.requestId;

  const validatedData = await requestValidator.validateForAcceptRequest({
    requestId,
  });

  const request = await requestService.acceptRequest(validatedData);
};

export { sendConnectionRequest, acceptConnectionRequest };
