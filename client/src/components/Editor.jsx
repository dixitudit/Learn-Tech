import React, { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";

// Editor is an uncontrolled React component
const Editor = forwardRef(({ defaultValue }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;
