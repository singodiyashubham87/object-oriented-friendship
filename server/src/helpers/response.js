import API_RESPONSE from "./api.js";

const Response = {
  success: (res, message, data = {}) => {
    const body = {
      message: message ?? API_RESPONSE.REQUEST_SUCCESSFUL,
      ...data,
    };
    res.status(200).send(body);
  },
  created: (res, message, data = {}) => {
    const body = { message: message ?? API_RESPONSE.CREATED, ...data };
    res.status(201).send(body);
  },
  updated: (res, message, data = {}) => {
    const body = { message: message ?? API_RESPONSE.UPDATED, ...data };
    res.status(200).send(body);
  },
  notFound: (res, message, data = {}) => {
    const body = { message: message ?? API_RESPONSE.NOT_FOUND, ...data };
    res.status(404).send(body);
  },
  unauthorized: (res, message, data = {}) => {
    const body = { message: message ?? API_RESPONSE.UNAUTHORIZED, ...data };
    res.status(401).send(body);
  },
  exception: (res, message, data = {}) => {
    const body = {
      message: message ?? API_RESPONSE.EXCEPTION_OCCURRED,
      ...data,
    };
    res.status(500).send(body);
  },
  forbidden: (res, message, data = {}) => {
    const body = { message: message ?? API_RESPONSE.FORBIDDEN, ...data };
    res.status(403).send(body);
  },
};

export default Response;
