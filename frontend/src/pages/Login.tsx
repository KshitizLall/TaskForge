import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setAuthToken } from "../utils/auth-utils";

// Type definition
interface LoginFormInputs {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    rememberMe: yup.boolean().required(),
  });

  // React Hook Form setup
  const { 
    control, 
    handleSubmit, 
    setError, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login", 
        new URLSearchParams({
          username: data.username,
          password: data.password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      const { token, user } = response.data;

      // Store token and user data
      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem("rememberMe", data.username);
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Success notification and navigation
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      // Handle login error
      const errorMessage = 
        axios.isAxiosError(error) 
          ? error.response?.data?.message || "Login failed"
          : error instanceof Error 
            ? error.message 
            : "Login failed";
      
      // Set form-level error
      setError("root", { 
        type: "manual", 
        message: errorMessage 
      });
      
      toast.error(errorMessage);
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Streamlined Workflows</h3>
                <p className="text-gray-600">Focus on what matters with our intuitive interface.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Enterprise Security</h3>
                <p className="text-gray-600">Your data is protected with industry-leading standards.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Rapid Deployment</h3>
                <p className="text-gray-600">Get up and running in minutes, not days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-medium text-gray-800">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form using React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              {/* Username field */}
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      autoComplete="username"
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Enter your username"
                    />
                  )}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="••••••••"
                    />
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  )}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit error message */}
            {errors.root && (
              <div className="text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                {errors.root.message}
              </div>
            )}

            {/* Submit button */}
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Register link */}
            <div className="text-center pt-2">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Create account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;