import Loader from "@/components/Loader";
import { userAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Field, Form, Formik } from "formik";
import { get } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_PROFILE_PIC_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const FALLBACK_IMAGE =
  "https://imgs.search.brave.com/KrIBfwcMYTw5y8uMbjRLirmXFrIp_8-pxvdzPQ6-VX4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGljanVt/Ym8uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9nb3JnZW91cy1z/dW5zZXQtb3Zlci10/aGUtc2VhLWZyZWUt/aW1hZ2UuanBlZz9o/PTgwMCZxdWFsaXR5/PTgw";

const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .optional()
    .test(
      "firstName-validation",
      "Only letters are allowed in first name",
      (value) => !value || /^[a-zA-Z]+$/.test(value),
    ),
  lastName: Yup.string()
    .optional()
    .test(
      "lastName-validation",
      "Only letters are allowed in last name",
      (value) => !value || /^[a-zA-Z]+$/.test(value),
    ),
  gender: Yup.string()
    .optional()
    .test(
      "gender-validation",
      "Gender must be male or female",
      (value) => !value || /^(male|female|Male|Female)$/.test(value),
    ),
  age: Yup.number()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return value;
    })
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
  phone: Yup.string()
    .optional()
    .test(
      "phone-validation",
      "Phone number must be exactly 10 digits",
      (value) => !value || /^\d{10}$/.test(value),
    ),
  location: Yup.string()
    .optional()
    .test(
      "location-validation",
      "Only letters are allowed in location",
      (value) => !value || /^[a-zA-Z\s]+$/.test(value),
    ),
});

