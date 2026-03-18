import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import SearchBar from "@/components/SearchBar";
import UserAvatar from "@/components/UserAvatar";
import { useUserSearch } from "@/hooks/useUserSearch";
import { bookmarkAPI, requestAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import {
  Delete02Icon,
  Location01Icon,
  Message01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Bookmark = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedFriends, setBookmarkedFriends] = useState([]);
  const [sendingRequest, setSendingRequest] = useState({});
  const [requestSent, setRequestSent] = useState({});
  const [requestIds, setRequestIds] = useState({}); // Track requestId for each user
  const [removingBookmark, setRemovingBookmark] = useState({});
  const { searchQuery, setSearchQuery, filteredUsers } =
    useUserSearch(bookmarkedFriends);

  useEffect(() => {
    fetchBookmarkedFriends();
  }, []);

  const fetchBookmarkedFriends = async () => {
    setIsLoading(true);
    try {
      const res = await bookmarkAPI.getBookmarks();
      const bookmarks = get(res, "data.data.bookmarkedUsers", []);
      setBookmarkedFriends(bookmarks);

      const initialRequestSentState = {};
      const initialRequestIds = {};
      for (const user of bookmarks) {
        if (user.hasPendingRequest) {
          initialRequestSentState[user.id] = true;
          initialRequestIds[user.id] = user.requestId;
        }
      }
      setRequestSent(initialRequestSentState);
      setRequestIds(initialRequestIds);
    } catch (error) {
      toast.error(
        `Failed to fetch bookmarked friends: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId, userName) => {
    setSendingRequest((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await requestAPI.sendRequest(userId);
      const newRequestId = get(res, "data.data.request.id");
      toast.success(`Connection request sent to ${userName}!`);
      setRequestSent((prev) => ({ ...prev, [userId]: true }));
      setRequestIds((prev) => ({ ...prev, [userId]: newRequestId }));
    } catch (error) {
      toast.error(`Failed to send request: ${getErrorMessage(error)}`);
    } finally {
      setSendingRequest((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleWithdrawRequest = async (userId, userName) => {
    setSendingRequest((prev) => ({ ...prev, [userId]: true }));
    try {
      const requestId = requestIds[userId];
      await requestAPI.cancelRequest(requestId);
      toast.success(`Connection request to ${userName} withdrawn!`);
      setRequestSent((prev) => ({ ...prev, [userId]: false }));
      setRequestIds((prev) => {
        const newIds = { ...prev };
        delete newIds[userId];
        return newIds;
      });
    } catch (error) {
      toast.error(`Failed to withdraw request: ${getErrorMessage(error)}`);
    } finally {
      setSendingRequest((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemoveBookmark = async (e, userId, fullName) => {
    e.stopPropagation();
    setRemovingBookmark((prev) => ({ ...prev, [userId]: true }));
    try {
      await bookmarkAPI.removeBookmark(userId);
      toast.success(`${fullName} removed from bookmarks!`);
      setBookmarkedFriends((prev) => prev.filter((f) => f.id !== userId));
    } catch (error) {
      toast.error(`Failed to remove bookmark: ${getErrorMessage(error)}`);
    } finally {
      setRemovingBookmark((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!size(bookmarkedFriends)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 relative">
        {isLoading && <Loader />}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
            Bookmarks
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          {searchQuery.trim()
            ? "No bookmarks found matching your search."
            : "No bookmarked friends found. Start bookmarking your favorite profiles!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 relative">
      {isLoading && <Loader />}
      <div className="flex flex-col items-center gap-3 h-1/5">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
          Bookmarks
        </h2>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full h-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center px-4 py-6 gap-6 overflow-y-auto overflow-x-hidden">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((friend, index) => {
            const fullName = `${friend.firstName} ${friend.lastName}`;

            return (
              <button
                key={friend.id}
                type="button"
                className="group relative flex flex-col items-center justify-between w-full max-w-44 h-48 bg-gradient-to-b from-dark-glassmorphism-50 to-dark-glassmorphism-70 backdrop-blur-sm rounded-custom-s px-2 py-3 md:px-3 shadow-xl border border-primary-gray-30 hover:border-primary-cyan-70 hover:cursor-pointer transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-cyan/10 overflow-hidden"
                onClick={() => handleCardClick(friend.id)}
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Remove bookmark button */}
                <button
                  type="button"
                  title="Remove from bookmarks"
                  className="absolute top-2 right-2 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                  onClick={(e) => handleRemoveBookmark(e, friend.id, fullName)}
                  disabled={removingBookmark[friend.id]}
                >
                  {removingBookmark[friend.id] ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={Delete02Icon} className="w-3 h-3" />
                  )}
                </button>

                {/* Avatar with ring effect */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-cyan-70 to-dark-cyan-70 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                  <UserAvatar
                    avatarUrl={friend.avatar}
                    classNames="relative ring-2 ring-primary-gray-30 group-hover:ring-primary-cyan-70 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col items-center gap-0.5 flex-grow justify-center z-10 w-full px-1">
                  <div className="relative group text-center w-full">
                    <NameWithTooltip
                      name={fullName}
                      index={index}
                      charLimit={18}
                    />
                    {friend?.location && (
                      <div className="flex items-center gap-1 justify-center">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          className="w-3 h-3 shrink-0 text-primary-cyan"
                        />
                        <p className="text-secondary-silver text-xs uppercase font-primary font-medium tracking-wide truncate max-w-32">
                          {friend.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {friend.isFriend ? (
                  <button
                    type="button"
                    className="relative z-10 flex gap-1.5 items-center bg-gradient-to-r from-primary-cyan-70 to-dark-cyan-70 text-primary-dark px-3 py-1 rounded-full hover:from-primary-cyan hover:to-dark-cyan cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Message feature coming soon!");
                    }}
                  >
                    <span className="uppercase text-xs font-primary font-bold tracking-wide">
                      Message
                    </span>
                    <HugeiconsIcon icon={Message01Icon} className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`relative z-10 flex gap-1.5 items-center px-3 py-1 rounded-full cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg ${
                      requestSent[friend.id]
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-primary-silver to-secondary-silver text-primary-dark hover:from-primary-silver-70 hover:to-secondary-silver-70"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!sendingRequest[friend.id]) {
                        if (requestSent[friend.id]) {
                          handleWithdrawRequest(friend.id, fullName);
                        } else {
                          handleSendRequest(friend.id, fullName);
                        }
                      }
                    }}
                  >
                    {sendingRequest[friend.id] ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                        <span className="uppercase text-xs font-primary font-bold tracking-wide">
                          Sending...
                        </span>
                      </>
                    ) : requestSent[friend.id] ? (
                      <>
                        <span className="uppercase text-xs font-primary font-bold tracking-wide">
                          Withdraw
                        </span>
                        <HugeiconsIcon
                          icon={UserAdd01Icon}
                          className="w-3 h-3"
                        />
                      </>
                    ) : (
                      <>
                        <span className="uppercase text-xs font-primary font-bold tracking-wide">
                          Connect
                        </span>
                        <HugeiconsIcon
                          icon={UserAdd01Icon}
                          className="w-3 h-3"
                        />
                      </>
                    )}
                  </button>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-primary-silver text-xl text-center">
              No bookmarks found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
