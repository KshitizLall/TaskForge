import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfinitySpin } from "react-loader-spinner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setSubmitting, isSetSubmitting] = useState();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { username, password }
      );
      toast.success("Login Successful");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("Connection error. Please try again later.");
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      isSetSubmitting(false);
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
      <div className="relative z-10 max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-extrabold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Sign In
          </span>
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-200"
          onClick={handleLogin}
        >
          {setSubmitting ? (
            <InfinitySpin
              visible={true}
              width="200"
              color="#4fa94d"
              ariaLabel="infinity-spin-loading"
            />
          ) : (
            "Sign In"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
