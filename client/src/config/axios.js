import axios from "axios";

const API_REQUEST_TIMEOUT = 10000;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: API_REQUEST_TIMEOUT,
  withCredentials: true,
});

export default axiosInstance;
