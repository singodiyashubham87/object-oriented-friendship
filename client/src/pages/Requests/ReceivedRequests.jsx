import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import SearchBar from "@/components/SearchBar";
import UserAvatar from "@/components/UserAvatar";
import { useUserSearch } from "@/hooks/useUserSearch";
import { bookmarkAPI, requestAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import {
  BookmarkAdd01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReceivedRequests = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { searchQuery, setSearchQuery, filteredUsers } =
    useUserSearch(pendingRequests);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const res = await requestAPI.getPendingRequests();
      const requests = get(res, "data.data.requests", []);
      setPendingRequests(requests);
    } catch (error) {
      toast.error(
        `Failed to fetch pending requests: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, userName) => {
    try {
      await requestAPI.acceptRequest(requestId);
      toast.success(`${userName}'s request accepted!`);
      setPendingRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId),
      );
    } catch (error) {
      toast.error(`Failed to accept request: ${getErrorMessage(error)}`);
    }
  };

  const handleRejectRequest = async (requestId, userName) => {
    try {
      await requestAPI.rejectRequest(requestId);
      toast.success(`${userName}'s request rejected`);
      setPendingRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId),
      );
    } catch (error) {
      toast.error(`Failed to reject request: ${getErrorMessage(error)}`);
    }
  };

  const handleBookmarkUser = async (userId, userName) => {
    try {
      await bookmarkAPI.addBookmark(userId);
      toast.success(`${userName} bookmarked!`);
    } catch (error) {
      toast.error(`Failed to bookmark: ${getErrorMessage(error)}`);
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!size(pendingRequests)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 relative">
        {isLoading && <Loader />}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
            Received Requests
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          {searchQuery.trim()
            ? "No requests found matching your search."
            : "No received requests found. Start connecting with others!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 relative">
      {isLoading && <Loader />}
      <div className="flex flex-col items-center gap-3 h-1/5">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
          Received Requests
        </h2>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full h-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center px-4 py-6 gap-6 overflow-y-auto overflow-x-hidden">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user, index) => {
            const fullName = `${user.firstName} ${user.lastName}`;

            return (
              <div
                key={user.id}
                className="group relative flex flex-col items-center justify-between w-full max-w-44 h-48 bg-gradient-to-b from-dark-glassmorphism-50 to-dark-glassmorphism-70 backdrop-blur-sm rounded-custom-s px-2 py-3 md:px-3 shadow-xl border border-primary-gray-30 hover:border-primary-green-70 hover:cursor-pointer transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-green/10 overflow-hidden"
                onClick={() => handleCardClick(user.id)}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(user.id)}
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Avatar with ring effect */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-green-70 to-dark-green-70 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                  <UserAvatar
                    avatarUrl={user.avatar}
                    classNames="relative ring-2 ring-primary-gray-30 group-hover:ring-primary-green-70 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col items-center gap-0.5 flex-grow justify-center z-10 w-full px-1">
                  <div className="relative group text-center w-full">
                    <NameWithTooltip
                      name={fullName}
                      index={index}
                      charLimit={18}
                    />
                    {user?.location && (
                      <div className="flex items-center gap-1 justify-center">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          className="w-3 h-3 shrink-0 text-primary-cyan"
                        />
                        <p className="text-secondary-silver text-xs uppercase font-primary font-medium tracking-wide truncate max-w-32">
                          {user.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 flex gap-1.5 items-center justify-center w-full">
                  <button
                    type="button"
                    className="p-1.5 bg-primary-pink hover:bg-primary-pink-70 rounded-full border border-primary-dark cursor-pointer transition-all duration-200"
                    onClick={() =>
                      handleRejectRequest(user.requestId, fullName)
                    }
                    aria-label="Reject request"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 bg-primary-cyan hover:bg-primary-cyan-70 rounded-full border border-primary-dark cursor-pointer transition-all duration-200"
                    onClick={() => handleBookmarkUser(user.id, fullName)}
                    aria-label="Bookmark user"
                  >
                    <HugeiconsIcon
                      icon={BookmarkAdd01Icon}
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 bg-primary-green hover:bg-primary-green-70 rounded-full border border-primary-dark cursor-pointer transition-all duration-200"
                    onClick={() =>
                      handleAcceptRequest(user.requestId, fullName)
                    }
                    aria-label="Accept request"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-primary-silver text-xl text-center">
              No requests found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedRequests;
