import React from "react";

const TaskForge = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(210,204,255,1) 0%, rgba(208,190,255,1) 25%, rgba(255,230,235,1) 51%, rgba(255,205,206,1) 74%, rgba(211,220,255,1) 100%)",
      }}
      className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]"
    >
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Elevate Your Productivity!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-2xl md:text-4xl 2xl:text-4xl font-black text-center text-[#33006F]">
              <span>Empower Your Day with</span>
            </p>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-[#720e9e]">
              <span> TaskForge</span>
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="w-full flex flex-col justify-center items-center">
          <form className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 rounded-lg shadow-md backdrop-blur-lg bg-opacity-10">
            <p className="text-[#33006F] text-3xl font-bold text-center">
              Welcome to TaskForge!
            </p>
            <p className="text-center text-base text-gray-700 ">
              Your Trusted Task Companion.
            </p>
            <input
              type="email"
              placeholder="Email"
              className="input-field backdrop-blur-lg bg-opacity-10"
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field backdrop-blur-lg bg-opacity-10"
            />
            <button className="btn-primary border border-r-2 bg-gradient-to-r from-[#2c9ef1] to-[#0070f3] hover:from-[#2680c2] hover:to-[#0056b3] text-white font-semibold py-2 px-4 rounded-md transition duration-300">
              Login
            </button>
            <div className="flex justify-center">
              <span className="text-sm text-gray-500 hover:text-[#33006F] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForge;
