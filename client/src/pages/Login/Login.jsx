import logo from "@/assets/images/oof-logo.png";
import { userNameRegex } from "@/config/regex";
import { authAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();

  const loginValidationSchema = Yup.object({
    usernameOrEmail: Yup.string()
      .required("❗Required")
      .test(
        "is-username-or-email",
        "❗Must be a valid email or username (at least 3 characters, letters, numbers, underscores)",
        (value) => {
          if (!value) return false;
          return (
            Yup.string().email().isValidSync(value) || userNameRegex.test(value)
          );
        },
      ),
    password: Yup.string().required("❗Required"),
  });

  const handleSubmit = async (values) => {
    const loginData = {
      username_or_email: values.usernameOrEmail,
      password: values.password,
      remember_me: values.rememberMe,
    };

    try {
      const response = await authAPI.login(loginData);
      const firstName = response.data?.data?.user?.firstName || "User";
      toast.success(`🎉 Welcome back, ${firstName}!`);
      navigate("/feed");
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    }
  };

  return (
    <div className="font-primary w-full min-h-screen flex justify-center items-center bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken">
      <div className="bg-secondary-dark border-2 border-primary-silver min-w-[350px] w-1/3 max-w-[400px] rounded-custom-s">
        <div className="w-full px-10 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="logo" width={"148px"} height={"60px"} />
          <Formik
            initialValues={{
              usernameOrEmail: "",
              password: "",
              rememberMe: false,
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 my-4">
                <div>
                  <Field
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Username or Email"
                    className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                  />
                  <ErrorMessage
                    name="usernameOrEmail"
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
                <div className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    className="w-4 h-4 cursor-pointer accent-primary-silver"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-secondary-silver font-semibold text-sm cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-silver w-full text-secondary-dark text-md uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-5 h-5 border-2 border-secondary-dark border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="bg-primary-silver w-full text-secondary-dark text-md uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-primary-silver text-sm font-semibold hover:underline mt-2"
                >
                  Forgot Password?
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
