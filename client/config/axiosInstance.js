import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

export default axiosInstance;
