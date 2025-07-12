import userAvatar from "@/assets/images/userAvatar.png";
import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import BookmarkRequestUserIcon from "@/components/icons/BookmarkRequestUserIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import axiosInstance from "@/config/axios";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReceivedRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/request/pending");
        const pendingRequests = get(res, "data.data.requests", []);

        setPendingRequests(pendingRequests);
      } catch (error) {
        toast.error("Failed to fetch pending requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

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
              <div className="w-20 border-2 border-primary-gray-30 overflow-hidden rounded-full">
                <img
                  src={user.avatar || userAvatar}
                  alt="user-avatar"
                  className="w-full h-full object-cover"
                />
              </div>
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
                  <div className="p-sm bg-primary-pink hover:bg-primary-pink-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer">
                    <RejectRequestIcon size="20" />
                  </div>
                  <div className="p-sm bg-primary-cyan hover:bg-primary-cyan-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer">
                    <BookmarkRequestUserIcon size="20" />
                  </div>
                  <div className="p-sm bg-primary-green hover:bg-primary-green-70 rounded-custom-xxs border-xs border-primary-dark cursor-pointer">
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
