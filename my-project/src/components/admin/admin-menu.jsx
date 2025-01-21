import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  House,
  UsersRound,
  IdCard,
  ChartNoAxesCombined,
  UserCheck,
  CalendarDays,
  CircleUser,
  LogOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth, logoutUser } from "../../services/user";
import { message } from "antd";

function AdminMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["authStatus"]);
      navigate("/auth/login", { replace: true });
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đăng xuất."
      );
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();

    logoutMutation.mutate();
  };

  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: <House color="#1f2937" size={20} />,
          label: "Home",
          to: "/list/home",
        },
        {
          icon: <UsersRound size={20} />,
          label: "Students",
          to: "/list/students",
        },
        { icon: <IdCard size={20} />, label: "Classes", to: "/list/class" },
        {
          icon: <ChartNoAxesCombined size={20} />,
          label: "Finance",
          to: "/list/finance",
        },
        {
          icon: <UserCheck size={20} />,
          label: "Attendance",
          to: "/list/attendance",
        },
        {
          icon: <CalendarDays size={20} />,
          label: "Events",
          to: "/list/events",
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: <LogOut size={20} />,
          label: "Logout",
          to: "/auth/login",
          onClick: handleLogout,
        },
      ],
    },
  ];

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div className="gap-1 p-1">
      {menuItems.map((i) => (
        <div key={i.title}>
          <span className="hidden lg:block text-sm font-normal text-gray-500 my-3">
            {i.title}
          </span>
          {i.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col text-sm font-light my-1 mt-2 mx-2"
            >
              {item.label === "Logout" ? (
                <div
                  onClick={item.onClick}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {item.icon}
                  <span className="hidden lg:block font-normal text-gray-700">
                    {item.label}
                  </span>
                </div>
              ) : (
                <Link to={item.to} className="flex items-center gap-3">
                  {item.icon}
                  <span className="hidden lg:block font-normal text-gray-700">
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AdminMenu;
