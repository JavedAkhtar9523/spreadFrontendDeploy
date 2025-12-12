"use client";
import React from "react";
import FormDropdown from "../../../components/FormDropdown";
import SearchableDropdown from "../../../components/SearchableDropdown";

export default function CareerExpectationsStep({ data, updateData }) {
  const careerExpectations = data.careerExpectations || {};

  const handleChange = (field, value) => {
    updateData("careerExpectations", {
      ...careerExpectations,
      [field]: value,
    });
  };

  const availabilityOptions = [
    { value: "", label: "Select Availability" },
    { value: "Remote", label: "Remote" },
    { value: "Onsite", label: "Onsite" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Flexible", label: "Flexible" },
  ];

  const jobRolesList = [
    // Engineering & Development
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Data Engineer",
    "Security Engineer",
    "QA Engineer",
    "Solutions Architect",

    // Data & Analytics
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "AI Engineer",
    "Business Intelligence Analyst",
    "Analytics Manager",

    // Product & Project Management
    "Product Manager",
    "Technical Product Manager",
    "Project Manager",
    "Program Manager",
    "Scrum Master",
    "Product Owner",

    // Design
    "UX Designer",
    "UI Designer",
    "Product Designer",
    "Graphic Designer",
    "Visual Designer",
    "Motion Designer",

    // Marketing & Sales
    "Marketing Manager",
    "Digital Marketing Specialist",
    "Content Marketing Manager",
    "SEO Specialist",
    "Social Media Manager",
    "Sales Executive",
    "Sales Manager",
    "Business Development Manager",
    "Account Manager",

    // Business & Strategy
    "Business Analyst",
    "Strategy Consultant",
    "Management Consultant",
    "Operations Manager",

    // Finance & Accounting
    "Financial Analyst",
    "Accountant",
    "Finance Manager",

    // HR & Administration
    "HR Manager",
    "Talent Acquisition Specialist",
    "Recruiter",
    "HR Business Partner",

    // Customer & Support
    "Customer Success Manager",
    "Customer Support Specialist",
    "Technical Support Engineer",
  ];

  const careerLevelOptions = [
    { value: "", label: "Select Career Level" },
    { value: "Junior (1-3 years)", label: "Junior (1-3 years)" },
    { value: "Mid-Level (3-5 years)", label: "Mid-Level (3-5 years)" },
    { value: "Senior (5-8 years)", label: "Senior (5-8 years)" },
    { value: "Lead / Manager (8+ years)", label: "Lead / Manager (8+ years)" },
    { value: "Director / VP", label: "Director / VP" },
    { value: "C-Level / Executive", label: "C-Level / Executive" },
  ];

  const industryList = [
    // Technology
    "Information Technology",
    "Software Development",
    "Cloud Computing",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",

    // Business Services
    "Consulting",
    "Business Services",
    "Professional Services",
    "Human Resources",
    "Recruitment",

    // Finance & Banking
    "Banking",
    "Finance",
    "Insurance",
    "Investment Management",
    "Fintech",
    "Accounting",

    // Healthcare & Pharma
    "Healthcare",
    "Pharmaceuticals",
    "Biotechnology",
    "Medical Devices",
    "Health Tech",

    // Education
    "Education",
    "E-Learning",
    "EdTech",
    "Higher Education",

    // E-commerce & Retail
    "E-commerce",
    "Retail",
    "Consumer Goods",
    "Fashion & Apparel",

    // Media & Entertainment
    "Media & Entertainment",
    "Digital Media",
    "Gaming",
    "Publishing",
    "Advertising",
    "Marketing",

    // Manufacturing & Industrial
    "Manufacturing",
    "Automotive",
    "Aerospace",
    "Industrial Equipment",

    // Real Estate & Construction
    "Real Estate",
    "Construction",
    "Property Management",

    // Travel & Hospitality
    "Travel & Tourism",
    "Hospitality",
    "Food & Beverage",

    // Telecom & Networking
    "Telecommunications",
    "Networking",
    "Internet Services",

    // Energy & Utilities
    "Energy",
    "Renewable Energy",
    "Utilities",
    "Oil & Gas",

    // Logistics & Transportation
    "Logistics",
    "Transportation",
    "Supply Chain",
    "Shipping",

    // Agriculture
    "Agriculture",
    "AgriTech",
    "Food Production",

    // Government & Non-Profit
    "Government",
    "Non-Profit",
    "NGO",
    "Public Sector",

    // Other
    "Legal Services",
    "Architecture",
    "Engineering Services",
    "Research & Development",
    "Sports & Fitness",
  ];

  return (
    <div className="space-y-5">
      <FormDropdown
        label="Career Level"
        name="careerLevel"
        value={careerExpectations.careerLevel || ""}
        onChange={(e) => handleChange("careerLevel", e.target.value)}
        options={careerLevelOptions}
      />

      <SearchableDropdown
        label="Industry"
        value={careerExpectations.industry || ""}
        onChange={(value) => handleChange("industry", value)}
        options={industryList}
        placeholder="Type or select industry..."
      />

      <SearchableDropdown
        label="Preferred Job Role"
        value={careerExpectations.preferredJobRoles || ""}
        onChange={(value) => handleChange("preferredJobRoles", value)}
        options={jobRolesList}
        placeholder="Type or select job role..."
      />

      <FormDropdown
        label="Work Mode Preference"
        name="availability"
        value={careerExpectations.availability || ""}
        onChange={(e) => handleChange("availability", e.target.value)}
        options={availabilityOptions}
      />

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-2xl border-2 border-blue-100">
        <div className="flex-1">
          <label className="text-gray-900 font-semibold text-base block mb-1">
            Recruiter Visibility
          </label>
          <p className="text-xs text-gray-600">
            Allow recruiters to see your profile and contact you for
            opportunities
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            handleChange(
              "recruiterVisibility",
              !careerExpectations.recruiterVisibility
            )
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            careerExpectations.recruiterVisibility
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
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
