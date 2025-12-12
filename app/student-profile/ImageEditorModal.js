"use client";
import React, { useRef, useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import ImageEditor from "./ImageEditor";
import { Crop, SlidersHorizontal, Zap, Tag, FileText, Edit3 } from "lucide-react";
import AutoGrowTextarea from '../components/TextAreaField';
import {InputField} from '../components/InputField';
import  { ImageEditorPost } from "./ImageEditor";
const steps = ["Crop", "Filters", "Adjust"];

export default function ImageEditorModal({
  show,
  onClose,
  image,
  onSave,
  mode = "auto",
}) {
  const [step, setStep] = useState(0);
  const editorRef = useRef(null);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // final save
    if (editorRef.current?.exportImage) {
      const result = await editorRef.current.exportImage();
      if (result) {
        onSave(result); // { blob, url }
      }
    }
    setStep(0);
    onClose();
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else {
      setStep(0);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onClose={() => {
        setStep(0);
        onClose();
      }}
      title={`Create Spread :  ${steps[step]}`}
      widthClass="w-[900px]"
    >
      <div className="flex flex-col gap-3 py-4">
        <div className="flex justify-center gap-6">
          {steps.map((s, idx) => (
            <button
              key={s}
              onClick={() => setStep(idx)}
              type="button"
              className={`pb-2 px-3  border-b-2 hover:cursor-pointer ${
                idx === step
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className=" ">
          <ImageEditor
            ref={editorRef}
            initialImage={image}
            mode={mode}
            activeStep={step}
          />
        </div>

        <div className="flex  sticky -bottom-5 pb-3 z-50 justify-end gap-3">
          <Button
            type="button"
            onClick={handleBack}
            buttonclass="text-gray-700"
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            buttonclass="bg-blue-600 text-gray-700"
          >
            {step === steps.length - 1 ? "Save" : "Next"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}



const stepspost = [
  { label: "Crop", icon: <Crop size={18} /> },
  { label: "Filters", icon: <Zap size={18} /> },
  { label: "Adjust", icon: <SlidersHorizontal size={18} /> },
];



export function ImageEditorModalPost({
  show,
  onClose,
  image,
  onSave,
}) {
  const [step, setStep] = useState(0);
  const editorRef = useRef(null);

  const [openSection, setOpenSection] = useState(null);
  const [text, setText] = useState("");
  const [cropType, setCropType] = useState("original");
  const [tags, setTags] = useState([]);

  const textareaRef = useRef(null);

  const handleTextChange = (e) => setText(e.target.value);

  const cropOptions = [
    { type: "portrait", label: "Portrait 4:5" },
    { type: "landscape", label: "Landscape 16:9" },
    { type: "square", label: "Square 1:1" },
    { type: "original", label: "Original" },
  ];

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    const result = await editorRef.current?.exportImage({
      alt: text,
      cropType,
      tags,
    });

    if (result) onSave(result);

    onClose();
    setStep(0);
    setOpenSection(null);
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onClose={() => {
        setStep(0);
        setOpenSection(null);
        onClose();
      }}
      title={`Create Spread — ${steps[step].label}`}
      widthClass="!w-[600px]"
    >
      {/* TOP SECTIONS */}
      <div className="flex items-center justify-center gap-6 py-2 border-t">
        <button
          onClick={() => toggleSection("alt")}
          className={`flex items-center gap-2 px-3 py-1 text-sm border-b-2 ${
            openSection === "alt"
              ? "text-blue-600 border-blue-600 font-medium"
              : "border-transparent text-gray-600"
          }`}
        >
          <FileText size={16} /> Alt
        </button>

        <button
          onClick={() => toggleSection("edit")}
          className={`flex items-center gap-2 px-3 py-1 text-sm border-b-2 ${
            openSection === "edit"
              ? "text-blue-600 border-blue-600 font-medium"
              : "border-transparent text-gray-600"
          }`}
        >
          <Edit3 size={16} /> Image Edit
        </button>

        <button
          onClick={() => toggleSection("tag")}
          className={`flex items-center gap-2 px-3 py-1 text-sm border-b-2 ${
            openSection === "tag"
              ? "text-blue-600 border-blue-600 font-medium"
              : "border-transparent text-gray-600"
          }`}
        >
          <Tag size={16} /> Tag
        </button>
      </div>

      <div className="flex flex-col gap-4 py-4">

        {/* ALT SECTION */}
        {openSection === "alt" && (
          <div className="p-4 max-w-[450px] mx-auto">
            <div className="flex justify-center mb-3">
              <img src={image} alt="editing" className="w-full  object-cover rounded-xl" />
            </div>

            <AutoGrowTextarea
              ref={textareaRef}
              text={text}
              label="Type alt text for the image"
              placeholder="Explain the important details of this image for accessibility..."
              handleTextChange={handleTextChange}
              maxLength={600}
              maxHeight={200}
              className="border-[blue] placeholder:text-gray-600"
            />
          </div>
        )}

        {/* IMAGE EDIT */}
        {openSection === "edit" && (
          <div className=" rounded-xl max-w-[700px] mx-auto flex flex-col gap-3">
            {/* <div className="flex justify-center gap-6">
          {steps.map((s, idx) => (
            <button
              key={s}
              onClick={() => setStep(idx)}
              type="button"
              className={`pb-2 px-3  border-b-2 hover:cursor-pointer ${
                idx === step
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div> */}
            <div className=" rounded-xl p-4 h-[480px] flex items-center justify-center">
              <ImageEditorPost
                ref={editorRef}
                initialImage={image}
                activeStep={step}
                cropType={cropType}
              />
            </div>
          </div>
        )}

    
        {/* TAG SECTION */}
{openSection === "tag" && (
  <div className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-2">
    
    {/* HEADING */}
    <h3 className="text-base font-semibold text-gray-800">
      Add Tags
    </h3>

    {/* SUBHEADING */}
    <p className="text-sm text-gray-500 -mt-1 mb-1">
      Enter tags separated by commas. These help categorize your post.
    </p>

    <InputFieldText
      placeholder="Add tags separated by commas"
      onBlur={(e) =>
        setTags(
          e.target.value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      }
    />

    {tags.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {tags.map((t, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs"
          >
            #{t}
          </span>
        ))}
      </div>
    )}
  </div>
)}


        {/* BOTTOM BUTTONS */}
        <div className="flex justify-end gap-3 sticky bottom-10  pb-3 z-50 mt-2">
          <Button
            onClick={() => onClose()}
            buttonclass="bg-gray-200 text-gray-800 px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleNext}
            buttonclass="bg-blue-600 text-white px-6"
          >
            {step === 2 ? "Save" : "Next"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
