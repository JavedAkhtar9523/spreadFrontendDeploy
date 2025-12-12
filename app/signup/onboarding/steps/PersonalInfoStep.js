"use client";
import React from "react";
import LocationSelector from "../../../components/LocationSelector";
import FormDropdown from "@/app/components/FormDropdown";

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

      <FormDropdown
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
        <input
          type="date"
          name="dateOfBirth"
          value={personalInfo.dateOfBirth || ""}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          placeholder=""
          className="w-full border-2 border-[#1442dc] rounded-full px-6 h-12 bg-white text-gray-900 focus:outline-none focus:ring-0 peer"
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        />
        <label className="absolute top-[-10px] left-5 bg-white px-2 text-xs font-semibold text-blue-600 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:top-[-10px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-semibold">
          Date Of Birth
        </label>
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          /> */}
        </svg>
      </div>

      <FormDropdown
        label="Gender"
        name="gender"
        value={personalInfo.gender || ""}
        onChange={(e) => handleChange("gender", e.target.value)}
        options={genderOptions}
      />

      <FormDropdown
        label="Choose what defines your journey now"
        name="journeyType"
        value={personalInfo.journeyType || ""}
        onChange={(e) => handleChange("journeyType", e.target.value)}
        options={journeyTypeOptions}
      />
    </div>
  );
}
