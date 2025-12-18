import defaultAvatar from "@/assets/images/userAvatar.png";
import React from "react";

const UserAvatar = ({ avatarUrl, classNames = "", alt = "User avatar" }) => {
  const avatarSrc = avatarUrl || defaultAvatar;

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <div
      className={`w-20 md:w-24 border-2 border-primary-gray-30 overflow-hidden rounded-full ${classNames}`}
    >
      <img
        src={avatarSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    </div>
  );
};

export default UserAvatar;
