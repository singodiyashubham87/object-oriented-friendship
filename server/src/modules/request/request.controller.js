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
  try {
    const requestId = req.params.requestId;

    const validatedData = await requestValidator.validateForRequestUpdate({
      requestId,
    });

    const request = await requestService.acceptRequest(validatedData);

    if (!request) {
      throw new Error("Failed to accept request");
    }

    return Response.created(res, "Request accepted successfully");
  } catch (error) {
    return Response.exception(
      res,
      "Failed to accept connection request",
      error,
    );
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const validatedData = await requestValidator.validateForRequestUpdate({
      requestId,
    });

    const request = await requestService.rejectRequest(validatedData);

    if (!request) {
      throw new Error("Failed to reject request");
    }

    return Response.created(res, "Request rejected successfully");
  } catch (error) {
    return Response.exception(
      res,
      "Failed to reject connection request",
      error,
    );
  }
};

const cancelConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const validatedData = await requestValidator.validateForRequestUpdate({
      requestId,
    });

    const request = await requestService.cancelRequest(validatedData);

    if (!request) {
      throw new Error("Failed to cancel request");
    }

    return Response.created(res, "Request canceled successfully");
  } catch (error) {
    return Response.exception(
      res,
      "Failed to cancel connection request",
      error,
    );
  }
};

const getAllPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const allPendingRequests = await requestService.getAllPendingRequest({
      userId,
    });

    if (!allPendingRequests) {
      throw new Error("Failed to fetch requests");
    }

    return Response.success(res, "Request fetched successfully", {
      requests: allPendingRequests,
    });
  } catch (error) {
    return Response.exception(res, "Failed to fetch requests", error);
  }
};

const getAllSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const allSentRequests = await requestService.getAllSentRequest({
      userId,
    });

    if (!allSentRequests) {
      throw new Error("Failed to fetch requests");
    }

    return Response.success(res, "Request fetched successfully", {
      requests: allSentRequests,
    });
  } catch (error) {
    return Response.exception(res, "Failed to fetch requests", error);
  }
};

export {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  getAllPendingRequests,
  getAllSentRequests,
};
