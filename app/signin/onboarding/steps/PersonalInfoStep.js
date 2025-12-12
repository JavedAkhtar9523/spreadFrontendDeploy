"use client";
import React from "react";
import { InputBox } from "../../../components/FormInput";
import SelectField from "../../../components/FormSelect";
import LocationSelector from "../../../components/LocationSelector";

export default function PersonalInfoStep({ data, updateData }) {
  const personalInfo = data.personalInfo || {};

  const handleChange = (field, value) => {
    updateData("personalInfo", {
      ...personalInfo,
      [field]: value,
    });
  };

  const handleLocationChange = (locationData) => {
    updateData("personalInfo", {
      ...personalInfo,
      country: locationData.country,
      state: locationData.state,
      city: locationData.city,
    });
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];

  const journeyTypeOptions = [
    { value: "", label: "Select" },
    { value: "Student", label: "Student" },
    { value: "Professional / Jobseeker", label: "Professional / Jobseeker" },
  ];

  return (
    <div className="space-y-5 w-full">
      <LocationSelector
        onLocationChange={handleLocationChange}
        initialData={{
          country: personalInfo.country || "",
          state: personalInfo.state || "",
          city: personalInfo.city || "",
        }}
      />

      <SelectField
        label="Preferred Language"
        name="preferredLanguage"
        value={personalInfo.preferredLanguage || ""}
        onChange={(e) => handleChange("preferredLanguage", e.target.value)}
        options={[
          { value: "", label: "Select Language" },
          { value: "English", label: "English" },
          { value: "Hindi", label: "Hindi" },
        ]}
      />

      <div className="relative">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Date Of Birth
        </label>
        <div className="relative">
          <input
            type="date"
            name="dateOfBirth"
            value={personalInfo.dateOfBirth || ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="w-full border-2 border-blue-400 rounded-[30px] px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0  appearance-none"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <SelectField
        label="Gender"
        name="gender"
        value={personalInfo.gender || ""}
        onChange={(e) => handleChange("gender", e.target.value)}
        options={genderOptions}
      />

      <SelectField
        label="Choose what defines your journey now"
        name="journeyType"
        value={personalInfo.journeyType || ""}
        onChange={(e) => handleChange("journeyType", e.target.value)}
        options={journeyTypeOptions}
      />
    </div>
  );
}