const Profile = () => {
  const transitionStyle = "ease-in-out transition-transform duration-1000";
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const initialFormValues = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    gender: userData?.gender || "",
    age: userData?.age || "",
    phone: userData?.phone || "",
    location: userData?.location || "",
  };

  const genderOptionsArray = [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "Male" },
    { label: " Female", value: "Female" },
  ];

  const hasNoSocialLinks = Object.values(socialLinks).every((link) => !link);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await userAPI.getCurrentUser();
        const user = get(res, "data.data.user", null);
        setUserData(user);
        setSkills(user?.skills || []);
        setSocialLinks(
          user?.socialLinks || {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
          },
        );
      } catch (error) {
        toast.error(`Failed to load profile: ${getErrorMessage(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async (values) => {
    try {
      await profileSchema.validate(values, { abortEarly: false });

      const hasValues = Object.values(values).some((value) => value !== "");
      if ((hasValues || skills.length > 0) && userData?.id) {
        await updateUserData(values, skills, socialLinks);
        setIsEditable(false);
      }
    } catch (validationErrors) {
      for (const err of validationErrors.inner) {
        toast.error(err.message);
        return;
      }
    }
  };

  const updateUserData = async (values, updatedSkills, updatedSocialLinks) => {
    try {
      const updatePayload = {};

      // Only include changed fields
      if (values.firstName && values.firstName !== userData.firstName) {
        updatePayload.first_name = values.firstName;
      }
      if (values.lastName && values.lastName !== userData.lastName) {
        updatePayload.last_name = values.lastName;
      }
      if (values.gender && values.gender !== userData.gender) {
        updatePayload.gender = values.gender;
      }
      if (values.age && values.age !== userData.age) {
        updatePayload.age = Number.parseInt(values.age);
      }
      if (values.phone && values.phone !== userData.phone) {
        updatePayload.phone = values.phone;
      }
      if (values.location && values.location !== userData.location) {
        updatePayload.location = values.location;
      }

      // Check if skills have changed
      const skillsChanged =
        JSON.stringify(updatedSkills.sort()) !==
        JSON.stringify((userData.skills || []).sort());
      if (skillsChanged) {
        updatePayload.skills = updatedSkills;
      }

      // Check if social links have changed
      const socialLinksChanged =
        JSON.stringify(updatedSocialLinks) !==
        JSON.stringify(userData.socialLinks || {});
      if (socialLinksChanged) {
        updatePayload.social_links = updatedSocialLinks;
      }

      if (Object.keys(updatePayload).length === 0) {
        toast.info("No changes to update");
        return;
      }

      const res = await userAPI.updateUser(userData.id, updatePayload);
      const updatedUser = get(res, "data.data.user", null);

      if (updatedUser) {
        setUserData(updatedUser);
        setSkills(updatedUser.skills || []);
        setSocialLinks(updatedUser.socialLinks || {});
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to update profile: ${getErrorMessage(error)}`);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedSkill = skillInput.trim();
      if (trimmedSkill && !skills.includes(trimmedSkill)) {
        setSkills([...skills, trimmedSkill]);
        setSkillInput("");
      } else if (skills.includes(trimmedSkill)) {
        toast.warning("Skill already added");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    // Prevent comma from being entered in the input
    if (value.includes(",")) {
      const trimmedSkill = value.replace(",", "").trim();
      if (trimmedSkill && !skills.includes(trimmedSkill)) {
        setSkills([...skills, trimmedSkill]);
        setSkillInput("");
      }
    } else {
      setSkillInput(value);
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_PROFILE_PIC_TYPES.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    try {
      setIsUploadingImage(true);
      const uploadRes = await userAPI.uploadAvatar(file);
      const imageUrl = get(uploadRes, "data.data.url", null);

      if (!imageUrl) {
        toast.error("Failed to get image URL from upload response");
        return;
      }

      const updateRes = await userAPI.updateUser(userData.id, {
        avatar: imageUrl,
      });
      const updatedUser = get(updateRes, "data.data.user", null);

      if (updatedUser) {
        setUserData(updatedUser);
        setPreviewImage(null);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to upload image: ${getErrorMessage(error)}`);
      setPreviewImage(null);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return (
      <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
        <p className="text-primary-silver text-2xl text-center">
          Failed to load profile data
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <div className="flex justify-center h-1/5 ">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Profile
        </h2>
      </div>

      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSave}
        enableReinitialize
      >
        <Form className="w-full flex flex-col flex-grow justify-center items-center px-4 py-6 gap-10 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center  p-10 w-full min-h-[16rem] flex-col md:flex-row gap-10">
            <div className="relative w-64 aspect-square bg-white flex items-center justify-center rounded-custom-s border-2 border-primary-dark">
              <img
                src={previewImage || userData.avatar || FALLBACK_IMAGE}
                alt="Profile"
                className="w-full h-full object-contain"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-custom-s">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute z-100 top-[-5%] right-[-5%] bg-tertiary-silver p-2 border border-primary-dark shadow-md rounded-full cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HugeiconsIcon icon={PencilEdit01Icon} className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-custom-s bg-dark-glassmorphism-50 flex-1 w-full max-h-[500px] overflow-y-auto flex flex-col gap-4">
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              />

              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              />

              <Field
                as="select"
                name="gender"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              >
                {genderOptionsArray.map(({ label, value }) => (
                  <option
                    value={value}
                    key={value}
                    className="bg-primary-silver text-primary-dark font-semibold"
                  >
                    {label}
                  </option>
                ))}
              </Field>

              <Field
                type="number"
                name="age"
                placeholder="Age"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              />

              <Field
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              />

              <Field
                type="text"
                name="location"
                placeholder="Location"
                className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                disabled={!isEditable}
              />

              {/* Skills Section */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {skills.length === 0 && !isEditable ? (
                    <span className="text-primary-silver opacity-50 italic">
                      No skills listed
                    </span>
                  ) : (
                    skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3 py-1 bg-primary-silver-20 border border-primary-silver rounded-full text-secondary-silver font-medium"
                      >
                        <span>{skill}</span>
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {isEditable && (
                  <input
                    type="text"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyDown={handleAddSkill}
                    placeholder="Add skills (press Enter or comma)"
                    className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                  />
                )}
              </div>

              {/* Social Links Section */}
              <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-primary-silver font-semibold text-sm uppercase tracking-wide">
                  Social Links
                </h3>
                {!isEditable ? (
                  /* Display mode - show clickable links */
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.github && (
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary-silver-20 hover:bg-primary-silver-30 border border-primary-silver rounded-custom-xs text-secondary-silver font-medium transition-all hover:scale-105"
                      >
                        <FaGithub size={18} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {socialLinks.linkedin && (
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary-silver-20 hover:bg-primary-silver-30 border border-primary-silver rounded-custom-xs text-secondary-silver font-medium transition-all hover:scale-105"
                      >
                        <FaLinkedin size={18} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary-silver-20 hover:bg-primary-silver-30 border border-primary-silver rounded-custom-xs text-secondary-silver font-medium transition-all hover:scale-105"
                      >
                        <FaTwitter size={18} />
                        <span>Twitter</span>
                      </a>
                    )}
                    {socialLinks.website && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary-silver-20 hover:bg-primary-silver-30 border border-primary-silver rounded-custom-xs text-secondary-silver font-medium transition-all hover:scale-105"
                      >
                        <FaGlobe size={18} />
                        <span>Website</span>
                      </a>
                    )}
                    {hasNoSocialLinks && (
                      <span className="text-primary-silver opacity-50 italic text-sm">
                        No social links added
                      </span>
                    )}
                  </div>
                ) : (
                  /* Edit mode - show input fields */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* GitHub */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="github-input"
                        className="text-secondary-silver text-xs opacity-70"
                      >
                        GitHub
                      </label>
                      <input
                        id="github-input"
                        type="url"
                        value={socialLinks.github || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("github", e.target.value)
                        }
                        placeholder="https://github.com/username"
                        className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                        disabled={!isEditable}
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="linkedin-input"
                        className="text-secondary-silver text-xs opacity-70"
                      >
                        LinkedIn
                      </label>
                      <input
                        id="linkedin-input"
                        type="url"
                        value={socialLinks.linkedin || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                        disabled={!isEditable}
                      />
                    </div>

                    {/* Twitter */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="twitter-input"
                        className="text-secondary-silver text-xs opacity-70"
                      >
                        Twitter
                      </label>
                      <input
                        id="twitter-input"
                        type="url"
                        value={socialLinks.twitter || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                        placeholder="https://twitter.com/username"
                        className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                        disabled={!isEditable}
                      />
                    </div>

                    {/* Website */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="website-input"
                        className="text-secondary-silver text-xs opacity-70"
                      >
                        Website
                      </label>
                      <input
                        id="website-input"
                        type="url"
                        value={socialLinks.website || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("website", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                        className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-12 self-end w-full">
            <button
              type="button"
              className={`px-6 py-2 font-semibold text-primary-silver bg-primary-silver-20 hover:text-primary-dark hover:bg-primary-silver rounded-lg uppercase ${transitionStyle} transition-colors ${
                isEditable && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => setIsEditable(true)}
              disabled={isEditable}
            >
              Edit
            </button>
            <button
              type="submit"
              className={`px-6 py-2 font-semibold text-primary-silver bg-primary-silver-20 hover:text-primary-dark hover:bg-primary-silver rounded-lg uppercase ${transitionStyle} transition-colors ${
                !isEditable ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isEditable}
            >
              Save
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Profile;
