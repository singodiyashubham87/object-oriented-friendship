import userAvatar from "@/assets/images/userAvatar.png";
import Loader from "@/components/Loader";
import LocationIcon from "@/components/icons/LocationIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import axiosInstance from "@/config/axios";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Friends = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);

  const handleUserCardClick = (e, userId) => {
    const isMessageBtnClicked = e?.target?.className?.includes("messageBtn");

    return isMessageBtnClicked
      ? navigate("/messages", {
          state: { id: userId },
        })
      : navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/user/friends");
        const friends = get(res, "data.data.friends", []);

        if (!size(friends)) {
          toast.error("No friends found");
        }

        setFriends(friends);
      } catch (error) {
        toast.error("Failed to fetch friends");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!size(friends)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl text-center w-1/2">
          No friends found. Start connecting with others!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Friends
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {friends?.map((friend, index) => {
          const fullName = `${friend.firstName} ${friend.lastName}`;

          return (
            <div
              key={friend.id}
              className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30   hover:cursor-pointer transition-transform ease-in-out duration-300"
              onClick={(e) => handleUserCardClick(e, friend?.id)}
              onKeyDown={(e) => handleUserCardClick(e, friend?.id)}
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
                  {fullName.length > 7 ? (
                    <>
                      <p
                        className="text-primary-silver text-base font-semibold truncate max-w-[100px] text-center"
                        data-tooltip-id={`tooltip-${index}`}
                      >
                        {fullName.length > 7
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
                    </>
                  ) : (
                    <span className="text-primary-silver text-base font-semibold text-center">
                      {fullName}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <p className="text-secondary-silver text-sm uppercase font-primary font-semibold">
                      {friend?.location || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center bg-primary-silver-50 text-primary-dark px-4 py-1 rounded-custom-xs hover:bg-secondary-silver cursor-pointer">
                  <button
                    type="button"
                    className="messageBtn uppercase text-base font-primary font-semibold"
                  >
                    Message
                  </button>
                  <MessageIcon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;
