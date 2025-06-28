import API_RESPONSE from "./api.js";

const Response = {
  success: (res, message, payload = null) => {
    const body = {
      message: message ?? API_RESPONSE.REQUEST_SUCCESSFUL,
    };
    if (payload) body.data = payload;
    res.status(200).send(body);
  },

  created: (res, message, payload = null) => {
    const body = {
      message: message ?? API_RESPONSE.CREATED,
    };
    if (payload) body.data = payload;
    res.status(201).send(body);
  },

  updated: (res, message, payload = null) => {
    const body = {
      message: message ?? API_RESPONSE.UPDATED,
    };
    if (payload) body.data = payload;
    res.status(200).send(body);
  },

  notFound: (res, message, extra = null) => {
    const body = {
      message: message ?? API_RESPONSE.NOT_FOUND,
    };
    if (extra) body.extra = extra;
    res.status(404).send(body);
  },

  unauthorized: (res, message, extra = null) => {
    const body = {
      message: message ?? API_RESPONSE.UNAUTHORIZED,
    };
    if (extra) body.extra = extra;
    res.status(401).send(body);
  },

  forbidden: (res, message, extra = null) => {
    const body = {
      message: message ?? API_RESPONSE.FORBIDDEN,
    };
    if (extra) body.extra = extra;
    res.status(403).send(body);
  },

  exception: (res, message, error = null) => {
    const body = {
      message: message ?? API_RESPONSE.EXCEPTION_OCCURRED,
    };
    if (error) {
      body.errorMessage =
        error?.message || error?.toString() || "Unexpected error occurred";
    }
    res.status(500).send(body);
  },
};

export default Response;
