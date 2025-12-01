import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import UserAvatar from "@/components/UserAvatar";
import ConnectionRequestIcon from "@/components/icons/ConnectionRequestIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import { bookmarkAPI, requestAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Bookmark = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedFriends, setBookmarkedFriends] = useState([]);

  useEffect(() => {
    fetchBookmarkedFriends();
  }, []);

  const fetchBookmarkedFriends = async () => {
    setIsLoading(true);
    try {
      const res = await bookmarkAPI.getBookmarks();
      const bookmarks = get(res, "data.data.bookmarkedUsers", []);
      setBookmarkedFriends(bookmarks);
    } catch (error) {
      toast.error(
        `Failed to fetch bookmarked friends: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId, userName) => {
    try {
      await requestAPI.sendRequest(userId);
      toast.success(`Connection request sent to ${userName}!`);
    } catch (error) {
      toast.error(`Failed to send request: ${getErrorMessage(error)}`);
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!size(bookmarkedFriends)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          No bookmarked friends found. Start bookmarking your favorite profiles!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Bookmarks
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {bookmarkedFriends?.map((friend, index) => {
          const fullName = `${friend.firstName} ${friend.lastName}`;

          return (
            <div
              key={friend.id}
              className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30 cursor-pointer hover:border-primary-silver transition-all"
              onClick={() => handleCardClick(friend.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCardClick(friend.id);
              }}
            >
              <UserAvatar avatarUrl={friend.avatar} />
              <div className="flex flex-col items-center gap-1">
                <div className="relative group text-center">
                  <NameWithTooltip name={fullName} index={index} />
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <p className="text-secondary-silver text-sm uppercase font-primary font-semibold">
                      {friend.location}
                    </p>
                  </div>
                </div>
                {friend.isFriend ? (
                  <div
                    className="flex items-center gap-1 bg-primary-silver-50 text-primary-dark px-4 py-1 rounded-custom-xs hover:bg-secondary-silver cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement message functionality
                      toast.info("Message feature coming soon!");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        toast.info("Message feature coming soon!");
                      }
                    }}
                  >
                    <MessageIcon size={18} />
                    <button
                      type="button"
                      className="uppercase text-base font-primary font-semibold"
                    >
                      Message
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 bg-primary-silver-50 text-primary-dark px-4 py-1 rounded-custom-xs hover:bg-secondary-silver cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendRequest(friend.id, fullName);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        handleSendRequest(friend.id, fullName);
                      }
                    }}
                  >
                    <ConnectionRequestIcon size={18} />
                    <button
                      type="button"
                      className="uppercase text-base font-primary font-semibold"
                    >
                      Connect
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookmark;
