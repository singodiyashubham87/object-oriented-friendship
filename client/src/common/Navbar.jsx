import logo from "@/assets/images/oof-logo.png";
import Loader from "@/components/Loader";
import NavIcon from "@/components/NavIcon";
import RequestButtons from "@/components/RequestButtons";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import FriendsIcon from "@/components/icons/FriendsIcon";
import InboxIcon from "@/components/icons/InboxIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import RequestsIcon from "@/components/icons/RequestsIcon";
import { authAPI, userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { get } from "lodash-es";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestRouteName = location.pathname.split("-")[0].slice(1); // e.g., "/received-requests" => "received"
  const isReceivedRoute = requestRouteName === "received";
  const isSentRoute = requestRouteName === "sent";
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userAPI.getCurrentUser();
        const user = get(res, "data.data.user", null);
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const leftNavIcons = [
    {
      href: "/login",
      Icon: LogoutIcon,
      name: "logout",
      onClick: handleLogout,
      isAppRoute: false,
    },
    { href: "/friends", Icon: FriendsIcon, name: "friends" },
    { href: "/messages", Icon: InboxIcon, name: "inbox" },
  ];

  const rightNavIcons = [
    { href: "/bookmark", Icon: BookmarkIcon, name: "bookmark" },
  ];

  const fallbackAvatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
    `${userData?.firstName || ""} ${userData?.lastName || "User"}`,
  )}`;

  if (isLoading) return <Loader />;

  return (
    <nav className="w-full bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s blur-76 backdrop-blur-76">
      <ul className="flex items-center justify-between py-6 px-8 gap-3 md:gap-6">
        <div className="leftIcons flex items-center justify-center gap-3 md:gap-6">
          {leftNavIcons.map((icon) => (
            <NavIcon
              key={icon.name}
              href={icon.href}
              IconComponent={icon.Icon}
              iconName={icon.name}
              hoveredIcon={hoveredIcon}
              onClick={icon.onClick}
              isAppRoute={
                icon.isAppRoute !== undefined ? icon.isAppRoute : true
              }
              setHoveredIcon={setHoveredIcon}
              isActive={location.pathname === icon.href}
            />
          ))}
        </div>
        <li className="hidden md:block cursor-pointer">
          <Link to="/feed">
            <img src={logo} alt="Logo" width={"125px"} title="Feed" />
          </Link>
        </li>
        <div className="rightIcons flex items-stretch justify-center gap-3 md:gap-6">
          {rightNavIcons.map((icon) => (
            <NavIcon
              key={icon.name}
              href={icon.href}
              IconComponent={icon.Icon}
              iconName={icon.name}
              hoveredIcon={hoveredIcon}
              setHoveredIcon={setHoveredIcon}
              isActive={location.pathname === icon.href}
            />
          ))}
          <li>
            <Link to="/received-requests">
              <div
                className={`p-1 rounded-custom-xs ease-in duration-200 relative cursor-pointer ${
                  location.pathname === "/sent-requests" ||
                  location.pathname === "/received-requests"
                    ? "bg-secondary-silver"
                    : "bg-secondary-dark hover:bg-secondary-silver"
                }`}
                onMouseEnter={() => setHoveredIcon("sent-requests")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <RequestsIcon
                  color={
                    location.pathname === "/sent-requests" ||
                    location.pathname === "/received-requests" ||
                    hoveredIcon === "sent-requests"
                      ? "#373737"
                      : "#92918D"
                  }
                />
                {(isReceivedRoute || isSentRoute) && (
                  <RequestButtons
                    isReceivedRoute={isReceivedRoute}
                    isSentRoute={isSentRoute}
                  />
                )}
              </div>
            </Link>
          </li>
          <li>
            <a href="/profile">
              <div className="w-11 h-11 flex items-center justify-center rounded-custom-xs overflow-hidden bg-primary-silver">
                <img
                  src={userData?.avatar || fallbackAvatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-custom-xs"
                />
              </div>
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
