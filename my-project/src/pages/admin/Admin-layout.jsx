import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { School } from "lucide-react";
import AdminMenu from "../../components/admin/admin-menu";
import Navbar from "../../components/admin/navbar";

function AdminLayout() {
  return (
    <div className=" flex mr-2">
      {/* LEFT */}
      <div className="w-[10%] md:w-[10%] lg:w-[16%] xl:w-[16%] p-2 ">
        <Link href="/" className="flex items-center gap-3 mx-2 my-1 ">
          <School size={30} color="#7ac2e1" strokeWidth={2} />
          <span className="font-bold text-lg hidden lg:block mt-1">
            SchoolStuff
          </span>
        </Link>
        <AdminMenu />
      </div>
      {/* right */}
      <div className=" bg-[#f7f7fa] min-h-screen w-[90%] md:w-[90%] lg:w-[84%] xl:w-[84%]  flex flex-col">
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
