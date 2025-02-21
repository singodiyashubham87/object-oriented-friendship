import userAvatar from "@/assets/images/userAvatar.png";
import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import BookmarkRequestUserIcon from "@/components/icons/BookmarkRequestUserIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import { friendsData } from "@/pages/Friends/data/friends";
import React from "react";
import { Tooltip } from "react-tooltip";

const ReceivedRequests = () => {
  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Received Requests
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center items-stretch flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {friendsData?.map((friend, index) => (
          <div
            key={friend.id}
            className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30"
          >
            <div className="w-20 border-2 border-primary-gray-30 overflow-hidden rounded-full">
              <img
                src={userAvatar}
                alt="user-avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative group text-center">
                {friend?.name?.length > 7 ? (
                  <>
                    <p
                      className="text-primary-silver text-base font-semibold truncate text-center"
                      data-tooltip-id={`tooltip-${index}`}
                    >
                      {`${friend.name?.slice(0, 7)}...`}
                    </p>
                    <Tooltip
                      id={`tooltip-${index}`}
                      place="bottom"
                      effect="solid"
                    >
                      {friend.name}
                    </Tooltip>
                  </>
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
        ))}
      </div>
    </div>
  );
};

export default ReceivedRequests;
