import userAvatar from "@/assets/images/userAvatar.png";
import ConnectionRequestIcon from "@/components/icons/ConnectionRequestIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { friendsData } from "@/pages/Friends/data/friends";
import React from "react";
import { Tooltip } from "react-tooltip";

const Bookmark = () => {
  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Bookmarks
        </h2>
      </div>
      <div className="w-full h-4/5 flex justify-center flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        {friendsData?.map((friend, index) => (
          <div
            key={friend.id}
            className="flex flex-col gap-2 items-center justify-stretch bg-dark-glassmorphism-70 rounded-custom-xs p-4 shadow-lg border-2 border-primary-gray-30"
          >
            <div className="w-24 border-2 border-primary-gray-30 overflow-hidden rounded-full">
              <img
                src={userAvatar}
                alt="user-avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative group text-center">
                {friend.name.length > 7 ? (
                  <>
                    <p
                      className="text-primary-silver text-base font-semibold truncate max-w-[100px] text-center"
                      data-tooltip-id={`tooltip-${index}`}
                    >
                      {friend.name.length > 7
                        ? `${friend.name.slice(0, 7)}...`
                        : friend.name}
                    </p>
                    <Tooltip id={`tooltip-${index}`} place="top" effect="solid">
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
        ))}
      </div>
    </div>
  );
};

export default Bookmark;
