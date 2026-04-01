import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import SearchBar from "@/components/SearchBar";
import UserAvatar from "@/components/UserAvatar";
import axiosInstance from "@/config/axios";
import { useSocket } from "@/context/SocketContext";
import { useUserSearch } from "@/hooks/useUserSearch";
import { Location01Icon, Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Friends = () => {
  const navigate = useNavigate();
  const { onlineUsers } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const { searchQuery, setSearchQuery, filteredUsers } = useUserSearch(friends);

  const handleUserCardClick = (e, userId) => {
    const isMessageBtnClicked = e?.target?.className?.includes("messageBtn");

    return isMessageBtnClicked
      ? navigate("/messages", {
          state: {
            selectedFriendId: userId,
          },
        })
      : navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/user/friends");
      const friends = get(res, "data.data.friends", []);
      setFriends(friends);
    } catch (error) {
      toast.error("Failed to fetch friends");
    } finally {
      setIsLoading(false);
    }
  };

  if (!size(friends)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 relative">
        {isLoading && <Loader />}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-4xl text-primary-silver font-bold uppercase">
            Friends
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-primary-silver text-2xl text-center w-1/2">
          {searchQuery.trim()
            ? "No friends found matching your search."
            : "No friends found. Start connecting with others!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 relative">
      {isLoading && <Loader />}
      <div className="flex flex-col items-center gap-3 h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Friends
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
              <div
                key={friend.id}
                className="group relative flex flex-col items-center justify-between w-full max-w-44 h-48 bg-gradient-to-b from-dark-glassmorphism-50 to-dark-glassmorphism-70 backdrop-blur-sm rounded-custom-s px-2 py-3 md:px-3 shadow-xl border border-primary-gray-30 hover:border-primary-cyan-70 hover:cursor-pointer transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-cyan/10 overflow-hidden"
                onClick={(e) => handleUserCardClick(e, friend?.id)}
                onKeyDown={(e) => handleUserCardClick(e, friend?.id)}
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Avatar with ring effect and online dot */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-cyan-70 to-dark-cyan-70 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                  <UserAvatar
                    avatarUrl={friend.avatar}
                    classNames="relative ring-2 ring-primary-gray-30 group-hover:ring-primary-cyan-70 transition-all duration-300"
                  />
                  <span
                    className={`absolute bottom-[6px] right-[6px] w-3 h-3 rounded-full border-2 border-dark ${
                      onlineUsers.includes(friend.id)
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
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

                {/* Enhanced Message Button */}
                <div className="relative z-10 flex gap-1.5 items-center bg-gradient-to-r from-primary-cyan-70 to-dark-cyan-70 text-primary-dark px-3 py-1 rounded-full hover:from-primary-cyan hover:to-dark-cyan cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
                  <button
                    type="button"
                    className="messageBtn uppercase text-xs font-primary font-bold tracking-wide"
                  >
                    Message
                  </button>
                  <HugeiconsIcon icon={Message01Icon} className="w-3 h-3" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-primary-silver text-xl text-center">
              No friends found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
