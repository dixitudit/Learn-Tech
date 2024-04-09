import React from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 font-semibold text-3xl text-center ">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center">
          {/* // object cover is used to make the image fit the container and maintain aspect ratio */}
          <img
            src={currentUser?.profilePic}
            alt="profile"
            className="cursor-pointer overflow-hidden rounded-full w-full h-full object-cover border-2 border-[lightgray] shadow-[0_0_4px_3px_#eee]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline pill>
          Update
        </Button>
      </form>
      <div className="flex justify-between">
        <div className="text-sm p-2 text-red-500 cursor-pointer">Delete Account</div>
        <div className="text-sm p-2 text-gray-500 cursor-pointer">Sign out</div>
      </div>
    </div>
  );
}
