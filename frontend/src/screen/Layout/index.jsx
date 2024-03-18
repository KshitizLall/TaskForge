import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";

export const Layout = () => {
  const user = ""; // You can put your user state logic here

  const location = useLocation();

  return (
    <>
      {user ? (
        <div className="w-full h-screen flex flex-col md:flex-row">
          <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
            {/* Sidebar */}
          </div>

          <div className="p-4 2xl:px-10">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to="/signin" replace />
      )}
    </>
  );
};
