import FeedCardActions from "@/components/FeedCardActions";
import Loader from "@/components/Loader";
import { bookmarkAPI, requestAPI, userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get, size } from "lodash-es";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userAvatar from "../../assets/images/userAvatar.png";
import { indianStatesMap } from "./feedData";

const DEBOUNCE_DELAY_MS = 300;

const Feed = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevUser, setPrevUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [nextUser, setNextUser] = useState(null);
  const [allFeedUsers, setAllFeedUsers] = useState([]);
  const [feedUsers, setFeedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prevArrowColor, setPrevArrowColor] = useState("#C7C2C2");
  const [nextArrowColor, setNextArrowColor] = useState("#C7C2C2");
  const transitionStyle = "ease-in-out transition-transform duration-300";

  const formatGender = (gender) => {
    if (!gender) return "";
    const lowerGender = gender.toLowerCase();
    if (lowerGender === "male" || lowerGender === "m") return "M";
    if (lowerGender === "female" || lowerGender === "f") return "F";
    return "";
  };

  const formatName = (firstName, lastName, maxLength = 18) => {
    const fullName = `${firstName || ""}${lastName ? ` ${lastName}` : ""}`;
    if (fullName.length <= maxLength) return fullName;
    return `${fullName.slice(0, maxLength - 3)}...`;
  };

  const renderAgeGender = (user) => {
    const age = user?.age;
    const gender = formatGender(user?.gender);

    if (!age && !gender) return null;

    return (
      <div className="w-1/4 min-w-fit px-2 py-0.5 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-1 sm:gap-2">
        <p className="text-primary-dark text-[0.8rem] md:text-base">
          {age && age}
          {age && gender && ", "}
          {gender && gender}
        </p>
      </div>
    );
  };

  const handleNext = () => {
    if (currentIndex < feedUsers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    const tagName = e.target.tagName.toLowerCase();

    if (["button", "svg", "path"].includes(tagName)) {
      return;
    }
    navigate(`/profile/${feedUsers[currentIndex]?.id}`);
  };

  const handleAcceptClick = async () => {
    try {
      setIsLoading(true);

      const userId = currentUser?.id;
      const res = await requestAPI.acceptRequest(userId);

      if (res.status === 200 || res.status === 201) {
        toast.success(`${currentUser?.firstName || "User"} accepted!`);

        const updatedUsers = feedUsers.filter((user) => user.id !== userId);

        setFeedUsers(updatedUsers);
        setCurrentIndex((prev) => Math.min(prev, updatedUsers.length - 1));
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectClick = async () => {
    try {
      setIsLoading(true);

      const userId = currentUser?.id;
      const res = await requestAPI.rejectRequest(userId);

      if (res.status === 200 || res.status === 201) {
        toast.success(`${currentUser?.firstName || "User"} rejected.`);

        const updatedUsers = feedUsers.filter((user) => user.id !== userId);

        setFeedUsers(updatedUsers);
        setCurrentIndex((prev) => Math.min(prev, updatedUsers.length - 1));
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkClick = async () => {
    try {
      setIsLoading(true);

      const userId = currentUser?.id;
      const firstName = currentUser?.firstName || "User";

      const res = await bookmarkAPI.addBookmark(userId);

      if (res.status === 200 || res.status === 201) {
        const updatedUsers = feedUsers.map((user) =>
          user.id === userId ? { ...user, isBookmarked: true } : user,
        );

        setFeedUsers(updatedUsers);
        toast.success(`${firstName} bookmarked!`);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setPrevUser(feedUsers[currentIndex - 1]);
    setCurrentUser(feedUsers[currentIndex]);
    setNextUser(feedUsers[currentIndex + 1]);
  }, [currentIndex, feedUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFeedUsers(allFeedUsers);
      setCurrentIndex(allFeedUsers.length > 1 ? 1 : 0);
      return;
    }

    const filtered = allFeedUsers.filter((user) => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const firstName = user?.firstName?.toLowerCase() || "";
      const lastName = user?.lastName?.toLowerCase() || "";
      return firstName.includes(searchLower) || lastName.includes(searchLower);
    });

    setFeedUsers(filtered);
    setCurrentIndex(filtered.length > 1 ? 1 : 0);
  }, [debouncedSearchQuery, allFeedUsers]);

  useEffect(() => {
    const fetchFeedData = async () => {
      setIsLoading(true);
      try {
        const res = await userAPI.getUserFeed();
        const feedUsers = get(res, "data.data.feed", []);

        setAllFeedUsers(feedUsers);
        setFeedUsers(feedUsers);
      } catch (error) {
        toast.error("Failed to fetch feed data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!size(feedUsers)) {
    return (
      <div className="flex-grow flex flex-col items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 gap-8">
        <div className="flex flex-col items-center gap-4 mt-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-primary-silver font-bold uppercase">
            feed
          </h2>
          <div className="w-44 md:w-56 lg:w-72 xl:w-80">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-2 py-1 bg-dark-glassmorphism-30 border border-secondary-silver rounded-lg text-primary-silver placeholder-secondary-silver focus:outline-none focus:border-primary-silver transition-colors"
            />
          </div>
        </div>
        <p className="text-primary-silver text-lg md:text-xl lg:text-2xl text-center w-1/2">
          {searchQuery.trim()
            ? "No users found matching your search."
            : "No users found in the feed."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-hidden px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 mb-1 sm:mb-2">
        <h2 className="text-lg sm:text-xl md:text-2xl text-primary-silver font-bold uppercase">
          feed
        </h2>
        <div className="w-40 sm:w-48 md:w-56 lg:w-64">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-dark-glassmorphism-30 border border-secondary-silver rounded-lg text-primary-silver placeholder-secondary-silver focus:outline-none focus:border-primary-silver transition-colors"
          />
        </div>
      </div>
      <div className="w-full flex flex-1 justify-center items-center px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-3 gap-1 sm:gap-2 md:gap-4 overflow-hidden">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          type="button"
          className={`flex-shrink-0 p-1 sm:p-2 ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } hover:scale-[1.1] ${transitionStyle}`}
          disabled={currentIndex === 0}
          onMouseEnter={() => setPrevArrowColor("#e7e7e7")}
          onMouseLeave={() => setNextArrowColor("#c7c2c2")}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            color={prevArrowColor}
          />
        </button>
        <div className="cards flex-1 flex justify-center items-center relative max-h-full">
          {/* Left faded card - hidden on smaller screens */}
          {currentIndex > 0 && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className={`hidden md:flex absolute hover:scale-[0.95] ${transitionStyle} cursor-pointer flex-col gap-2 z-0 left-0 md:left-4 lg:left-8 xl:left-12 w-[8rem] md:w-[9rem] lg:w-[10rem] border border-gray-300 bg-primary-silver opacity-40 scale-[0.75] rounded-custom-s transition-transform p-2 md:p-3`}
              onClick={handlePrev}
            >
              <div className="aspect-square border-2 border-primary-dark rounded-custom-xs overflow-hidden">
                <img
                  src={prevUser?.avatar || userAvatar}
                  alt="Friend"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-primary-dark font-bold text-xs xl:text-sm truncate max-w-[60%]">
                  {prevUser?.firstName} {prevUser?.lastName || ""}
                </p>
                <div className="flex items-center gap-0.5">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="w-2.5 h-2.5 xl:w-3 xl:h-3"
                  />
                  <p className="text-primary-dark text-[10px] xl:text-xs">
                    {indianStatesMap[prevUser?.location]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active card */}
          <div
            className={`hover:scale-[1.02] ${transitionStyle} z-10 cursor-pointer flex flex-col gap-1.5 sm:gap-2 border border-gray-400 rounded-custom-s bg-primary-silver shadow-lg p-3 md:p-4`}
            onClick={(e) => handleProfileClick(e)}
            onKeyUp={(e) => e.key === "Enter" && handleProfileClick(e)}
          >
            <div className="w-full border-2 border-primary-dark rounded-custom-xs overflow-hidden h-36 sm:h-40">
              <img
                src={feedUsers[currentIndex]?.avatar || userAvatar}
                alt="Friend"
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-primary-dark text-[0.8rem] md:text-base font-bold truncate max-w-[65%] md:max-w-[75%] lg:max-w-[85%]  ">
                {currentUser?.firstName} {currentUser?.lastName || ""}
              </p>
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4"
                />
                <p className="text-primary-dark text-[10px] sm:text-xs md:text-sm">
                  {indianStatesMap[currentUser?.location]}
                </p>
              </div>
            </div>
            {renderAgeGender(currentUser)}
            <FeedCardActions
              onReject={handleRejectClick}
              onBookmark={handleBookmarkClick}
              onAccept={handleAcceptClick}
              isBookmarked={currentUser?.isBookmarked}
            />
          </div>

          {/* Right faded card - hidden on smaller screens */}
          {currentIndex < feedUsers.length - 1 && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className={`hidden md:flex absolute hover:scale-[0.95] ${transitionStyle} cursor-pointer flex-col gap-2 z-0 right-0 md:right-4 lg:right-8 xl:right-12 w-[8rem] md:w-[9rem] lg:w-[10rem] border border-gray-300 bg-primary-silver opacity-40 scale-[0.75] rounded-custom-s transition-transform p-2 md:p-3`}
              onClick={handleNext}
            >
              <div className="aspect-square border-2 border-primary-dark rounded-custom-xs overflow-hidden">
                <img
                  src={nextUser?.avatar || userAvatar}
                  alt="Friend"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-primary-dark font-bold text-xs xl:text-sm truncate max-w-[60%]">
                  {nextUser?.firstName} {nextUser?.lastName || ""}
                </p>
                <div className="flex items-center gap-0.5">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="w-2.5 h-2.5 xl:w-3 xl:h-3"
                  />
                  <p className="text-primary-dark text-[10px] xl:text-xs">
                    {indianStatesMap[nextUser?.location]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Next button */}
        <button
          onClick={handleNext}
          type="button"
          className={`flex-shrink-0 p-1 sm:p-2 ${
            currentIndex === feedUsers.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } hover:scale-[1.1] ${transitionStyle}`}
          disabled={currentIndex === feedUsers.length - 1}
          onMouseEnter={() => setNextArrowColor("#e7e7e7")}
          onMouseLeave={() => setNextArrowColor("#c7c2c2")}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            color={nextArrowColor}
          />
        </button>
      </div>
    </div>
  );
};

export default Feed;
