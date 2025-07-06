import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import axios from "../config/axios.js";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get("/user/verify");
        setAuthenticated(true);
      } catch (err) {
        Cookies.remove("token");
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
