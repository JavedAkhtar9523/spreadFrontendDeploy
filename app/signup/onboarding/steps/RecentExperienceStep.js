"use client";
import React from "react";
import FormDropdown from "../../../components/FormDropdown";
import SearchableDropdown from "../../../components/SearchableDropdown";

export default function RecentExperienceStep({ data, updateData }) {
  const recentExperience = data.recentExperience || {};

  const handleChange = (field, value) => {
    updateData("recentExperience", {
      ...recentExperience,
      [field]: value,
    });
  };

  // Job Title ke base par Current Role suggest karne ke liye mapping
  const jobTitleToRoleMapping = {
    "Software Engineer": [
      "Engineering",
      "IT",
      "Product Development",
      "Research & Development",
    ],
    "Frontend Developer": ["Engineering", "IT", "Product Development", "UI/UX"],
    "Backend Developer": [
      "Engineering",
      "IT",
      "Product Development",
      "Cloud Services",
    ],
    "Full Stack Developer": ["Engineering", "IT", "Product Development"],
    "Mobile Developer": ["Engineering", "IT", "Product Development"],
    "DevOps Engineer": ["Engineering", "IT", "Operations", "Cloud Services"],
    "Data Scientist": [
      "Data Analytics",
      "Research & Development",
      "IT",
      "Business Intelligence",
    ],
    "Data Analyst": [
      "Data Analytics",
      "Business Intelligence",
      "Operations",
      "Finance",
    ],
    "Machine Learning Engineer": [
      "Research & Development",
      "Data Analytics",
      "Engineering",
      "IT",
    ],
    "Product Manager": [
      "Product Management",
      "Strategy",
      "Business Development",
      "Operations",
    ],
    "Project Manager": [
      "Project Management",
      "Operations",
      "Strategy",
      "Consulting",
    ],
    "UX Designer": ["Design", "Product Development", "Marketing", "Creative"],
    "UI Designer": ["Design", "Product Development", "Marketing", "Creative"],
    "Graphic Designer": ["Design", "Marketing", "Creative", "Brand Management"],
    "Marketing Manager": [
      "Marketing",
      "Brand Management",
      "Communications",
      "Sales",
    ],
    "Digital Marketing Specialist": [
      "Marketing",
      "Communications",
      "Sales",
      "E-commerce",
    ],
    "Content Writer": [
      "Content Creation",
      "Marketing",
      "Communications",
      "Creative",
    ],
    "Sales Manager": [
      "Sales",
      "Business Development",
      "Marketing",
      "Customer Relations",
    ],
    "Business Analyst": [
      "Business Intelligence",
      "Strategy",
      "Consulting",
      "Operations",
    ],
    "HR Manager": [
      "Human Resources",
      "Operations",
      "Administration",
      "Talent Management",
    ],
    "Financial Analyst": [
      "Finance",
      "Accounting",
      "Business Intelligence",
      "Strategy",
    ],
    Accountant: ["Accounting", "Finance", "Operations", "Compliance"],
    "Customer Support": [
      "Customer Service",
      "Operations",
      "Communications",
      "Sales",
    ],
    "Quality Assurance": [
      "Quality Control",
      "Engineering",
      "Operations",
      "Testing",
    ],
    "Network Engineer": ["IT", "Infrastructure", "Operations", "Cybersecurity"],
    "Security Analyst": [
      "Cybersecurity",
      "IT",
      "Risk Management",
      "Compliance",
    ],
    "Cloud Architect": [
      "Cloud Services",
      "IT",
      "Engineering",
      "Infrastructure",
    ],
  };

  // Comprehensive job titles list
  const jobTitles = [
    // Engineering & Development
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "iOS Developer",
    "Android Developer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Cloud Engineer",
    "Data Engineer",
    "Blockchain Developer",
    "Game Developer",
    "Embedded Systems Engineer",
    "Solutions Architect",
    "Cloud Architect",

    // Data & Analytics
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "AI Engineer",
    "Business Intelligence Analyst",
    "Data Engineer",
    "Analytics Manager",
    "Quantitative Analyst",

    // Product & Project Management
    "Product Manager",
    "Senior Product Manager",
    "Technical Product Manager",
    "Project Manager",
    "Program Manager",
    "Scrum Master",
    "Agile Coach",
    "Product Owner",

    // Design
    "UX Designer",
    "UI Designer",
    "UX/UI Designer",
    "Product Designer",
    "Graphic Designer",
    "Visual Designer",
    "Interaction Designer",
    "Motion Designer",
    "Brand Designer",

    // Marketing & Sales
    "Marketing Manager",
    "Digital Marketing Specialist",
    "Content Marketing Manager",
    "SEO Specialist",
    "Social Media Manager",
    "Growth Manager",
    "Sales Manager",
    "Business Development Manager",
    "Account Manager",
    "Sales Executive",

    // Content & Creative
    "Content Writer",
    "Copywriter",
    "Technical Writer",
    "Content Strategist",
    "Video Editor",
    "Creative Director",
    "Art Director",

    // Business & Strategy
    "Business Analyst",
    "Strategy Consultant",
    "Management Consultant",
    "Operations Manager",
    "Business Operations Analyst",

    // Finance & Accounting
    "Financial Analyst",
    "Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Investment Analyst",
    "Tax Consultant",
    "Auditor",

    // HR & Administration
    "HR Manager",
    "Talent Acquisition Specialist",
    "Recruiter",
    "HR Business Partner",
    "Learning & Development Manager",
    "Compensation & Benefits Analyst",

    // Customer & Support
    "Customer Support",
    "Customer Success Manager",
    "Technical Support Engineer",
    "Support Team Lead",
    "Client Relations Manager",

    // Quality & Testing
    "Quality Assurance",
    "QA Engineer",
    "Test Engineer",
    "Quality Analyst",
    "Automation Test Engineer",

    // IT & Infrastructure
    "Network Engineer",
    "System Administrator",
    "Database Administrator",
    "IT Support Specialist",
    "Infrastructure Engineer",

    // Security
    "Security Analyst",
    "Cybersecurity Engineer",
    "Information Security Manager",
    "Penetration Tester",
    "Security Consultant",
  ];

  // Comprehensive current roles list
  const allCurrentRoles = [
    // Technical
    "Engineering",
    "IT",
    "Product Development",
    "Research & Development",
    "Quality Control",
    "Testing",
    "Infrastructure",
    "Cloud Services",

    // Data
    "Data Analytics",
    "Business Intelligence",
    "Data Science",

    // Business
    "Strategy",
    "Business Development",
    "Operations",
    "Consulting",
    "Project Management",
    "Product Management",

    // Creative
    "Design",
    "Creative",
    "Content Creation",
    "Brand Management",

    // Marketing & Sales
    "Marketing",
    "Sales",
    "Communications",
    "E-commerce",
    "Digital Marketing",
    "Growth",

    // Finance
    "Finance",
    "Accounting",
    "Compliance",
    "Risk Management",

    // People & Admin
    "Human Resources",
    "Talent Management",
    "Administration",

    // Customer
    "Customer Service",
    "Customer Success",
    "Customer Relations",

    // Security
    "Cybersecurity",
    "Information Security",

    // Others
    "Legal",
    "Manufacturing",
    "Supply Chain",
    "Logistics",
    "Healthcare",
    "Education",
    "Real Estate",
  ];

  // Get suggested roles based on selected job title
  const getSuggestedRoles = () => {
    if (!recentExperience.jobTitle) return allCurrentRoles;

    const suggested = jobTitleToRoleMapping[recentExperience.jobTitle];
    if (suggested) {
      // Suggested roles ko pehle dikhao, baaki ko sort karke baad me
      const remaining = allCurrentRoles.filter(
        (role) => !suggested.includes(role)
      );
      return [...suggested, ...remaining.sort()];
    }

    return allCurrentRoles;
  };

  const experienceOptions = [
    { value: "", label: "Select Experience" },
    { value: "0-1 Year", label: "0-1 Year" },
    { value: "1-3 Year", label: "1-3 Year" },
    { value: "3-5 Year", label: "3-5 Year" },
    { value: "5-7 Year", label: "5-7 Year" },
    { value: "7-10 Year", label: "7-10 Year" },
    { value: "10+ Year", label: "10+ Year" },
  ];

  return (
    <div className="space-y-5">
      <SearchableDropdown
        label="Job Title"
        value={recentExperience.jobTitle || ""}
        onChange={(value) => handleChange("jobTitle", value)}
        options={jobTitles}
        placeholder="Type or select job title..."
      />

      <SearchableDropdown
        label="Current Role"
        value={recentExperience.currentRole || ""}
        onChange={(value) => handleChange("currentRole", value)}
        options={getSuggestedRoles()}
        placeholder="Type or select current role..."
      />

      <FormDropdown
        label="Experience (Year)"
        name="experienceYears"
        value={recentExperience.experienceYears || ""}
        onChange={(e) => handleChange("experienceYears", e.target.value)}
        options={experienceOptions}
      />

      <div className="relative">
        <input
          type="text"
          name="skills"
          value={recentExperience.skills || ""}
          onChange={(e) => handleChange("skills", e.target.value)}
          placeholder=""
          className="w-full border-2 border-[#1442dc] rounded-full px-6 h-12 bg-white text-gray-900 focus:outline-none focus:ring-0 peer"
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        />
        <label className="absolute top-[-10px] left-5 bg-white px-2 text-xs font-semibold text-blue-600 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:top-[-10px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-semibold">
          Skills
        </label>
      </div>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            name="portfolio"
            value={recentExperience.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder=""
            className="w-full border-2 border-[#1442dc] rounded-full px-6 h-12 pr-12 bg-white text-gray-900 focus:outline-none focus:ring-0 peer"
            style={{
              outline: "none",
              boxShadow: "none",
            }}
          />
          <label className="absolute top-[-10px] left-5 bg-white px-2 text-xs font-semibold text-blue-600 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:font-normal peer-focus:top-[-10px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-semibold">
            Portfolio/ GitHub/ LinkedIn
          </label>
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
