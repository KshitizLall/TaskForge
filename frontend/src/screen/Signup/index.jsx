import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

const SignupPage = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
    gender: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/signup",
        values
      );
      toast.success("Signup Successful");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("Connection error. Please try again later.");
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(270deg, rgba(194,176,255,1) 0%, rgba(234,219,255,1) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-4xl w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-extrabold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Sign Up
          </span>
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-3 gap-4">
                {/* First Column */}
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="first_name"
                      name="first_name"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="last_name"
                      name="last_name"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <Field
                      as="select"
                      id="gender"
                      name="gender"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                {/* Second Column */}
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring-opacity-100 focus:ring-purple-200"
                    >
                      <option value="">Select your role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                {/* Third Column */}
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                      placeholder="Enter your username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-6 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <InfinitySpin
                        visible={true}
                        width="200"
                        color="#4fa94d"
                        ariaLabel="infinity-spin-loading"
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
