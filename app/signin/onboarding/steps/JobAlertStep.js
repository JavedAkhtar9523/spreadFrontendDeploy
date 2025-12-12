"use client";
import React from "react";
import { InputBox } from "../../../components/FormInput";
import SelectField from "../../../components/FormSelect";

export default function JobAlertStep({ data, updateData }) {
  const careerExpectations = data.careerExpectations || {};
  const jobAlert = data.jobAlertPreferences || {};

  const handleChange = (field, value) => {
    updateData("jobAlertPreferences", {
      ...jobAlert,
      [field]: value,
    });
  };

  const handleSalaryChange = (field, value) => {
    updateData("jobAlertPreferences", {
      ...jobAlert,
      salaryRange: {
        ...jobAlert.salaryRange,
        [field]: value ? parseInt(value) : null,
      },
    });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = jobAlert[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleChange(field, newValues);
  };

  const roleTypeOptions = [
    { value: "Internship", label: "Internship" },
    { value: "Part-time", label: "Part-time" },
    { value: "Full-time", label: "Full-time" },
  ];

  const locationPreferenceOptions = [
    { value: "", label: "Select Location Preference" },
    { value: "Remote", label: "Remote" },
    { value: "Online", label: "Online" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Preferred Role Types
        </label>
        <div className="flex gap-2">
          {roleTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleMultiSelect("preferredRoleTypes", option.value)
              }
              className={`px-4 py-3 border-2 rounded-xl text-sm transition ${
                jobAlert.preferredRoleTypes?.includes(option.value)
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-blue-400 bg-white text-gray-700 hover:border-blue-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Location Preference"
        name="locationPreference"
        value={jobAlert.locationPreference || ""}
        onChange={(e) => handleChange("locationPreference", e.target.value)}
        options={locationPreferenceOptions}
      />

      <SelectField
        label="Target Role / Industry"
        name="targetRole"
        value={jobAlert.targetRole || ""}
        onChange={(e) => handleChange("targetRole", e.target.value)}
        options={[
          { value: "", label: "Select Target Role / Industry" },
          { value: "Software Engineer", label: "Software Engineer" },
          { value: "Data Scientist", label: "Data Scientist" },
          { value: "Product Manager", label: "Product Manager" },
          { value: "UX Designer", label: "UX Designer" },
          { value: "Marketing Manager", label: "Marketing Manager" },
        ]}
      />

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Salary range
        </label>
        <div className="flex gap-4">
          <input
            name="salaryMin"
            type="number"
            value={jobAlert.salaryRange?.min || ""}
            onChange={(e) => handleSalaryChange("min", e.target.value)}
            placeholder="Min"
            className="flex-1 border-2 border-blue-400 rounded-[30px] px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 "
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <input
            name="salaryMax"
            type="number"
            value={jobAlert.salaryRange?.max || ""}
            onChange={(e) => handleSalaryChange("max", e.target.value)}
            placeholder="Max"
            className="flex-1 border-2 border-blue-400 rounded-[30px] px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 "
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-2 border-blue-400 rounded-[30px] bg-white">
        <label className="text-gray-900 font-medium">
          Recruiter visibility
        </label>
        <button
          type="button"
          onClick={() => {
            // Update careerExpectations since recruiterVisibility belongs there
            updateData("careerExpectations", {
              ...careerExpectations,
              recruiterVisibility: !careerExpectations.recruiterVisibility,
            });
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            careerExpectations.recruiterVisibility
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              careerExpectations.recruiterVisibility
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
