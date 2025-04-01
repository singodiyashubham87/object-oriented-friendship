import PencilIcon from "@/components/icons/PencilIcon";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

const imageSrc =
  "https://imgs.search.brave.com/KrIBfwcMYTw5y8uMbjRLirmXFrIp_8-pxvdzPQ6-VX4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGljanVt/Ym8uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9nb3JnZW91cy1z/dW5zZXQtb3Zlci10/aGUtc2VhLWZyZWUt/aW1hZ2UuanBlZz9o/PTgwMCZxdWFsaXR5/PTgw";

const profileSchema = Yup.object().shape({
  firstName: Yup.string().matches(
    /^[a-zA-Z]+$/,
    "Only letters are allowed in first name",
  ),
  lastName: Yup.string().matches(
    /^[a-zA-Z]+$/,
    "Only letters are allowed in last name",
  ),
  gender: Yup.string().matches(
    /^(male|female)$/,
    "Gender must be male or female",
  ),
  dateOfBirth: Yup.date().nullable().typeError("Please select a valid DOB"),
  phoneNumber: Yup.string().matches(
    /^\d{10}$/,
    "Phone number must be exactly 10 digits",
  ),
  country: Yup.string().matches(
    /^[a-zA-Z\s]+$/,
    "Only letters are allowed in country",
  ),
});

const Profile = () => {
  const transitionStyle = "ease-in-out transition-transform duration-1000";
  const [isEditable, setIsEditable] = useState(false);

  const genderOptionsArray = [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const handleSave = async (values) => {
    try {
      await profileSchema.validate(values, { abortEarly: false });

      const hasValues = Object.values(values).some((value) => value !== "");
      if (hasValues) {
        updateUserData(values);
        setIsEditable(false);
      }
    } catch (validationErrors) {
      for (const err of validationErrors.inner) {
        toast.error(err.message);
        return;
      }
    }
  };

  const updateUserData = (values) => {
    console.log("Updating user data with values:", values);
    // Simulate a PUT API request here
  };

  return (
    <div className="flex-grow flex flex-col justify-evenly items-center w-full h-11/12 bg-dark-glassmorphism-30 border-xs border-secondary-silver rounded-custom-s overflow-y-auto overflow-x-hidden px-6 py-6">
      <ToastContainer position="top-left" />
      <div className="flex justify-center h-1/5 ">
        <h2 className="text-4xl text-primary-silver font-bold uppercase">
          Profile
        </h2>
      </div>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          gender: "",
          dateOfBirth: "",
          phoneNumber: "",
          country: "",
        }}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {() => (
          <Form className="w-full flex flex-col flex-grow justify-center items-center px-4 py-6 gap-10 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center  p-10 w-full min-h-[16rem] flex-col md:flex-row gap-10">
              <div className="relative w-64 aspect-square bg-white flex items-center justify-center rounded-custom-s border-2 border-primary-dark">
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="w-full h-full object-contain"
                />
                <div className="absolute z-100 top-[-5%] right-[-5%] bg-tertiary-silver p-2 border border-primary-dark shadow-md rounded-full cursor-pointer hover:bg-white">
                  <PencilIcon size="20" />
                </div>
              </div>

              <div className="p-4 rounded-custom-s bg-dark-glassmorphism-50 flex-1 w-full h-full flex flex-grow flex-col gap-4 ">
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
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                  disabled={!isEditable}
                />

                <Field
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                  disabled={!isEditable}
                />

                <Field
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="px-2 py-1 rounded-custom-xs outline-none w-full text-secondary-silver font-semibold bg-transparent border-xs border-primary-silver"
                  disabled={!isEditable}
                />
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
        )}
      </Formik>
    </div>
  );
};

export default Profile;
