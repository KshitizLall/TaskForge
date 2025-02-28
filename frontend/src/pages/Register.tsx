import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

// Validation schema using Yup (only the fields required by the API)
const registerSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Initial form values matching the API
const initialValues = {
  username: "",
  first_name: "",
  last_name: "",
  password: "",
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmissionError(null);

    try {
      const response = await fetch("http://localhost:3001/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
      setSubmissionError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Left side - Project Information */}
      <div className="w-1/2 flex flex-col justify-center px-16 text-gray-700">
        <div className="max-w-lg">
          <h1 className="text-4xl font-semibold mb-4 text-gray-800">Taskforge</h1>
          <p className="text-lg mb-8 text-gray-600">
            A minimalist platform designed for productivity and efficiency.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Streamlined Workflows</h3>
                <p className="text-gray-600">
                  Focus on what matters with our intuitive interface.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Enterprise Security</h3>
                <p className="text-gray-600">
                  Your data is protected with industry-leading standards.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Rapid Deployment</h3>
                <p className="text-gray-600">
                  Get up and running in minutes, not days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-gray-800">Create Account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Join us and start your journey
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="johndoe"
                    />
                    <ErrorMessage name="username" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Field
                        id="first_name"
                        name="first_name"
                        type="text"
                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="John"
                      />
                      <ErrorMessage name="first_name" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Field
                        id="last_name"
                        name="last_name"
                        type="text"
                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Doe"
                      />
                      <ErrorMessage name="last_name" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {submissionError && (
                  <div className="text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                    {submissionError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
