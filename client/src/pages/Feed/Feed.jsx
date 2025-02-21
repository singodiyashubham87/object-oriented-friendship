import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import BookmarkRequestUserIcon from "@/components/icons/BookmarkRequestUserIcon";
import FeedNextArrowIcon from "@/components/icons/FeedNextArrowIcon";
import FeedPrevArrowIcon from "@/components/icons/FeedPrevArrowIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { feedData, indianStatesMap } from "./feedData";

const Feed = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(1);
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
                  src={
                    feedData[currentIndex - 1]?.image ||
                    "https://media.istockphoto.com/id/1408596915/photo/employees-must-complete-the-online-survey-form-answer-the-test-questions-marked-checklist-on.jpg?s=2048x2048&w=is&k=20&c=JCkoENdhBCbi0DC0lIi1did1rHfNd8wu-AVq2bduFyw="
                  }
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {feedData[currentIndex]?.name}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[feedData[currentIndex]?.state]}
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
                <p className="text-primary-dark">{`${
                  feedData[currentIndex]?.age || 21
                }, `}</p>
                <p className="text-primary-dark">{`${feedData[currentIndex]?.gender}`}</p>
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
                src={
                  feedData[currentIndex]?.image ||
                  "https://imgs.search.brave.com/sMcgal2XI2iAo_tND_9PgnZWVnna0tvZoWgZnUnuQDw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFtMTcteWR6TEwu/anBn"
                }
                alt="Friend"
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-between">
              <p className="text-center text-primary-dark font-bold text-lg">
                {feedData[currentIndex]?.name}
              </p>
              <div className="flex items-center gap-1">
                <LocationIcon
                  width="18"
                  height="20"
                  styles={{ paddingBottom: "0.2rem" }}
                />
                <p className="text-primary-dark">
                  {indianStatesMap[feedData[currentIndex]?.state]}
                </p>
              </div>
            </div>
            <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
              <p className="text-primary-dark">{`${
                feedData[currentIndex]?.age || 21
              }, `}</p>
              <p className="text-primary-dark">{`${feedData[currentIndex]?.gender}`}</p>
            </div>
            <div className="buttons flex gap-8 mt-4 justify-center">
              <button
                type="button"
                className="p-2 bg-primary-pink hover:bg-primary-pink-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleRejectClick(feedData[currentIndex]?.id)}
              >
                <RejectRequestIcon size="26" />
              </button>
              <button
                type="button"
                className="p-2 bg-primary-cyan hover:bg-primary-cyan-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleBookmarkClick(feedData[currentIndex]?.id)}
              >
                <BookmarkRequestUserIcon size="26" />
              </button>
              <button
                type="button"
                className="p-2 bg-primary-green hover:bg-primary-green-70 rounded-full border-xs border-primary-dark cursor-pointer"
                onClick={() => handleAcceptClick(feedData[currentIndex]?.id)}
              >
                <AcceptRequestIcon size="26" />
              </button>
            </div>
          </div>

          {/* Right faded card */}
          {currentIndex < feedData.length - 1 && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              className={`absolute hover:scale-[0.95] ${transitionStyle} cursor-pointer flex flex-col gap-2 right-16 min-w-[15rem] min-h-[19rem] border border-gray-300 bg-primary-silver opacity-50 scale-90 rounded-custom-s transition-transform p-6`}
              onClick={handleNext}
            >
              <div className="h-[10rem] border-2 border-primary-dark rounded-custom-xs object-cover overflow-hidden">
                <img
                  src={
                    feedData[currentIndex + 1]?.image ||
                    "https://media.istockphoto.com/id/1434437996/photo/woman-hand-writing-on-clipboard-with-a-pen.jpg?s=2048x2048&w=is&k=20&c=r80A-T41z3wwxA-3LD_nYLF3rxMl0JrmS--dULY9TcY="
                  }
                  alt="Friend"
                  className="w-56 h-56 rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <p className="text-center text-primary-dark font-bold text-lg">
                  {feedData[currentIndex]?.name}
                </p>
                <div className="flex items-center gap-1">
                  <LocationIcon
                    width="18"
                    height="20"
                    styles={{ paddingBottom: "0.2rem" }}
                  />
                  <p className="text-primary-dark">
                    {indianStatesMap[feedData[currentIndex]?.state]}
                  </p>
                </div>
              </div>
              <div className="w-1/4 flex bg-primary-gray rounded-custom-xxs text-primary-dark border border-primary-dark font-semibold justify-center items-center gap-2">
                <p className="text-primary-dark">{`${
                  feedData[currentIndex]?.age || 21
                }, `}</p>
                <p className="text-primary-dark">{`${feedData[currentIndex]?.gender}`}</p>
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
            currentIndex === feedData.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          } hover:scale-[1.1] ${transitionStyle}`}
          disabled={currentIndex === feedData.length - 1}
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
