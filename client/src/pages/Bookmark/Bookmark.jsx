import userAvatar from "@/assets/images/userAvatar.png";
import Loader from "@/components/Loader";
import ConnectionRequestIcon from "@/components/icons/ConnectionRequestIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import axiosInstance from "@/config/axios";
import { get, size } from "lodash-es";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Bookmark = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedFriends, setBookmarkedFriends] = useState([]);

  useEffect(() => {
    const fetchBookmarkedFriends = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/bookmark");
        const bookmarkedFriends = get(res, "data.data.bookmarkedUsers", []);

        setBookmarkedFriends(bookmarkedFriends);
      } catch (error) {
        toast.error("Failed to fetch bookmarked friends");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedFriends();
  }, []);

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
              className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30"
            >
              <div className="w-24 border-2 border-primary-gray-30 overflow-hidden rounded-full">
                <img
                  src={friend.avatar || userAvatar}
                  alt="user-avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="relative group text-center">
                  {size(fullName) > 7 ? (
                    <Fragment>
                      <p
                        className="text-primary-silver text-base font-semibold truncate max-w-[100px] text-center"
                        data-tooltip-id={`tooltip-${index}`}
                      >
                        {size(fullName) > 7
                          ? `${fullName.slice(0, 7)}...`
                          : fullName}
                      </p>
                      <Tooltip
                        id={`tooltip-${index}`}
                        place="top"
                        effect="solid"
                      >
                        {fullName}
                      </Tooltip>
                    </Fragment>
                  ) : (
                    <span className="text-primary-silver text-base font-semibold text-center">
                      {friend.name}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <p className="text-secondary-silver text-sm uppercase font-primary font-semibold">
                      {friend.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-primary-silver-50 text-primary-dark px-4 py-1 rounded-custom-xs hover:bg-secondary-silver cursor-pointer">
                  <ConnectionRequestIcon size={18} />
                  <button
                    type="button"
                    className="uppercase text-base font-primary font-semibold"
                  >
                    Connect
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

export default Bookmark;
