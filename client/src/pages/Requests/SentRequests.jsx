import Loader from "@/components/Loader";
import NameWithTooltip from "@/components/NameWithTooltip";
import SearchBar from "@/components/SearchBar";
import UserAvatar from "@/components/UserAvatar";
import { useUserSearch } from "@/hooks/useUserSearch";
import { requestAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { Undo02Icon } from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";
import { get, size } from "lodash-es";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SentRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestedUsers, setRequestedUsers] = useState([]);
  const { searchQuery, setSearchQuery, filteredUsers } =
    useUserSearch(requestedUsers);

  useEffect(() => {
    fetchRequestedUsers();
  }, []);

  const fetchRequestedUsers = async () => {
    setIsLoading(true);
    try {
      const res = await requestAPI.getSentRequests();
      const requests = get(res, "data.data.requests", []);
      setRequestedUsers(requests);
    } catch (error) {
      toast.error(`Failed to fetch sent requests: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId, userName) => {
    try {
      await requestAPI.cancelRequest(requestId);
      toast.success(`Request to ${userName} cancelled`);
      setRequestedUsers((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      toast.error(`Failed to cancel request: ${getErrorMessage(error)}`);
    }
  };

  if (!size(requestedUsers)) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 relative">
        {isLoading && <Loader />}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
            Sent Requests
          </h2>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-primary-silver text-2xl w-1/2 text-center">
          {searchQuery.trim()
            ? "No requests found matching your search."
            : "No sent requests found. Start sending connection requests to others!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 relative">
      {isLoading && <Loader />}
      <div className="flex flex-col items-center gap-3 h-1/5">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary-silver font-bold uppercase text-center px-2">
          Sent Requests
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
                className="group relative flex flex-col items-center justify-between w-full max-w-44 h-48 bg-gradient-to-b from-dark-glassmorphism-50 to-dark-glassmorphism-70 backdrop-blur-sm rounded-custom-s px-2 py-3 md:px-3 shadow-xl border border-primary-gray-30 hover:border-primary-silver-70 hover:cursor-pointer transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary-silver/10 overflow-hidden"
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-silver/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Avatar with ring effect */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-silver-70 to-secondary-silver-70 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                  <UserAvatar
                    avatarUrl={user.avatar}
                    classNames="relative ring-2 ring-primary-gray-30 group-hover:ring-primary-silver-70 transition-all duration-300"
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

                <div
                  className="relative z-10 flex gap-1.5 items-center bg-gradient-to-r from-primary-silver-70 to-secondary-silver-70 text-primary-silver px-3 py-1 rounded-full hover:from-primary-silver hover:to-secondary-silver hover:text-primary-dark cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleCancelRequest(user.id, fullName)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCancelRequest(user.id, fullName)
                  }
                >
                  <button
                    type="button"
                    className="uppercase text-xs font-primary font-bold tracking-wide"
                  >
                    Revert
                  </button>
                  <HugeiconsIcon icon={Undo02Icon} className="w-3 h-3" />
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

export default SentRequests;
