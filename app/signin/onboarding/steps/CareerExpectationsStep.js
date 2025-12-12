"use client";
import React, { useState } from "react";
import SelectField from "../../../components/FormSelect";

export default function CareerExpectationsStep({ data, updateData }) {
  const careerExpectations = data.careerExpectations || {};

  const handleChange = (field, value) => {
    updateData("careerExpectations", {
      ...careerExpectations,
      [field]: value,
    });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = careerExpectations[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleChange(field, newValues);
  };

  const availabilityOptions = [
    { value: "", label: "Select Availability" },
    { value: "Remote", label: "Remote" },
    { value: "Onsite", label: "Onsite" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const jobRoleOptions = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "Marketing Manager",
    "Sales Executive",
    "HR Manager",
    "Business Analyst",
  ];

  const careerLevelOptions = [
    { value: "", label: "Select Career Level" },
    { value: "Junior", label: "Junior" },
    { value: "Mid", label: "Mid" },
    { value: "Senior", label: "Senior" },
    { value: "Lead", label: "Lead" },
  ];

  const industryOptions = [
    { value: "", label: "Select Industry" },
    { value: "IT", label: "IT" },
    { value: "Marketing", label: "Marketing" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
  ];

  return (
    <div className="space-y-4">
      <SelectField
        label="Career level"
        name="careerLevel"
        value={careerExpectations.careerLevel || ""}
        onChange={(e) => handleChange("careerLevel", e.target.value)}
        options={careerLevelOptions}
      />

      <SelectField
        label="Industry"
        name="industry"
        value={careerExpectations.industry || ""}
        onChange={(e) => handleChange("industry", e.target.value)}
        options={industryOptions}
      />

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Preferred job roles
        </label>
        <div className="grid grid-cols-2 gap-2">
          {jobRoleOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleMultiSelect("preferredJobRoles", role)}
              className={`p-3 border-2 rounded-xl text-sm transition ${
                careerExpectations.preferredJobRoles?.includes(role)
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-blue-400 bg-white text-gray-700 hover:border-blue-500"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Availability"
        name="availability"
        value={careerExpectations.availability || ""}
        onChange={(e) => handleChange("availability", e.target.value)}
        options={availabilityOptions}
      />

      <div className="flex items-center justify-between p-4 border-2 border-blue-400 rounded-[30px] bg-white">
        <label className="text-gray-900 font-medium">
          Recruiter visibility
        </label>
        <button
          type="button"
          onClick={() =>
            handleChange(
              "recruiterVisibility",
              !careerExpectations.recruiterVisibility
            )
          }
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
