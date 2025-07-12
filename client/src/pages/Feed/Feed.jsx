import Loader from "@/components/Loader";
import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import BookmarkRequestUserIcon from "@/components/icons/BookmarkRequestUserIcon";
import FeedNextArrowIcon from "@/components/icons/FeedNextArrowIcon";
import FeedPrevArrowIcon from "@/components/icons/FeedPrevArrowIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import axiosInstance from "@/config/axios";
import { get, size } from "lodash-es";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userAvatar from "../../assets/images/userAvatar.png";
import { feedData, indianStatesMap } from "./feedData";

const Feed = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [feedUsers, setFeedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevArrowColor, setPrevArrowColor] = useState("#C7C2C2");
  const [nextArrowColor, setNextArrowColor] = useState("#C7C2C2");
  const transitionStyle = "ease-in-out transition-transform duration-300";

  const handleNext = () => {
    if (currentIndex < feedData.length - 1) {
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
    navigate(`/profile/${feedData[currentIndex]?.id}`);
  };

  const handleRejectClick = () => {
    // TODO: Add API call to reject the request
    alert("Request rejected!");
  };

  const handleAcceptClick = () => {
    // TODO: Add API call to accept the request
    alert("Request accepted!");
  };

  const handleBookmarkClick = () => {
    // TODO: Add API call to bookmark the user
    alert("User bookmarked!");
  };

  useEffect(() => {
    const fetchFeedData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/user/feed");
        const feedUsers = get(res, "data.data.feed", []);

        if (!size(feedUsers)) {
          toast.error("No users found in the feed.");
          return;
        }

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
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl text-center w-1/2">
          No users found in the feed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5 ">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          feed
        </h2>
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
                  src={feedUsers[currentIndex - 1]?.avatar || userAvatar}
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {feedUsers[currentIndex - 1]?.firstName}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[feedUsers[currentIndex - 1]?.location]}
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
                <p className="text-primary-dark">{`${
                  feedUsers[currentIndex - 1]?.age || 21
                }, `}</p>
                <p className="text-primary-dark">{`${
                  feedUsers[currentIndex - 1]?.gender
                }`}</p>
              </div>
              <div className="buttons flex gap-8 mt-4 justify-center">
                <div className="p-2 bg-primary-pink hover:bg-primary-pink-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <RejectRequestIcon size="26" />
                </div>
                <div className="p-2 bg-primary-cyan hover:bg-primary-cyan-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <BookmarkRequestUserIcon size="26" />
                </div>
                <div className="p-2 bg-primary-green hover:bg-primary-green-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <AcceptRequestIcon size="26" />
                </div>
              </div>
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
                {feedUsers[currentIndex]?.firstName}
              </p>
              <div className="flex items-center gap-1">
                <LocationIcon
                  width="18"
                  height="20"
                  styles={{ paddingBottom: "0.2rem" }}
                />
                <p className="text-primary-dark">
                  {indianStatesMap[feedUsers[currentIndex]?.location]}
                </p>
              </div>
            </div>
            <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
              <p className="text-primary-dark">{`${
                feedUsers[currentIndex]?.age || 21
              }, `}</p>
              <p className="text-primary-dark">{`${feedUsers[currentIndex]?.gender}`}</p>
            </div>
            <div className="buttons flex gap-8 mt-4 justify-center">
              <button
                type="button"
                className="p-2 bg-primary-pink hover:bg-primary-pink-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleRejectClick(feedUsers[currentIndex]?.id)}
              >
                <RejectRequestIcon size="26" />
              </button>
              <button
                type="button"
                className="p-2 bg-primary-cyan hover:bg-primary-cyan-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleBookmarkClick(feedUsers[currentIndex]?.id)}
              >
                <BookmarkRequestUserIcon size="26" />
              </button>
              <button
                type="button"
                className="p-2 bg-primary-green hover:bg-primary-green-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleAcceptClick(feedUsers[currentIndex]?.id)}
              >
                <AcceptRequestIcon size="26" />
              </button>
            </div>
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
                  src={feedUsers[currentIndex + 1]?.avatar || userAvatar}
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {feedUsers[currentIndex + 1]?.firstName}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[feedUsers[currentIndex + 1]?.location]}
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
                <p className="text-primary-dark">{`${
                  feedUsers[currentIndex + 1]?.age || 21
                }, `}</p>
                <p className="text-primary-dark">{`${
                  feedUsers[currentIndex + 1]?.gender
                }`}</p>
              </div>
              <div className="buttons flex gap-8 mt-4 justify-center">
                <div className="p-2 bg-primary-pink hover:bg-primary-pink-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <RejectRequestIcon size="26" />
                </div>
                <div className="p-2 bg-primary-cyan hover:bg-primary-cyan-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <BookmarkRequestUserIcon size="26" />
                </div>
                <div className="p-2 bg-primary-green hover:bg-primary-green-70 rounded-full border-xs border-primary-dark cursor-pointer">
                  <AcceptRequestIcon size="26" />
                </div>
              </div>
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
