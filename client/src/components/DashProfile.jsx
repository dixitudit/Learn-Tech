import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser?.profilePic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  useEffect(() => {
    const uploadImage = () => {
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError(
            "Failed to upload, file should be image file and must be less than 7MB"
          );
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
          });
        }
      );
    };
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 font-semibold text-3xl text-center ">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          // id="profilePic"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
          ref={filePickerRef}
        />
        <div onClick={() => filePickerRef.current.click()} className="w-32 h-32 relative self-center cursor-pointer overflow-hidden shadow-[0_0_4px_3px_#eee] rounded-full">
          {/* // object cover is used to make the image fit the container and maintain aspect ratio */}
          {/* <label htmlFor="profilePic"> */}
          <img
            src={imageFileUrl || currentUser?.profilePic}
            alt="profile"
            //instead of using useRef we can use label tag as commented above we have used useRef hook to just understand the concept
            
            className={`w-full h-full object-cover border-2 border-[lightgray] opacity-${
              imageFile && imageFileUploadProgress < 100 ? 50 : 100
            }`}
          />
          {/* </label> */}
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,190, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
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
        <div className="text-sm p-2 text-red-500 cursor-pointer">
          Delete Account
        </div>
        <div className="text-sm p-2 text-gray-500 cursor-pointer">Sign out</div>
      </div>
    </div>
  );
}
