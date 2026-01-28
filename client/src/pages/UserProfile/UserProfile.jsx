import Loader from "@/components/Loader";
import { chatAPI, requestAPI, userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { REQUEST_STATUS } from "@/utils/constants";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get } from "lodash-es";
import React, { useEffect, useState } from "react";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const skillBadgeStyle =
    "leading-5 bg-primary-dark px-2 py-1 rounded-custom-xxs text-primary-silver";

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    setIsLoading(true);
    try {
      const res = await userAPI.getUserById(userId);
      const user = get(res, "data.data.user", null);
      setUserData(user);

      const relationshipStatus = user?.relationshipStatus || "none";
      const extractedRequestId = user?.requestId || null;
      setRequestStatus(relationshipStatus);
      setRequestId(extractedRequestId);
    } catch (error) {
      toast.error(`Failed to load user profile: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      const res = await requestAPI.sendRequest(userId);
      const newRequestId = get(res, "data.data.request.id");
      toast.success(`Connection request sent to ${userData.firstName}!`);
      setRequestStatus("sent");
      setRequestId(newRequestId);
    } catch (error) {
      toast.error(`Failed to send request: ${getErrorMessage(error)}`);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleWithdrawRequest = async () => {
    setSendingRequest(true);
    try {
      if (!requestId) {
        throw new Error(
          "Request ID not found. Please refresh the page and try again.",
        );
      }
      await requestAPI.cancelRequest(requestId);
      toast.success(`Connection request to ${userData.firstName} withdrawn!`);
      setRequestStatus("none");
      setRequestId(null);
    } catch (error) {
      toast.error(`Failed to withdraw request: ${getErrorMessage(error)}`);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await requestAPI.acceptRequest(requestId);
      toast.success(`${userData.firstName}'s request accepted!`);
      setRequestStatus(REQUEST_STATUS.ACCEPTED);
    } catch (error) {
      toast.error(`Failed to accept request: ${getErrorMessage(error)}`);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await requestAPI.rejectRequest(requestId);
      toast.success(`${userData.firstName}'s request rejected`);
      setRequestStatus(REQUEST_STATUS.NONE);
    } catch (error) {
      toast.error(`Failed to reject request: ${getErrorMessage(error)}`);
    }
  };

  const handleUnfriend = async () => {
    setSendingRequest(true);
    try {
      await userAPI.unfriend(userId);
      toast.success(`Unfriended ${userData.firstName}`);
      setRequestStatus("none");
      setRequestId(null);
    } catch (error) {
      toast.error(`Failed to unfriend: ${getErrorMessage(error)}`);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessage = () => {
    toast.info("Messaging feature coming soon!");
  };

  if (!userData) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6 relative">
        {isLoading && <Loader />}
        <p className="text-primary-silver text-2xl text-center">
          User not found
        </p>
      </div>
    );
  }

  const userSkills = userData.skills || [];
  const fullName = `${userData.firstName} ${userData.lastName || ""}`.trim();

  return (
    <div className="flex-grow flex flex-col items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-3 sm:px-4 md:px-6 py-4 md:py-6 relative">
      {isLoading && <Loader />}
      {/* Responsive heading */}
      <div className="flex justify-center mb-4 md:mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary-silver font-bold uppercase">
          User Profile
        </h2>
      </div>
      <div className="w-full flex flex-col flex-grow justify-center px-2 sm:px-4 gap-4  overflow-y-auto overflow-x-hidden">
        {/* Profile picture and user info container */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4">
          {/* Responsive profile picture */}
          <div className="relative w-32 sm:w-40 lg:w-56 aspect-square bg-white flex items-center justify-center rounded-custom-s border-2 border-primary-dark flex-shrink-0 overflow-hidden">
            <img
              src={
                userData.avatar ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}`
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-custom-s"
            />
          </div>
          <div className="userInfoAndSocials w-full lg:w-2/3 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 p-2 sm:p-3 relative bg-dark-glassmorphism-50 border-2 border-primary-silver rounded-custom-s mt-1">
            <div className="userInfo flex flex-col gap-2">
              <h3 className="text-xl sm:text-xl text-primary-silver font-bold">
                {fullName}
              </h3>
              {userData.location && (
                <div className="location flex gap-2 items-center">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="w-4 h-4"
                    color="#92918D"
                  />
                  <p className="text-sm sm:text-base text-primary-silver opacity-70">
                    {userData.location}
                  </p>
                </div>
              )}
              {userData.age && userData.gender && (
                <p className="text-sm sm:text-base text-primary-silver">
                  {userData.age} years, {userData.gender}
                </p>
              )}
            </div>
            <div className="socials flex flex-col gap-2 justify-end">
              <a
                href={`mailto:${userData.email}`}
                className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
              >
                <MdEmail size={16} className="sm:w-5 sm:h-5" />
                <span className="text-sm">Email</span>
              </a>
              {userData.socialLinks?.github && (
                <a
                  href={userData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                >
                  <FaGithub size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm">Github</span>
                </a>
              )}
              {userData.socialLinks?.linkedin && (
                <a
                  href={userData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                >
                  <FaLinkedin size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {userData.socialLinks?.twitter && (
                <a
                  href={userData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                >
                  <FaTwitter size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm">Twitter</span>
                </a>
              )}
              {userData.socialLinks?.website && (
                <a
                  href={userData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                >
                  <FaGlobe size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Buttons and bio section - responsive */}
        <div className="first flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4">
          {requestStatus === "none" && (
            <button
              type="button"
              className="connectButton flex justify-center items-center gap-3 w-full sm:w-64 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-custom-s disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendRequest}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-base sm:text-lg md:text-xl uppercase">
                    Sending...
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg md:text-xl uppercase">
                  Send Request
                </span>
              )}
            </button>
          )}
          {requestStatus === "sent" && (
            <button
              type="button"
              className="withdrawButton flex justify-center items-center gap-3 w-full sm:w-64 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-custom-s disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleWithdrawRequest}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-base sm:text-lg uppercase">
                    Withdrawing...
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg uppercase">
                  Withdraw Request
                </span>
              )}
            </button>
          )}
          {requestStatus === "received" && (
            <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                className="rejectButton flex justify-center items-center gap-3 w-full sm:w-48  bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-custom-s"
                onClick={() => handleRejectRequest(requestId)}
              >
                <span className="text-base sm:text-lg uppercase">Reject</span>
                <div className="p-1 border border-primary-dark bg-primary-silver rounded-full">
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                </div>
              </button>
              <button
                type="button"
                className="acceptButton flex justify-center items-center gap-3 w-full sm:w-48  bg-green-500 hover:bg-green-700 text-primary-dark font-bold py-1 px-2 rounded-custom-s"
                onClick={() => handleAcceptRequest(requestId)}
              >
                <span className="text-base sm:text-lg uppercase">Accept</span>
                <div className="p-1 border border-primary-dark bg-primary-silver rounded-full">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                </div>
              </button>
            </div>
          )}
          {requestStatus === "friends" && (
            <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                className="messageButton flex justify-center items-center gap-2 w-full sm:w-48 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-custom-s"
                onClick={handleMessage}
              >
                <span className="text-base sm:text-lg uppercase">Message</span>
              </button>
              <button
                type="button"
                className="unfriendButton flex justify-center items-center gap-2 w-full sm:w-48 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-custom-s disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUnfriend}
                disabled={sendingRequest}
              >
                {sendingRequest ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-base sm:text-lg uppercase">
                      Unfriending...
                    </span>
                  </>
                ) : (
                  <span className="text-base sm:text-lg uppercase">
                    Unfriend
                  </span>
                )}
              </button>
            </div>
          )}
          {/* Bio section - responsive */}
          <p className="bio px-3 py-2 sm:px-4 w-full md:w-2/3 border-2 border-primary-silver text-primary-silver rounded-custom-xs text-sm sm:text-base truncate">
            BIO: {userData.bio || "No bio available"}
          </p>
        </div>

        {/* Skills section - responsive */}
        <div className="second flex justify-center">
          <div className="skills w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-primary-silver px-2 py-1 sm:px-4 rounded-custom-xs">
            <p className="text-primary-dark font-bold text-sm sm:text-base">
              Skills:{" "}
            </p>
            <ul className="flex gap-2 flex-wrap py-1 sm:py-2">
              {userSkills && userSkills.length > 0 ? (
                userSkills.slice(0, 10).map((skill) => (
                  <li
                    className={`${skillBadgeStyle} text-xs sm:text-sm`}
                    key={skill}
                  >
                    {skill}
                  </li>
                ))
              ) : (
                <li className="text-primary-dark text-xs sm:text-sm">
                  No skills listed
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
