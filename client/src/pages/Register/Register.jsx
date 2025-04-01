import logo from "@/assets/images/oof-logo.png";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  // This regex will match passwords having at least one lowercase, one uppercase character and one symbol
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

  const registerValidationSchema = Yup.object({
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
    fullName: Yup.string().required("❗Required"),
  });

  const handleSubmit = (values) => {
    console.log("Form values", values);
    navigate("/login");
  };

  return (
    <div className="font-primary w-full min-h-screen flex justify-center items-center bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken">
      <div className="bg-secondary-dark border-2 border-primary-silver min-w-[350px] w-2/3 max-w-[400px] rounded-custom-s">
        <div className="w-full px-10 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="logo" width={"148px"} height={"60px"} />
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              fullName: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 my-4">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="EMAIL"
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
                    placeholder="PASSWORD"
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
                    placeholder="CONFIRM PASSWORD"
                    className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1 font-semibold"
                  />
                </div>
                <div>
                  <Field
                    name="fullName"
                    type="text"
                    placeholder="FULL NAME"
                    className="bg-transparent text-secondary-silver font-semibold text-s border-2 border-primary-silver p-2 pl-5 w-full rounded-custom-xs outline-none"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-silver w-full text-secondary-dark text-md uppercase font-semibold py-2 rounded-custom-xs border-2 border-primary-dark hover:border-primary-silver hover:text-primary-silver hover:bg-secondary-dark cursor-pointer"
                >
                  Register
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
