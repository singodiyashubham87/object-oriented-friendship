import Loader from "@/components/Loader";
import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import { requestAPI, userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { REQUEST_STATUS } from "@/utils/constants";
import { get } from "lodash-es";
import React, { useEffect, useState } from "react";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { userId } = useParams();
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
      setRequestStatus(relationshipStatus);
      setRequestId(user?.requestId || null);
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
      await requestAPI.cancelRequest(userId);
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

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl text-center">
          User not found
        </p>
      </div>
    );
  }

  const userSkills = userData.skills || [];
  const fullName = `${userData.firstName} ${userData.lastName || ""}`.trim();

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          User Profile
        </h2>
      </div>
      <div className="w-full h-4/5 flex flex-col flex-grow justify-center flex-wrap px-4 my-6 gap-6 overflow-y-auto overflow-x-hidden">
        <div className="flex justify-evenly gap-4">
          <div className="relative w-64 h-64 aspect-square bg-white flex items-center justify-center rounded-custom-s border-2 border-primary-silver">
            <img
              src={
                userData.avatar ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}`
              }
              alt="Profile"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="userInfoAndSocials w-2/3 flex justify-between gap-4 p-8 relative bg-dark-glassmorphism-50 border-2 border-primary-silver rounded-custom-s">
            <div className="userInfo flex flex-col gap-3">
              <h3 className="text-2xl leading-5 text-primary-silver font-bold">
                {fullName}
              </h3>
              {userData.location && (
                <div className="location flex gap-2 items-center">
                  <LocationIcon width="16" height="17" />
                  <p className="text-[18px] text-primary-silver opacity-70 leading-5">
                    {userData.location}
                  </p>
                </div>
              )}
              {userData.age && userData.gender && (
                <p className="text-primary-silver">
                  {userData.age} years, {userData.gender}
                </p>
              )}
            </div>
            <div className="socials flex flex-col gap-2 justify-end">
              <a
                href={`mailto:${userData.email}`}
                className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
              >
                <MdEmail size={20} />
                <span>Email</span>
              </a>
              {userData.socialLinks?.github && (
                <a
                  href={userData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
                >
                  <FaGithub size={20} />
                  <span>Github</span>
                </a>
              )}
              {userData.socialLinks?.linkedin && (
                <a
                  href={userData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
                >
                  <FaLinkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
              {userData.socialLinks?.twitter && (
                <a
                  href={userData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
                >
                  <FaTwitter size={20} />
                  <span>Twitter</span>
                </a>
              )}
              {userData.socialLinks?.website && (
                <a
                  href={userData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
                >
                  <FaGlobe size={20} />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="first flex justify-evenly items-center gap-4 ">
          {requestStatus === "none" && (
            <button
              type="button"
              className="connectButton flex justify-center items-center gap-4 w-64 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-custom-s disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendRequest}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xl uppercase">Sending...</span>
                </>
              ) : (
                <span className="text-xl uppercase">Send Request</span>
              )}
            </button>
          )}
          {requestStatus === "sent" && (
            <button
              type="button"
              className="withdrawButton flex justify-center items-center gap-4 w-64 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-custom-s disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleWithdrawRequest}
              disabled={sendingRequest}
            >
              {sendingRequest ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xl uppercase">Withdrawing...</span>
                </>
              ) : (
                <span className="text-xl uppercase">Withdraw Request</span>
              )}
            </button>
          )}
          {requestStatus === "received" && (
            <div className="flex gap-4">
              <button
                type="button"
                className="rejectButton flex justify-center items-center gap-4 w-64 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-custom-s"
                onClick={() => handleRejectRequest(requestId)}
              >
                <span className="text-xl uppercase">Reject</span>
                <div className="p-sm border border-primary-dark bg-primary-silver rounded-full">
                  <RejectRequestIcon size="18" />
                </div>
              </button>
              <button
                type="button"
                className="acceptButton flex justify-center items-center gap-4 w-64 bg-green-500 hover:bg-green-700 text-primary-dark font-bold py-2 px-4 rounded-custom-s"
                onClick={() => handleAcceptRequest(requestId)}
              >
                <span className="text-xl uppercase">Accept</span>
                <div className="p-sm border border-primary-dark bg-primary-silver rounded-full">
                  <AcceptRequestIcon size="18" />
                </div>
              </button>
            </div>
          )}
          {requestStatus === "friends" && (
            <div className="text-primary-silver text-xl">
              ✓ Already connected
            </div>
          )}
          <p className="bio px-4 w-2/3 border-2 border-primary-silver text-primary-silver rounded-custom-xs">
            BIO: {userData.bio || "No bio available"}
          </p>
        </div>

        <div className="second flex justify-evenly gap-4">
          <div className="skills w-full flex items-center gap-2 bg-primary-silver px-4 rounded-custom-xs">
            <p className="text-primary-dark font-bold leading-5">Skills: </p>
            <ul className="flex gap-2 flex-wrap py-2">
              {userSkills && userSkills.length > 0 ? (
                userSkills.slice(0, 10).map((skill) => (
                  <li className={skillBadgeStyle} key={skill}>
                    {skill}
                  </li>
                ))
              ) : (
                <li className="text-primary-dark">No skills listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
