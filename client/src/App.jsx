import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./common/Layout";

import Bookmark from "@/pages/Bookmark/Bookmark";
import Feed from "@/pages/Feed/Feed";
import Friends from "@/pages/Friends/Friends";
import Login from "@/pages/Login/Login";
import Messages from "@/pages/Messages/Messages";
import Profile from "@/pages/Profile/Profile";
import Register from "@/pages/Register/Register";
import ReceivedRequests from "@/pages/Requests/ReceivedRequests";
import SentRequests from "@/pages/Requests/SentRequests";
import UserProfile from "@/pages/UserProfile/UserProfile";
import Cookies from "js-cookie";
import ProtectedRoute from "./routes/ProtectedRoute";

const RootRoute = () => {
  const token = Cookies.get("oofAuthToken");
  return <Navigate to={token ? "/feed" : "/login"} replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RootRoute />} />
          <Route path="feed" element={<Feed />} />
          <Route path="friends" element={<Friends />} />
          <Route path="messages" element={<Messages />} />
          <Route path="bookmark" element={<Bookmark />} />
          <Route path="sent-requests" element={<SentRequests />} />
          <Route path="received-requests" element={<ReceivedRequests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
