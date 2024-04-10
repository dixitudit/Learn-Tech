import React from "react";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import QuillEditor from "../components/QuillEditor";
export default function CreatePost() {
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
          <FileInput type="file" id="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>

        {/* below uses some javascript depricated functions so alternatively we have used Quill dependency but snow theme is taken from react-quill so both dependency should be installed */}
        {/* <ReactQuill theme="snow" placeholder="Write something..." className="h-72 mb-12"/> */}
        
          <QuillEditor required/>
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
