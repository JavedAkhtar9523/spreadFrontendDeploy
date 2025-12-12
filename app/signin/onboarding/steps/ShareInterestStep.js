"use client";
import React, { useState } from "react";

export default function ShareInterestStep({ data, updateData }) {
  const [selectedOptions, setSelectedOptions] = useState({
    interests: data.interestsAndPreferences?.interests || [],
    hobbies: data.interestsAndPreferences?.hobbies || [],
    skills: data.interestsAndPreferences?.skills || [],
    contentPreference: data.interestsAndPreferences?.contentPreference || "",
    learningGoals: data.interestsAndPreferences?.learningGoals || [],
    communityTopics: data.interestsAndPreferences?.communityTopics || [],
  });

  const [activeModal, setActiveModal] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const options = [
    { key: "interests", label: "What are your main interests?", type: "array" },
    { key: "hobbies", label: "What hobbies do you enjoy?", type: "array" },
    {
      key: "skills",
      label: "What skills would you like to develop?",
      type: "array",
    },
    {
      key: "contentPreference",
      label: "What type of content do you prefer?",
      type: "string",
    },
    {
      key: "learningGoals",
      label: "What are your learning goals?",
      type: "array",
    },
    {
      key: "communityTopics",
      label: "Which community topics interest you?",
      type: "array",
    },
  ];

  const handleOptionClick = (option) => {
    setActiveModal(option);
    setInputValue("");
  };

  const handleSave = () => {
    if (!inputValue.trim()) return;

    const newSelectedOptions = { ...selectedOptions };

    if (activeModal.type === "array") {
      // Add to array if not already present
      if (!newSelectedOptions[activeModal.key].includes(inputValue.trim())) {
        newSelectedOptions[activeModal.key] = [
          ...newSelectedOptions[activeModal.key],
          inputValue.trim(),
        ];
      }
    } else {
      newSelectedOptions[activeModal.key] = inputValue.trim();
    }

    setSelectedOptions(newSelectedOptions);
    updateData("interestsAndPreferences", newSelectedOptions);
    setInputValue("");
    setActiveModal(null);
  };

  const handleRemoveItem = (key, item) => {
    const newSelectedOptions = { ...selectedOptions };
    newSelectedOptions[key] = newSelectedOptions[key].filter((i) => i !== item);
    setSelectedOptions(newSelectedOptions);
    updateData("interestsAndPreferences", newSelectedOptions);
  };

  const isSelected = (key) => {
    const value = selectedOptions[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.key}>
          <button
            onClick={() => handleOptionClick(option)}
            className={`w-full p-4 border-2 rounded-[30px] text-left transition ${
              isSelected(option.key)
                ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                : "border-blue-400 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <span>{option.label}</span>
            {isSelected(option.key) && (
              <span className="ml-2 text-blue-600 text-sm">✓</span>
            )}
          </button>

          {/* Display selected items */}
          {option.type === "array" &&
            selectedOptions[option.key].length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedOptions[option.key].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveItem(option.key, item)}
                      className="text-blue-500 hover:text-blue-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

          {option.type === "string" && selectedOptions[option.key] && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {selectedOptions[option.key]}
                <button
                  onClick={() => {
                    const newSelectedOptions = { ...selectedOptions };
                    newSelectedOptions[option.key] = "";
                    setSelectedOptions(newSelectedOptions);
                    updateData("interestsAndPreferences", newSelectedOptions);
                  }}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Modal for input */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeModal.label}
            </h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter your ${activeModal.key}...`}
              className="w-full border-2 border-blue-400 rounded-[30px] px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
              style={{ outline: "none", boxShadow: "none" }}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 text-white py-3 rounded-[30px] hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-[30px] hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
