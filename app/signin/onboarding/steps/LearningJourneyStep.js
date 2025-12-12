"use client";
import React, { useState } from "react";
import { InputBox } from "../../../components/FormInput";
import SelectField from "../../../components/FormSelect";

export default function LearningJourneyStep({ data, updateData }) {
  const learningJourney = data.learningJourney || {};

  const handleChange = (field, value) => {
    updateData("learningJourney", {
      ...learningJourney,
      [field]: value,
    });
  };

  const educationLevelOptions = [
    { value: "", label: "Select Education Level" },
    { value: "12th", label: "12th" },
    { value: "Diploma", label: "Diploma" },
    { value: "Under Graduate", label: "Under Graduate" },
    { value: "Post Graduate", label: "Post Graduate" },
  ];

  const fieldOfStudyOptions = [
    { value: "", label: "Select Field of Study" },
    { value: "Engineering", label: "Engineering" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Arts & Humanities", label: "Arts & Humanities" },
    { value: "Computer Applications", label: "Computer Applications" },
  ];

  const learningModeOptions = [
    { value: "", label: "Select Learning Mode" },
    { value: "Online", label: "Online" },
    { value: "Regular", label: "Regular" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-4">
      <SelectField
        label="Education Level"
        name="educationLevel"
        value={learningJourney.educationLevel || ""}
        onChange={(e) => handleChange("educationLevel", e.target.value)}
        options={educationLevelOptions}
      />

      <SelectField
        label="Field of Study"
        name="fieldOfStudy"
        value={learningJourney.fieldOfStudy || ""}
        onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
        options={fieldOfStudyOptions}
      />

      <SelectField
        label="Specialisation"
        name="specialization"
        value={learningJourney.specialization || ""}
        onChange={(e) => handleChange("specialization", e.target.value)}
        options={[
          { value: "", label: "Select Specialisation" },
          { value: "Computer Science", label: "Computer Science" },
          { value: "Information Technology", label: "Information Technology" },
          { value: "Data Science", label: "Data Science" },
          { value: "Software Engineering", label: "Software Engineering" },
        ]}
      />

      <SelectField
        label="Degree"
        name="degree"
        value={learningJourney.degree || ""}
        onChange={(e) => handleChange("degree", e.target.value)}
        options={[
          { value: "", label: "Select Degree" },
          {
            value: "Bachelor In Computer Application",
            label: "Bachelor In Computer Application",
          },
          { value: "Bachelor of Technology", label: "Bachelor of Technology" },
          { value: "Bachelor of Science", label: "Bachelor of Science" },
          { value: "Master of Technology", label: "Master of Technology" },
          { value: "Master of Science", label: "Master of Science" },
        ]}
      />

      <SelectField
        label="Learning Mode"
        name="learningMode"
        value={learningJourney.learningMode || ""}
        onChange={(e) => handleChange("learningMode", e.target.value)}
        options={learningModeOptions}
      />

      <div className="flex items-center justify-between p-4 border-2 border-blue-400 rounded-[30px] bg-white">
        <label className="text-gray-900 font-medium">
          Looking For Job Opportunities
        </label>
        <button
          type="button"
          onClick={() =>
            handleChange(
              "lookingForJobOpportunities",
              !learningJourney.lookingForJobOpportunities
            )
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            learningJourney.lookingForJobOpportunities
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              learningJourney.lookingForJobOpportunities
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
