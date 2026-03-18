import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { authAPI } from "../services/api.js";

const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await authAPI.verifyToken();
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
  return authenticated ? <Navigate to="/feed" replace /> : children;
};

export default PublicRoute;
