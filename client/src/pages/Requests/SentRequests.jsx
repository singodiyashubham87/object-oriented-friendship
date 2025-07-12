import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import UserAvatar from "@/components/UserAvatar";
import LocationIcon from "@/components/icons/LocationIcon";
import RevertRequestIcon from "@/components/icons/RevertRequestIcon";
import axiosInstance from "@/config/axios";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SentRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestedUsers, setRequestedUsers] = useState([]);

  useEffect(() => {
    const fetchRequestedUsers = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/request/sent");
        const requestedUsers = get(res, "data.data.requests", []);

        setRequestedUsers(requestedUsers);
      } catch (error) {
        toast.error("Failed to fetch sent requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestedUsers();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!size(requestedUsers)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          No sent requests found. Start sending connection requests to others!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Sent Requests
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {requestedUsers?.map((user, index) => {
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
                <div className="flex gap-2 items-center bg-primary-silver-50 text-primary-dark px-4 py-1 rounded-custom-xs hover:bg-secondary-silver cursor-pointer">
                  <RevertRequestIcon size={16} />
                  <button
                    type="button"
                    className="uppercase text-base font-primary font-semibold"
                  >
                    Revert
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SentRequests;
