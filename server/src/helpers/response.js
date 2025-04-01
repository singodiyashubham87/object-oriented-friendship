import API from "./api.js";

const Response = {
  success: (res, message, data = {}) => {
    const body = { message: message ?? API.REQUEST_SUCCESSFUL, ...data };
    res.status(200).send(body);
  },
  created: (res, message, data = {}) => {
    const body = { message: message ?? API.CREATED, ...data };
    res.status(201).send(body);
  },
  updated: (res, message, data = {}) => {
    const body = { message: message ?? API.UPDATED, ...data };
    res.status(200).send(body);
  },
  notFound: (res, message, data = {}) => {
    const body = { message: message ?? API.NOT_FOUND, ...data };
    res.status(404).send(body);
  },
  unauthorized: (res, message, data = {}) => {
    const body = { message: message ?? API.UNAUTHORIZED, ...data };
    res.status(401).send(body);
  },
  exception: (res, message, data = {}) => {
    const body = { message: message ?? API.EXCEPTION_OCCURRED, ...data };
    res.status(500).send(body);
  },
  forbidden: (res, message, data = {}) => {
    const body = { message: message ?? API.FORBIDDEN, ...data };
    res.status(403).send(body);
  },
};

export default Response;
