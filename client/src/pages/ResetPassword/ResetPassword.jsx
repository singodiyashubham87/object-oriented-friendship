import logo from "@/assets/images/oof-logo.png";
import { authAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/common";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    toast.error("Invalid reset link. Please request a new one.");
    navigate("/forgot-password");
    return null;
  }

  const resetPasswordValidationSchema = Yup.object({
    password: Yup.string()
      .min(8, "❗Password must be at least 8 characters")
      .matches(/[a-z]/, "❗Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "❗Must contain at least one uppercase letter")
      .matches(/[0-9]/, "❗Must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "❗Must contain at least one special character",
      )
      .required("❗Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "❗Passwords must match")
      .required("❗Please confirm your password"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authAPI.resetPassword({
        token,
        password: values.password,
      });

      toast.success("🎉 Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      if (
        ["expired", "invalid", "used"].some((word) => errorMsg.includes(word))
      ) {
        toast.error(
          "Reset link has expired or is invalid. Please request a new one.",
        );
        setTimeout(() => navigate("/forgot-password"), 2000);
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
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
            Reset Password
          </h1>
          <p className="text-secondary-silver text-sm text-center">
            Enter your new password below.
          </p>

          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 my-4">
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="New Password"
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
                    placeholder="Confirm New Password"
                    className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-silver w-full text-secondary-dark text-base uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
