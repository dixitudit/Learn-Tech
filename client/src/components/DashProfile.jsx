import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import { set } from "mongoose";

export default function DashProfile() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const filePickerRef = useRef();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser?.profilePic);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if (imageFileUploading) {
      setUpdateUserError(
        "Please wait for the image to upload before submitting the form"
      );
      return;
    }
    dispatch(updateStart());
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Please fill out the form to update your profile");
      return;
    }

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setImageFileUploadProgress(null);
        setUpdateUserSuccess("User Profile Updated Successfully!");
        setUpdateUserError(null);
      }
    } catch (err) {
      dispatch(updateFailure(err.message));
      setUpdateUserError(err.message);
    }
  };

  useEffect(() => {
    const uploadImage = () => {
      setImageFileUploading(true);
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
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePic: downloadURL });
            setImageFileUploading(false);
          });
        }
      );
    };
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    dispatch(deleteStart());
    try{
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteFailure(data.message));
      }
      else {
        dispatch(deleteSuccess());
      }
    }
    catch(err){

    }

  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 font-semibold text-3xl text-center ">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          id="profilePic"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
          ref={filePickerRef}
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className="w-32 h-32 relative self-center cursor-pointer overflow-hidden shadow-[0_0_4px_3px_#eee] rounded-full"
        >
          {/* // object cover is used to make the image fit the container and maintain aspect ratio */}
          {/* <label htmlFor="profilePic"> */}
          <img
            src={imageFileUrl || currentUser?.profilePic}
            alt="profile"
            //instead of using useRef we can use label tag as commented above we have used useRef hook to just understand the concept

            className={`w-full h-full object-cover border-2 border-[lightgray] opacity-${
              imageFileUploadProgress && imageFileUploadProgress < 100
                ? 50
                : 100
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
          onChange={handleChange}
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          defaultValue={currentUser?.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          pill
          className={`${imageFileUploading ? "cursor-not-allowed" : ""}`}
        >
          Update
        </Button>
      </form>
      <div className="flex justify-between">
        <div
          onClick={() => setShowModal(true)}
          className="text-sm p-2 text-red-500 cursor-pointer"
        >
          Delete Account
        </div>
        <div className="text-sm p-2 text-gray-500 cursor-pointer">Sign out</div>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
      {showModal && (
        <Modal
          show={showModal}
          popup
          size={"md"}
          onClose={() => setShowModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="p-5">
              <h1 className="text-xl font-semibold text-center text-gray-600">
                <HiOutlineExclamationCircle className="text-red-500 text-5xl mx-auto" />
                Are you sure you want to permanently DELETE your account?
              </h1>
              <div className="flex justify-between gap-4 mt-5">
                <Button
                  gradientMonochrome="failure"
                  pill
                  onClick={handleDeleteUser}
                >
                  Yes, I'm sure
                </Button>
                <Button
                  gradientDuoTone="purpleToBlue"
                  pill
                  onClick={() => setShowModal(false)}
                >
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
