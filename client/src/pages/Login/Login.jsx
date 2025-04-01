import logo from "@/assets/images/oof-logo.png";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();

  const loginValidationSchema = Yup.object({
    email: Yup.string().email("❗Invalid email address").required("❗Required"),
    password: Yup.string().required("❗Required"),
  });

  const handleSubmit = (values) => {
    console.log("Form values", values);
    navigate("/");
  };

  return (
    <div className="font-primary w-full min-h-screen flex justify-center items-center bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken">
      <div className="bg-secondary-dark border-2 border-primary-silver min-w-[350px] w-1/3 max-w-[400px] rounded-custom-s">
        <div className="w-full px-10 py-12 flex flex-col items-center gap-4">
          <img src={logo} alt="logo" width={"148px"} height={"60px"} />
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
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
                <button
                  type="submit"
                  disabled={isSubmitting}
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

export default Login;
