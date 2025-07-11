import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import axios from "../config/axios.js";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get("/user/verify");
        const user = res.data?.data?.user;
        if (!user) {
          throw new Error("User not found");
        }
        setAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <Loader />;
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
