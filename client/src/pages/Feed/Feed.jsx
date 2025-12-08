import FeedCardActions from "@/components/FeedCardActions";
import Loader from "@/components/Loader";
import FeedNextArrowIcon from "@/components/icons/FeedNextArrowIcon";
import FeedPrevArrowIcon from "@/components/icons/FeedPrevArrowIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { bookmarkAPI, requestAPI, userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
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

  const renderAgeGender = (user) => {
    const age = user?.age;
    const gender = formatGender(user?.gender);

    if (!age && !gender) return null;

    return (
      <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
        <p className="text-primary-dark">
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
          <h2 className="text-4xl text-primary-silver font-bold uppercase">
            feed
          </h2>
          <div className="w-80">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-dark-glassmorphism-30 border border-secondary-silver rounded-lg text-primary-silver placeholder-secondary-silver focus:outline-none focus:border-primary-silver transition-colors"
            />
          </div>
        </div>
        <p className="text-primary-silver text-2xl text-center w-1/2">
          {searchQuery.trim()
            ? "No users found matching your search."
            : "No users found in the feed."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex flex-col items-center gap-4 h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          feed
        </h2>
        <div className="w-80">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-dark-glassmorphism-30 border border-secondary-silver rounded-lg text-primary-silver placeholder-secondary-silver focus:outline-none focus:border-primary-silver transition-colors"
          />
        </div>
      </div>
      <div className="w-full flex flex-grow justify-between items-center flex-wrap px-4 py-6 gap-6 overflow-y-auto overflow-x-hidden ">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          type="button"
          className={`  ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } hover:scale-[1.1] ${transitionStyle} `}
          disabled={currentIndex === 0}
          onMouseEnter={() => setPrevArrowColor("#e7e7e7")}
          onMouseLeave={() => setNextArrowColor("#c7c2c2")}
        >
          <FeedPrevArrowIcon color={prevArrowColor} />
        </button>
        <div className="cards w-10/12 flex justify-center items-center relative">
          {/* Left faded card */}
          {currentIndex > 0 && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className={`absolute hover:scale-[0.95] ${transitionStyle} cursor-pointer flex flex-col gap-2 z-1 left-16 min-w-[15rem] min-h-[19rem] border border-gray-300 bg-primary-silver opacity-50 scale-90 rounded-custom-s transition-transform p-6`}
              onClick={handlePrev}
            >
              <div className="h-[10rem] border-2 border-primary-dark rounded-custom-xs object-cover overflow-hidden">
                <img
                  src={prevUser?.avatar || userAvatar}
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {prevUser?.firstName} {prevUser?.lastName || ""}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[prevUser?.location]}
                  </p>
                </div>
              </div>
              {renderAgeGender(prevUser)}
              <FeedCardActions isBookmarked={prevUser?.isBookmarked} />
            </div>
          )}

          {/* Active card */}
          <div
            className={`hover:scale-[1.02] ${transitionStyle} z-10 cursor-pointer min-w-[19rem] min-h-[23rem] flex flex-col gap-2 border border-gray-400 rounded-custom-s bg-primary-silver shadow-lg p-6`}
            onClick={(e) => handleProfileClick(e)}
            onKeyUp={(e) => e.key === "Enter" && handleProfileClick(e)}
          >
            <div className="w-full h-[13rem] border-2 border-primary-dark rounded-custom-xs object-cover overflow-hidden">
              <img
                src={feedUsers[currentIndex]?.avatar || userAvatar}
                alt="Friend"
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-between">
              <p className="text-center text-primary-dark font-bold text-lg">
                {currentUser?.firstName} {currentUser?.lastName || ""}
              </p>
              <div className="flex items-center gap-1">
                <LocationIcon
                  width="18"
                  height="20"
                  styles={{ paddingBottom: "0.2rem" }}
                />
                <p className="text-primary-dark">
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

          {/* Right faded card */}
          {currentIndex < feedUsers.length - 1 && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className={`absolute hover:scale-[0.95] ${transitionStyle} cursor-pointer flex flex-col gap-2 right-16 min-w-[15rem] min-h-[19rem] border border-gray-300 bg-primary-silver opacity-50 scale-90 rounded-custom-s transition-transform p-6`}
              onClick={handleNext}
            >
              <div className="h-[10rem] border-2 border-primary-dark rounded-custom-xs object-cover overflow-hidden">
                <img
                  src={nextUser?.avatar || userAvatar}
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {nextUser?.firstName} {nextUser?.lastName || ""}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[nextUser?.location]}
                  </p>
                </div>
              </div>
              {renderAgeGender(nextUser)}
              <FeedCardActions isBookmarked={nextUser?.isBookmarked} />
            </div>
          )}
        </div>
        {/* Next button */}
        <button
          onClick={handleNext}
          type="button"
          className={` ${
            currentIndex === feedUsers.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } hover:scale-[1.1] ${transitionStyle}`}
          disabled={currentIndex === feedUsers.length - 1}
          onMouseEnter={() => setNextArrowColor("#e7e7e7")}
          onMouseLeave={() => setNextArrowColor("#c7c2c2")}
        >
          <FeedNextArrowIcon color={nextArrowColor} />
        </button>
      </div>
    </div>
  );
};

export default Feed;
