"use client";
import React, { useState } from "react";
import SelectField from "../../../components/FormSelect";

export default function RecentExperienceStep({ data, updateData }) {
  const recentExperience = data.recentExperience || {};

  const handleChange = (field, value) => {
    updateData("recentExperience", {
      ...recentExperience,
      [field]: value,
    });
  };

  const handleExperienceSelect = (value) => {
    handleChange("experienceYears", value);
  };

  const experienceOptions = [
    "1-3 Year",
    "3-5 Year",
    "5-7 Year",
    "7-10 Year",
    "10+ Year",
  ];

  return (
    <div className="space-y-4">
      <SelectField
        label="Job Title"
        name="jobTitle"
        value={recentExperience.jobTitle || ""}
        onChange={(e) => handleChange("jobTitle", e.target.value)}
        options={[
          { value: "", label: "Select Job Title" },
          { value: "Software Engineer", label: "Software Engineer" },
          { value: "Data Scientist", label: "Data Scientist" },
          { value: "Product Manager", label: "Product Manager" },
          { value: "UX Designer", label: "UX Designer" },
          { value: "Marketing Manager", label: "Marketing Manager" },
        ]}
      />

      <SelectField
        label="Current role"
        name="currentRole"
        value={recentExperience.currentRole || ""}
        onChange={(e) => handleChange("currentRole", e.target.value)}
        options={[
          { value: "", label: "Select Current Role" },
          { value: "Marketing", label: "Marketing" },
          { value: "HR", label: "HR" },
          { value: "IT", label: "IT" },
          { value: "Finance", label: "Finance" },
        ]}
      />

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Experience(Year)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {experienceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleExperienceSelect(option)}
              className={`p-3 border-2 rounded-[30px] text-sm transition ${
                recentExperience.experienceYears === option
                  ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                  : "border-blue-400 bg-white text-gray-700 hover:border-blue-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Skills
        </label>
        <input
          type="text"
          name="skills"
          value={recentExperience.skills || ""}
          onChange={(e) => handleChange("skills", e.target.value)}
          placeholder="Enter your skills (comma separated)"
          className="w-full border-2 border-blue-400 rounded-[30px] px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-0 "
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Portfolio/ GitHub/ LinkedIn
        </label>
        <div className="relative">
          <input
            type="text"
            name="portfolio"
            value={recentExperience.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="Enter portfolio, GitHub, or LinkedIn URL"
            className="w-full border-2 border-blue-400 rounded-[30px] px-4 py-3 pr-10 bg-white text-gray-900 focus:outline-none focus:ring-0 "
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl font-bold hover:text-blue-800"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
