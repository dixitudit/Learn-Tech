import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import QuillEditor from "../components/QuillEditor";
export default function CreatePost() {
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageBuffer, setImageBuffer] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleUpload = (e) => {
    if (!imageBuffer) return;
    setImageFile(imageBuffer);
  };

  useEffect(() => {
    const uploadImage = () => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      if (imageFile.type.split('/')[0]!=="image") {
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
          console.log(
            "uploading"
          );
        },
        (error) => {
          console.log("error", error.message);
          setImageFileUploadError('Upload failed, please try again later');

          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setImageFileUploading(false);
            setImageFileUploadError(null);
            setFormData({...formData, image: downloadURL})
          });
        }
      );
    };
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="p-3 max-w-3xl mx-auto space-y-2 min-h-screen">
      <div className="text-center text-3xl mb-7 font-semibold">
        Create a Post
      </div>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />

          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          {!imageFile || imageFileUploading  ? (
            <>
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
                {imageFileUploading && <>
                  <Spinner size="sm" />
                </>}
                <span className="mx-2">Upload Image</span>
              </Button>
            </>
          ) : (
            <img
              src={imageFileUrl}
              alt="uploaded"
              className="w-full h-[400px]"
            />
          )}
        </div>
        {imageFileUploadError && (
          <Alert type="error" color="failure" className="text-center">
            {imageFileUploadError}
          </Alert>
        )}
        {/* below uses some javascript depricated functions so alternatively we have used Quill dependency but snow theme is taken from react-quill so both dependency should be installed */}
        {/* <ReactQuill theme="snow" placeholder="Write something..." className="h-72 mb-12"/> */}

        <QuillEditor required />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          pill
          className="w-full mb-8"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}
