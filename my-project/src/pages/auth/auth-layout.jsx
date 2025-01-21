import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[30%]  bg-white rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
