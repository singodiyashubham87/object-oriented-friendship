import AcceptRequestIcon from "@/components/icons/AcceptRequestIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import RejectRequestIcon from "@/components/icons/RejectRequestIcon";
import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const imageSrc =
  "https://imgs.search.brave.com/FYmsuChFcB46GmHEP9uO7qHz1b2vSK1YhJWr8s8m7sM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA3LzE4LzA0LzYz/LzM2MF9GXzcxODA0/NjM2NF9rWGtTWGJG/dVZHeHNBNXVxZFlj/S0Q5SllIMlVrTjVi/Ui5qcGc";
const UserProfile = () => {
  const userSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "ReactJS",
    "NodeJS",
    "ExpressJS",
  ];

  const skillBadgeStyle =
    "leading-5 bg-primary-dark px-2 py-1 rounded-custom-xxs text-primary-silver";

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
              src={imageSrc}
              alt="Profile"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="userInfoAndSocials w-2/3 flex justify-between gap-4 p-8 relative bg-dark-glassmorphism-50 border-2 border-primary-silver rounded-custom-s">
            <div className="userInfo flex flex-col gap-3">
              <h3 className="text-2xl leading-5 text-primary-silver font-bold">
                Shubham Singodiya
              </h3>
              <div className="location flex gap-2 items-center">
                <LocationIcon width="16" height="17" />
                <p className="text-[18px] text-primary-silver opacity-70 leading-5">
                  Karnataka, India
                </p>
              </div>
              <button
                type="button"
                className="py-[4px] px-[10px] text-primary-silver font-semibold text-sm rounded-full border-2 border-primary-silver hover:bg-primary-silver hover:text-primary-dark"
              >
                View Portfolio
              </button>
            </div>
            <div className="socials flex flex-col gap-2 justify-end">
              <a
                href="https://www.google.com"
                className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
              >
                <MdEmail size={20} />
                <span>Email</span>
              </a>
              <a
                href="https://www.google.com"
                className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
              >
                <FaGithubSquare size={20} />
                <span>Github</span>
              </a>

              <a
                href="https://www.google.com"
                className="text-primary-dark hover:text-primary-light flex gap-2 items-center justify-stretch px-2 py-1 bg-primary-gray rounded-custom-xs hover:scale-105 transition-transform duration-300"
              >
                <FaLinkedin size={20} />
                Linkedin
              </a>
            </div>
          </div>
          {/* </div> */}
        </div>

        <div className="first flex justify-evenly items-center gap-4 ">
          <button
            type="button"
            className="rejectButton flex justify-center items-center gap-4 w-64 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-custom-s"
          >
            <span className="text-xl uppercase">Reject</span>
            <div className="p-sm border border-primary-dark bg-primary-silver rounded-full">
              <RejectRequestIcon size="18" />
            </div>
          </button>
          <p className="bio px-4 w-2/3 border-2 border-primary-silver text-primary-silver rounded-custom-xs">
            BIO: Engineer by Choice!
          </p>
        </div>

        <div className="second flex justify-evenly gap-4">
          <button
            type="button"
            className="acceptButton flex justify-center items-center gap-4 w-64 bg-primary-light bg-green-500 hover:bg-green-700 text-primary-dark font-bold py-2 px-4 rounded-custom-s"
          >
            <span className="text-xl uppercase">Accept</span>
            <div className="p-sm border border-primary-dark bg-primary-silver rounded-full">
              <AcceptRequestIcon size="18" />
            </div>
          </button>
          <div className="skills w-2/3 flex items-center gap-2 bg-primary-silver px-4 rounded-custom-xs">
            <p className="text-primary-dark font-bold leading-5">Skills: </p>
            <ul className="flex gap-2">
              {userSkills && userSkills.length > 5
                ? userSkills.map((skill) => (
                    <li className={skillBadgeStyle} key={skill}>
                      {skill}
                    </li>
                  ))
                : userSkills.slice(0, 5)?.map((skill) => (
                    <li className={skillBadgeStyle} key={skill}>
                      {skill}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
