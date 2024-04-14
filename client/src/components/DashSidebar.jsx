import React from "react";
import { Sidebar } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiMail,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar({ active }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signOut());
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Sidebar className="w-full sm:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={active === "dash" || !active}
                  className="cursor-pointer"
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={active === "profile"}
              className="cursor-pointer"
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={active === "posts"}
                  className="cursor-pointer"
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
            </>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={active === "users"}
                  className="cursor-pointer"
                  icon={HiUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
            </>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={active === "comments"}
                  className="cursor-pointer"
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            active={active === "signout"}
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
