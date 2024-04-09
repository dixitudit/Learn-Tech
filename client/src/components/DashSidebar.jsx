import React from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashSidebar({ active }) {
  return (
    <Sidebar className="w-full sm:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={active === "profile"}
              className="cursor-pointer"
              icon={HiUser}
              label={"User"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            active={active === "signout"}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
