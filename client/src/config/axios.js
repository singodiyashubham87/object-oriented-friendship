import axios from "axios";
import { toast } from "react-toastify";

const API_REQUEST_TIMEOUT_MS = 10000; // 10 seconds

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: API_REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      const { status, data } = error.response;

      if (data?.error?.message) {
        errorMessage = data.error.message;
      } else if (data?.message) {
        errorMessage = data.message;
      } else {
        switch (status) {
          case 400:
            errorMessage = "Bad request. Please check your input.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please login again.";
            break;
          case 403:
            errorMessage = "Access forbidden.";
            break;
          case 404:
            errorMessage = "Resource not found.";
            break;
          case 409:
            errorMessage = "Conflict. Resource already exists.";
            break;
          case 429:
            errorMessage = "Too many requests. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error: ${status}`;
        }
      }
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection.";
    } else {
      errorMessage = error.message || errorMessage;
    }

    console.error("API Error:", errorMessage, error);

    return Promise.reject(error);
  },
);

export default axiosInstance;
