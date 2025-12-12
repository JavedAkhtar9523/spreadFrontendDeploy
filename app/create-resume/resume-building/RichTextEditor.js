"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Buttonborder } from "../../components/Button";
import "./RichTextEditor.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder,
  maxLength = 500,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(value || "", "text/html").body
      .textContent;
    setTempValue(value);
    setCharCount(decoded?.length || 0);
    console.log("Decoded content length:", decoded?.length || 0);
    console.log("Value content length:", (decoded || ""));
  }, [value]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "link",
    "align",
    "list",
    "bullet",
    "ordered"
  ];

  const handleQuillChange = (content, delta, source, editor) => {
    const plainText = editor.getText().replace(/\n/g, "").trim();
    const length = plainText.length;

    if (length > maxLength) {
      const quill = quillRef.current?.getEditor();
      const range = quill.getSelection(true);
      quill.deleteText(range.index - (length - maxLength), length - maxLength);
      setError(`Maximum ${maxLength} characters allowed`);
      setCharCount(maxLength);
      return;
    }

    setError("");
    setTempValue(content);
    setCharCount(length);
  };

  const handleKeyDown = (e) => {
    if (charCount >= maxLength && e.key.length === 1 && !e.metaKey) {
      e.preventDefault();
      setError(`Maximum ${maxLength} characters allowed`);
    }
  };

  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const newLength = charCount + paste.length;
    if (newLength > maxLength) {
      e.preventDefault();
      setError(`Maximum ${maxLength} characters allowed`);
    }
  };

  // const handleSave = () => {
  //   // Fix for unordered lists showing as numbers
  //   let cleanedContent = tempValue;
    
  //   // Ensure proper list styling with gray colors
  //   if (cleanedContent.includes('<ul>') || cleanedContent.includes('<ol>')) {
  //     cleanedContent = cleanedContent
  //       .replace(/<ul>/g, '<ul className="custom-unordered-list">')
  //       .replace(/<ol>/g, '<ol className="custom-ordered-list">')
  //       .replace(/<li>/g, '<li className="custom-list-item">');
        
  //   }
  //   console.log("Cleaned Content:", cleanedContent);
  //   const plainText = cleanedContent.replace(/<[^>]+>/g, "").trim();
  //   if (plainText.length === 0) {
  //     setError("Description cannot be empty");
  //     return;
  //   }
  //   onChange(cleanedContent);
  //   setIsEditing(false);
  // };

const handleSave = () => {
  let cleanedContent = tempValue;
  console.log("🧩 Original Content:", cleanedContent);

  // ✅ Step 1: Remove empty spans Quill injects
  cleanedContent = cleanedContent.replace(/<span[^>]*class="ql-ui"[^>]*><\/span>/gi, "");

  // ✅ Step 2: Convert bullet lists to <ul>
  cleanedContent = cleanedContent
    // Detect if list contains bullet-style items
    .replace(/<ol>([\s\S]*?data-list="bullet"[\s\S]*?)<\/ol>/gi, (match, group) => {
      return `<ul class="custom-unordered-list">${group}</ul>`;
    })
    // Step 3: Fix remaining <ol> for ordered lists
    .replace(/<ol[^>]*>/gi, '<ol class="custom-ordered-list">')
    // Step 4: Ensure all <li> have correct class
    .replace(/<li[^>]*>/gi, '<li class="custom-list-item">');

  console.log("🧩 Final Cleaned Content:", cleanedContent);

  const plainText = cleanedContent.replace(/<[^>]+>/g, "").trim();
  if (plainText.length === 0) {
    setError("Description cannot be empty");
    return;
  }

  onChange(cleanedContent);
  console.log("🧩 onChange called with:", cleanedContent);
  setIsEditing(false);
};



  const handleCancel = () => {
    setTempValue(value || "");
    setError("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer border border-dashed border-gray-500 rounded-lg min-h-[100px] p-3 hover:border-gray-400 transition-colors duration-200 w-full"
        onClick={() => setIsEditing(true)}
      >
        {value ? (
          // <div
          //   className="rich-text-preview text-gray-300 text-sm max-w-none"
          //   dangerouslySetInnerHTML={{ __html: value }}
          // />
          <div
  className="text-gray-300 text-sm leading-relaxed role-description"
  dangerouslySetInnerHTML={{ __html: value }}
/>
        ) : (
          <p className="text-gray-300 text-sm">{placeholder}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-3 w-full bg-gray-800/50 ${
        error ? "border-red-500" : "border-gray-500"
      }`}
    >
      <div className="custom-quill-container w-full">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={tempValue}
          onChange={handleQuillChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className="custom-quill bg-transparent text-gray-300 rounded-lg w-full"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <p
          className={`text-xs ${
            charCount >= maxLength ? "text-red-400" : "text-gray-500"
          }`}
        >
          {charCount}/{maxLength} characters
        </p>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <Buttonborder
          classNameborder="!bg-transparent border border-gray-500 text-gray-300 hover:border-gray-400 hover:text-gray-200"
          onClick={handleCancel}
          name="Cancel"
        />
        <Buttonborder 
          classNameborder="border border-gray-500 text-gray-300 hover:border-gray-400 hover:text-gray-200"
          onClick={handleSave} 
          name="Save" 
        />
      </div>
    </div>
  );
};

export default RichTextEditor;