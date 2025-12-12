
"use client";
import React, { useEffect, useRef, useState } from "react";
import { RiCameraAiLine } from "react-icons/ri";
import { Plus } from "lucide-react";
import { InputWithCount } from "../components/FormInput";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ImageEditorModal from "./ImageEditorModal";
import { RxCross1 } from "react-icons/rx";

export default function ContactInfoModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    location: "",
    email: "",
    phone: [],
    socialLinks: { github: "", website: "" },
    cover: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    location: "",
    phone: [],
    website: "",
    github: "",
    cover: "",
    avatar: "",
  });

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState("cover"); // "cover" | "avatar"
  const [editorImage, setEditorImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        headline: user?.headline || "",
        location: user?.location || "",
        email: user?.email || "",
        phone: user?.phone || [],
        socialLinks: {
          github: user?.socialLinks?.github || "",
          website: user?.socialLinks?.website || "",
        },
        cover: user?.cover || "",
        avatar: user?.avatar || "",
      });
      setErrors((prev) => ({
        ...prev,
        phone: (user?.phone || []).map(() => ""),
      }));
    }
  }, [user]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && value.trim()) setErrors((p) => ({ ...p, name: "" }));
    if (key === "location" && value.trim())
      setErrors((p) => ({ ...p, location: "" }));
    if (key === "cover" && value === "") setErrors((p) => ({ ...p, cover: "" }));
    if (key === "avatar" && value === "") setErrors((p) => ({ ...p, avatar: "" }));
  };

  // Phone handling
  const handlePhoneChange = (index, value) => {
    const updated = [...formData.phone];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, phone: updated }));

    const phoneErrs = [...(errors.phone || [])];
    phoneErrs[index] = value ? (validatePhone(value) ? "" : "Invalid phone number") : "";
    setErrors((prev) => ({ ...prev, phone: phoneErrs }));
  };

  const addPhoneNumber = () => {
    if (formData.phone.length >= 2) return;
    setFormData((prev) => ({
      ...prev,
      phone: [...prev.phone, ""],
    }));
    setErrors((prev) => ({
      ...prev,
      phone: [...(prev.phone || []), ""],
    }));
  };

  const handleSocialChange = (platform, value) =>
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));

  // file upload → editor
  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, [type]: "Please upload a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [type]: "File too large (max 5MB)." }));
      return;
    }
    setErrors((prev) => ({ ...prev, [type]: "" }));

    const reader = new FileReader();
    reader.onload = () => {
      setEditorMode(type);
      setEditorImage(reader.result);
      setEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorSave = (result) => {
    if (!result || !result.url) {
      setEditorOpen(false);
      setEditorImage(null);
      return;
    }
    setFormData((prev) => ({ ...prev, [editorMode]: result.url }));
    setEditorOpen(false);
    setEditorImage(null);
    setErrors((prev) => ({ ...prev, [editorMode]: "" }));
  };

  const handleEditorCancel = () => {
    setEditorOpen(false);
    setEditorImage(null);
  };

  // New: remove cover
  const removeCover = () => {
    setFormData((prev) => ({ ...prev, cover: "" }));
    setErrors((prev) => ({ ...prev, cover: "" }));
  };
  const removeavatar = () => {
    setFormData((prev) => ({ ...prev, avatar: "" }));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };


  // Validation helpers
  function validatePhone(value) {
    if (!value) return false; // caller should handle empty as "no input"
    // strip common separators but keep leading +
    const trimmed = value.trim();
    // if starts with + => international
    if (trimmed.startsWith("+")) {
      const digits = trimmed.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    } else {
      // allow formats like (123) 456-7890 etc but count digits
      const digits = trimmed.replace(/\D/g, "");
      // Accept exactly 10 digits for local numbers only
      return digits.length === 10;
    }
  }

  function isValidWebsite(url) {
    if (!url) return true;
    const site = url.trim();
    const urlPattern = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return urlPattern.test(site);
  }

  function isValidGithub(input) {
    if (!input) return false;
    const s = input.trim();

    // ✅ must start with https://github.com/, http://github.com/, or github.com/
    const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+$/;

    return urlPattern.test(s);
  }

  const validateAll = () => {
    const newErrors = {
      name: "",
      location: "",
      phone: [],
      website: "",
      github: "",
      cover: "",
      avatar: "",
    };

    if (!formData.name || !formData.name.trim())
      newErrors.name = "Name is required.";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name is too short.";

    if (!formData.location || !formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    newErrors.phone = (formData.phone || []).map((p) =>
      p ? (validatePhone(p) ? "" : "Invalid phone number") : ""
    );

    // website must start with http/https
    if (formData.socialLinks?.website) {
      if (!isValidWebsite(formData.socialLinks.website)) {
        newErrors.website = "Enter a valid website (must start with http/https).";
      }
    }

    // github validation
    if (formData.socialLinks?.github) {
      if (!isValidGithub(formData.socialLinks.github)) {
        newErrors.github = "Enter a valid GitHub username or URL.";
      }
    }

    setErrors(newErrors);

    const hasErr =
      newErrors.name ||
      newErrors.location ||
      newErrors.website ||
      newErrors.github ||
      newErrors.cover ||
      newErrors.avatar ||
      newErrors.phone.some(Boolean);

    return !hasErr;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!validateAll()) return;

  //   const payload = {
  //     ...formData,
  //     phone: formData.phone,
  //   };
  //   onSave(payload);
  //   onClose();
  // };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = {
      ...formData,
      phone: formData.phone,
    };
    onSave(payload);
    -   onClose();
  };
  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      title="Basic info"
      widthClass="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="px-2">

        {/* Form Fields */}
        <div className="">
          <InputWithCount
            placeholder="Full Name"
            value={formData.name}
            onChange={(val) => handleChange("name", val)}
            maxLength={50}
            error={errors.name}
          />

          <InputWithCount
            placeholder="Headline"
            value={formData.headline}
            onChange={(val) => handleChange("headline", val)}
            maxLength={200}
          />

          <InputWithCount
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={() => { }}
            maxLength={100}
            disabled
            className="bg-gray-600/40"
          />

          <InputWithCount
            placeholder="Location"
            value={formData.location}
            onChange={(val) => handleChange("location", val)}
            maxLength={120}
            error={errors.location}
          />



          {/* Phone Numbers */}
          <div>
            <label className="block text-sm font-medium text-white">
              Phone Numbers
            </label>
            {formData.phone.map((phone, idx) => (
              <div key={idx} className="">
                <InputWithCount
                  type="tel"
                  placeholder={`Phone ${idx + 1}`}
                  value={phone}
                  onChange={(val) => {
                    // allow + and digits and separators
                    const clean = val.replace(/[^0-9+\-\s()]/g, "");
                    handlePhoneChange(idx, clean);
                  }}
                  maxLength={20}
                  error={errors.phone && errors.phone[idx]}
                />
              </div>
            ))}
            {formData.phone.length < 2 && (
              <button
                type="button"
                onClick={addPhoneNumber}
                className="flex items-center text-blue-500 text-sm hover:underline"
              >
                <Plus size={16} className="mr-1" /> Add Phone Number
              </button>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white">
              Social Links
            </label>
            <InputWithCount
              placeholder="GitHub (username or https://github.com/username)"
              value={formData.socialLinks.github}
              onChange={(val) => {
                handleSocialChange("github", val);
                if (val && isValidGithub(val)) setErrors((p) => ({ ...p, github: "" }));
              }}
              maxLength={120}
              error={errors.github}
            />
            <div>
              <InputWithCount
                placeholder="Website (https://yourwebsite.com)"
                value={formData.socialLinks.website}
                onChange={(val) => {
                  handleSocialChange("website", val);
                  if (val && isValidWebsite(val)) setErrors((p) => ({ ...p, website: "" }));
                }}
                maxLength={120}
                error={errors.website}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky border-[#aeadad] right-0 -bottom-5 py-2">
          <div className="flex justify-end gap-3 mb-2">
            <Button
              type="button"
              onClick={onClose}
              buttonclass="border-2 border-[#aeadad] font-semibold !rounded-xs text-black"
            >
              Cancel
            </Button>
            <Button type="submit" buttonclass="w-15 justify-center !bg-blue-600 font-semibold !rounded-xs text-white">
              Save
            </Button>
          </div>
        </div>
      </form>

      {/* Image Editor Modal */}
      <ImageEditorModal
        show={editorOpen}
        onClose={handleEditorCancel}
        image={editorImage}
        onSave={handleEditorSave}
        mode={editorMode === "avatar" ? "avatar" : "cover"}
      />
    </Modal>
  );
}
