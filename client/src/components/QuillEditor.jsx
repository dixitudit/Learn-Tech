import React, { useState } from "react";
import Editor from "./Editor";
import Quill from "quill";

const Delta = Quill.import("delta");

export default function QuillEditor() {
    const quillRef = React.useRef();
  return (
      <Editor
        ref={quillRef}
        defaultValue={new Delta()
          .insert("Write something...")
          .insert("\n", { header: 1 })}
      />
  );
}
