import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import UserAvatar from "@/components/UserAvatar";
import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import BookmarkRequestUserIcon from "@/components/icons/BookmarkRequestUserIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import { bookmarkAPI, requestAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReceivedRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

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

  const handleAcceptRequest = async (id, userName) => {
    try {
      await requestAPI.acceptRequest(id);
      toast.success(`${userName}'s request accepted!`);
      // Remove from list
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      toast.error(`Failed to accept request: ${getErrorMessage(error)}`);
    }
  };

  const handleRejectRequest = async (id, userName) => {
    try {
      await requestAPI.rejectRequest(id);
      toast.success(`${userName}'s request rejected`);
      // Remove from list
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
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

  if (isLoading) {
    return <Loader />;
  }

  if (!size(pendingRequests)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          No received requests found. Start connecting with others!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Received Requests
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center items-stretch flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {pendingRequests?.map((user, index) => {
          const fullName = `${user.firstName} ${user.lastName}`;

          return (
            <div
              key={user.id}
              className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30"
            >
              <UserAvatar avatarUrl={user.avatar} />
              <div className="flex flex-col items-center gap-1">
                <div className="relative group text-center">
                  <NameWithTooltip name={fullName} index={index} />
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <p className="text-secondary-silver text-sm uppercase font-primary font-semibold">
                      {user.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-evenly py-1 rounded-custom-xs px-4">
                  <div
                    className="p-sm bg-primary-pink hover:bg-primary-pink-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer"
                    onClick={() => handleRejectRequest(user.id, fullName)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleRejectRequest(user.id, fullName);
                    }}
                  >
                    <RejectRequestIcon size="20" />
                  </div>
                  <div
                    className="p-sm bg-primary-cyan hover:bg-primary-cyan-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer"
                    onClick={() => handleBookmarkUser(user.id, fullName)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleBookmarkUser(user.id, fullName);
                    }}
                  >
                    <BookmarkRequestUserIcon size="20" />
                  </div>
                  <div
                    className="p-sm bg-primary-green hover:bg-primary-green-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer"
                    onClick={() => handleAcceptRequest(user.id, fullName)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleAcceptRequest(user.id, fullName);
                    }}
                  >
                    <AcceptRequestIcon size="20" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReceivedRequests;
