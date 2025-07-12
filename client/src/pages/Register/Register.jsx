import logo from "@/assets/images/oof-logo.png";
import axiosInstance from "@/config/axios";
import { strongPasswordRegex, userNameRegex } from "@/config/regex";
import { getErrorMessage } from "@/utils/common";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  const registerValidationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, "❗First name must be at least 3 characters")
      .required("❗Required"),
    lastName: Yup.string()
      .min(3, "❗Last name must be at least 3 characters")
      .required("❗Required"),
    username: Yup.string()
      .matches(
        userNameRegex,
        "❗Username must be at least 3 characters long and can only contain letters, numbers, and underscores",
      )
      .required("❗Required"),
    email: Yup.string().email("❗Invalid email address").required("❗Required"),
    password: Yup.string()
      .min(6, "❗Password must be at least 6 characters")
      .matches(
        strongPasswordRegex,
        "❗Password must contain an uppercase letter, a lowercase letter, and a symbol",
      )
      .required("❗Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "❗Passwords must match")
      .required("❗Required"),
  });

  const handleSubmit = async (values) => {
    const userData = {
      first_name: values.firstName,
      last_name: values.lastName,
      user_name: values.username,
      email: values.email,
      password: values.password,
    };

    try {
      const user = await axiosInstance.post("/user/register", userData);
      const firstName = user.data?.data?.user?.firstName || values.firstName;
      toast.success(`🎉 Registration successful! Welcome, ${firstName}!`);
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div className="font-primary w-full min-h-screen flex justify-center items-center bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken">
      <div className="bg-secondary-dark border-2 border-primary-silver min-w-[350px] w-2/3 max-w-[600px] rounded-custom-s">
        <div className="w-full px-10 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="logo" width={"148px"} height={"60px"} />
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 my-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                    <div>
                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                    <div>
                      <Field
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                    <div>
                      <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                    <div>
                      <Field
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1 font-semibold"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-silver w-full text-secondary-dark text-md uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="bg-primary-silver w-full text-secondary-dark text-md uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
