
// export default AwardAchivement;
import { useState } from "react";
import { FiTrash2, FiEye, FiEyeOff, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { InputWithCount } from "../components/FormInput";
import RichTextEditor from "./resume-building/RichTextEditor";
import MediaUpload from "../components/MediaUpload";

const AwardAchivement = ({ 
  item, 
  onUpdate, 
  onRemove, 
  onToggleHidden, 
  showErrors = false
}) => {
  const [isOpen, setIsOpen] = useState(!item.name);
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    onUpdate({ ...item, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, media: "Only image files are allowed." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, media: "Max file size is 2MB." }));
      return;
    }
    onUpdate({ ...item, media: file });
  };

  const validateCard = () => {
    const cardErrors = {};
    if (!item.name?.trim()) cardErrors.name = "Award/Achievement name is required";
    if (!item.description?.trim()) cardErrors.description = "Description is required";
    return cardErrors;
  };

  const cardErrors = validateCard();

  return (
    <div
      className={`relative rounded-2xl p-6 mb-6 border transition-all duration-200
        ${
          item.hidden
            ? "opacity-50 border-[#3A3A3A]"
            : (showErrors && (cardErrors.name || cardErrors.description))
            ? "border-[#c90000]"
            : "border-[#1E293B]"
        } bg-[#070C11]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-xl text-white">
            {item.name || "Untitled Achievement"}
          </h4>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-indigo-400 p-2 rounded-lg">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          <button
            onClick={onToggleHidden}
            className={`p-2 rounded-lg ${
              item.hidden ? "text-indigo-400" : "text-gray-400 hover:text-indigo-400"
            }`}
          >
            {item.hidden ? <FiEye /> : <FiEyeOff />}
          </button>
          <button onClick={onRemove} className="text-gray-400 hover:text-red-400 p-2 rounded-lg">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Collapsible Form */}
      {isOpen && (
        <div className=" mt-1">
          <InputWithCount
            label="Achievement Name *"
            value={item.name}
            onChange={(value) => handleFieldChange("name", value)}
            maxLength={100}
            error={showErrors && cardErrors.name}
          />

          <InputWithCount
            label="Issuer / Organization"
            value={item.issuer}
            onChange={(value) => handleFieldChange("issuer", value)}
            maxLength={100}
          />
 
          <MediaUpload
            label="Upload Certificate / Media (Optional)"
            accept="image/*"
            maxSizeMB={2}
            initialFile={item.media}
            onFileSelect={handleFileChange}
          />
          {errors.media && <p className="text-red-500 text-sm">{errors.media}</p>}

          <div className="mt-2">
            <label className="text-sm font-medium text-gray-200 mb-2 block">Description*</label>
            <RichTextEditor
              value={item.description}
              onChange={(value) => handleFieldChange("description", value)}
              placeholder="Describe your award/achievement, your role, significance, and impact..."
              small
              maxLength={600}
            />
            {showErrors && cardErrors.description && (
              <p className="text-red-500 text-sm mt-1">{cardErrors.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardAchivement;