import logo from "@/assets/images/oof-logo.png";
import { authAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

const FORGOT_PASSWORD_REDIRECT_DELAY = 3000;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
      .email("❗Must be a valid email")
      .required("❗Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await authAPI.forgotPassword({ email: values.email });
      toast.success(
        response.data?.data?.message ||
          "If an account exists, you will receive a reset link.",
      );

      setTimeout(() => navigate("/login"), FORGOT_PASSWORD_REDIRECT_DELAY);
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-primary w-full min-h-screen flex justify-center items-center bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken">
      <div className="bg-secondary-dark border-2 border-primary-silver min-w-[350px] w-1/3 max-w-[400px] rounded-custom-s">
        <div className="w-full px-10 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="logo" width={"148px"} height={"60px"} />
          <h1 className="text-primary-silver font-bold text-xl">
            Forgot Password?
          </h1>
          <p className="text-secondary-silver text-sm text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <p className="text-secondary-silver text-sm text-center">
            Note: The reset link may go to spam folder.
          </p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 my-4">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-silver w-full text-secondary-dark text-base uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-primary-silver text-sm font-semibold hover:underline"
                >
                  ← Back to Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
