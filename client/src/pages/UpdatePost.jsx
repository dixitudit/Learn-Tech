import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  // console.log(postId);
  const navigate = useNavigate();
  // console.log(formData);

  const { currentUser } = useSelector((state) => state.user);

  const handleUpload = (e) => {
    if (!imageBuffer) return;
    setImageFile(imageBuffer);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?postId=${postId}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data.posts[0]);
          setImageFileUrl(data.posts[0].image);
          setPublishError(null);
        } else {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const uploadImage = () => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      if (imageFile.type.split("/")[0] !== "image") {
        setImageFileUploadError("Please upload an image file");
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(100 * (snapshot.bytesTransferred / snapshot.totalBytes));
        },
        (error) => {
          console.log("error", error.message);
          setImageFileUploadError("Upload failed, please try again later");

          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setImageFileUploading(false);
            setImageFileUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    };
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto space-y-2 min-h-screen">
      <div className="text-center text-3xl mb-7 font-semibold">Update Post</div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            className="flex-1"
            value={formData.title}
          />

          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            <option value="uncategorised">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className=" gap-4 items-center border-4 border-teal-500 border-dotted p-3">
          <div className="flex justify-between">
            <FileInput
              type="file"
              onChange={(e) => setImageBuffer(e.target.files[0])}
              id="file"
              accept="image/*"
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              onClick={handleUpload}
              className="flex items-center"
              disabled={imageFileUploading}
              outline
            >
              {imageFileUploading && (
                <>
                  <Spinner size="sm" />
                </>
              )}
              <span className="mx-2">Upload Image</span>
            </Button>
          </div>
          {imageFileUrl && !imageFileUploading && (
            <img
              src={imageFileUrl}
              alt="uploaded"
              className="w-full h-[400px] mt-3"
            />
          )}
        </div>

        {imageFileUploadError && (
          <Alert type="error" color="failure" className="text-center">
            {imageFileUploadError}
          </Alert>
        )}
        {/* below uses some javascript depricated functions so alternatively we have used Quill dependency but snow theme is taken from react-quill so both dependency should be installed */}
        <ReactQuill
          theme="snow"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          pill
          className="w-full mb-8"
        >
          Update Post
        </Button>
        {publishError && (
          <Alert type="error" color="failure" className="text-center">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
