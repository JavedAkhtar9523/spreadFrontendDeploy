"use client";
import React from "react";
import FormDropdown from "../../../components/FormDropdown";
import SearchableDropdown from "../../../components/SearchableDropdown";

export default function LearningJourneyStep({ data, updateData }) {
  const learningJourney = data.learningJourney || {};

  const handleChange = (field, value) => {
    // Agar lookingForJobOpportunities toggle ho rahi hai
    if (field === "lookingForJobOpportunities" && value === true) {
      // Journey type ko Professional mein change kar do
      updateData("personalInfo", {
        journeyType: "Professional / Jobseeker",
      });
    }

    // Agar education level change ho raha hai to degree clear kar do
    if (field === "educationLevel") {
      updateData("learningJourney", {
        ...learningJourney,
        educationLevel: value,
        degree: "", // Clear degree
        fieldOfStudy: "", // Clear field of study
        specialization: "", // Clear specialization
      });
      return;
    }

    // Agar degree change ho raha hai to specialization clear kar do
    if (field === "degree") {
      updateData("learningJourney", {
        ...learningJourney,
        degree: value,
        specialization: "", // Clear specialization
      });
      return;
    }

    // Agar field of study change ho raha hai to specialization clear kar do
    if (field === "fieldOfStudy") {
      updateData("learningJourney", {
        ...learningJourney,
        fieldOfStudy: value,
        specialization: "", // Clear specialization
      });
      return;
    }

    updateData("learningJourney", {
      ...learningJourney,
      [field]: value,
    });
  };

  const educationLevelOptions = [
    { value: "", label: "Select Education Level" },
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
    { value: "Diploma", label: "Diploma" },
    { value: "Under Graduate", label: "Under Graduate" },
    { value: "Post Graduate", label: "Post Graduate" },
    { value: "Doctorate / PhD", label: "Doctorate / PhD" },
  ];

  // Degree options based on education level
  const getDegreeOptions = () => {
    const level = learningJourney.educationLevel;

    if (level === "Under Graduate") {
      return [
        "Bachelor of Technology (B.Tech)",
        "Bachelor of Engineering (B.E.)",
        "Bachelor of Computer Applications (BCA)",
        "Bachelor of Science (B.Sc)",
        "Bachelor of Arts (B.A.)",
        "Bachelor of Commerce (B.Com)",
        "Bachelor of Business Administration (BBA)",
        "Bachelor of Design (B.Des)",
        "Bachelor of Architecture (B.Arch)",
        "Bachelor of Pharmacy (B.Pharm)",
        "Bachelor of Medicine (MBBS)",
        "Bachelor of Dental Surgery (BDS)",
        "Bachelor of Law (LLB)",
        "Bachelor of Education (B.Ed)",
      ];
    } else if (level === "Post Graduate") {
      return [
        "Master of Technology (M.Tech)",
        "Master of Engineering (M.E.)",
        "Master of Computer Applications (MCA)",
        "Master of Science (M.Sc)",
        "Master of Arts (M.A.)",
        "Master of Commerce (M.Com)",
        "Master of Business Administration (MBA)",
        "Master of Design (M.Des)",
        "Master of Architecture (M.Arch)",
        "Master of Pharmacy (M.Pharm)",
        "Master of Medicine (MD/MS)",
        "Master of Dental Surgery (MDS)",
        "Master of Law (LLM)",
        "Master of Education (M.Ed)",
      ];
    } else if (level === "Diploma") {
      return [
        "Diploma in Engineering",
        "Diploma in Computer Science",
        "Diploma in Information Technology",
        "Diploma in Electronics",
        "Diploma in Mechanical Engineering",
        "Diploma in Civil Engineering",
        "Diploma in Business Management",
        "Diploma in Design",
        "Diploma in Digital Marketing",
      ];
    } else if (level === "Doctorate / PhD") {
      return [
        "Doctor of Philosophy (PhD)",
        "Doctor of Science (D.Sc)",
        "Doctor of Engineering (D.Eng)",
        "Doctor of Medicine (DM)",
        "Doctor of Business Administration (DBA)",
      ];
    } else if (level === "12th" || level === "10th") {
      return ["Secondary Education"];
    }

    return [];
  };

  // Field of Study options
  const fieldOfStudyList = [
    // Engineering & Technology
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication Engineering",
    "Electrical & Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Aerospace Engineering",
    "Automobile Engineering",

    // Sciences
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Environmental Science",
    "Data Science",
    "Statistics",

    // Commerce & Management
    "Business Administration",
    "Commerce",
    "Finance & Accounting",
    "Marketing",
    "Human Resource Management",
    "International Business",

    // Arts & Humanities
    "Arts & Humanities",
    "English Literature",
    "History",
    "Political Science",
    "Psychology",
    "Sociology",
    "Philosophy",
    "Economics",
    "Journalism & Mass Communication",

    // Design & Creative
    "Design",
    "Fashion Design",
    "Interior Design",
    "Graphic Design",
    "Animation",
    "Fine Arts",

    // Medical & Healthcare
    "Medicine",
    "Nursing",
    "Pharmacy",
    "Physiotherapy",
    "Dentistry",

    // Law & Legal Studies
    "Law",
    "Corporate Law",
    "Criminal Law",

    // Education
    "Education",
    "Physical Education",

    // Others
    "Agriculture",
    "Architecture",
    "Computer Applications",
    "Hotel Management",
    "Library Science",
  ];

  // Specialization based on Field of Study and Degree
  const getSpecializationOptions = () => {
    const field = learningJourney.fieldOfStudy;
    const degree = learningJourney.degree;

    // Engineering specializations
    if (
      field === "Computer Science & Engineering" ||
      degree?.includes("Computer")
    ) {
      return [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Cloud Computing",
        "Cybersecurity",
        "Web Development",
        "Mobile App Development",
        "Blockchain Technology",
        "Internet of Things (IoT)",
        "Computer Networks",
        "Database Management",
        "Software Engineering",
        "DevOps",
      ];
    }

    if (field === "Information Technology") {
      return [
        "Software Development",
        "Network Security",
        "Cloud Computing",
        "Database Administration",
        "IT Infrastructure",
        "Systems Analysis",
        "Web Technologies",
      ];
    }

    if (field === "Electronics & Communication Engineering") {
      return [
        "VLSI Design",
        "Embedded Systems",
        "Signal Processing",
        "Telecommunications",
        "Microelectronics",
        "Wireless Communication",
      ];
    }

    if (field === "Mechanical Engineering") {
      return [
        "Automotive Engineering",
        "Thermal Engineering",
        "Manufacturing Engineering",
        "Robotics & Automation",
        "CAD/CAM",
        "Industrial Engineering",
      ];
    }

    if (field === "Civil Engineering") {
      return [
        "Structural Engineering",
        "Transportation Engineering",
        "Environmental Engineering",
        "Geotechnical Engineering",
        "Construction Management",
        "Urban Planning",
      ];
    }

    // Business & Management specializations
    if (
      field === "Business Administration" ||
      degree?.includes("MBA") ||
      degree?.includes("BBA")
    ) {
      return [
        "Finance",
        "Marketing",
        "Human Resource Management",
        "Operations Management",
        "International Business",
        "Entrepreneurship",
        "Business Analytics",
        "Supply Chain Management",
        "Information Systems",
        "Strategic Management",
      ];
    }

    // Science specializations
    if (field === "Data Science" || field === "Statistics") {
      return [
        "Machine Learning",
        "Big Data Analytics",
        "Business Intelligence",
        "Predictive Analytics",
        "Data Mining",
        "Statistical Modeling",
      ];
    }

    // Design specializations
    if (field === "Design" || field?.includes("Design")) {
      return [
        "UI/UX Design",
        "Product Design",
        "Graphic Design",
        "Web Design",
        "Motion Graphics",
        "Brand Design",
        "Industrial Design",
      ];
    }

    // Commerce specializations
    if (field === "Commerce" || field === "Finance & Accounting") {
      return [
        "Accounting",
        "Taxation",
        "Banking",
        "Financial Management",
        "Cost Accounting",
        "Auditing",
      ];
    }

    // Medical specializations
    if (field === "Medicine" || degree?.includes("MBBS")) {
      return [
        "General Medicine",
        "Surgery",
        "Pediatrics",
        "Cardiology",
        "Orthopedics",
        "Dermatology",
        "Psychiatry",
      ];
    }

    // General specializations if no specific field matched
    return [
      "General",
      "Core Subject",
      "Applied Studies",
      "Research & Development",
      "Interdisciplinary Studies",
    ];
  };

  const learningModeOptions = [
    { value: "", label: "Select Learning Mode" },
    { value: "Regular", label: "Regular / Full-time" },
    { value: "Online", label: "Online / Distance" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Part-time", label: "Part-time" },
    { value: "Evening", label: "Evening / Weekend" },
  ];

  return (
    <div className="space-y-5">
      <FormDropdown
        label="Education Level"
        name="educationLevel"
        value={learningJourney.educationLevel || ""}
        onChange={(e) => handleChange("educationLevel", e.target.value)}
        options={educationLevelOptions}
      />

      <SearchableDropdown
        label="Degree"
        value={learningJourney.degree || ""}
        onChange={(value) => handleChange("degree", value)}
        options={getDegreeOptions()}
        placeholder="Type or select degree..."
      />

      <SearchableDropdown
        label="Field of Study"
        value={learningJourney.fieldOfStudy || ""}
        onChange={(value) => handleChange("fieldOfStudy", value)}
        options={fieldOfStudyList}
        placeholder="Type or select field of study..."
      />

      <SearchableDropdown
        label="Specialization"
        value={learningJourney.specialization || ""}
        onChange={(value) => handleChange("specialization", value)}
        options={getSpecializationOptions()}
        placeholder="Type or select specialization..."
      />

      <FormDropdown
        label="Learning Mode"
        name="learningMode"
        value={learningJourney.learningMode || ""}
        onChange={(e) => handleChange("learningMode", e.target.value)}
        options={learningModeOptions}
      />

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-2xl border-2 border-blue-100">
        <div className="flex-1">
          <label className="text-gray-900 font-semibold text-base block mb-1">
            Switch to Job Seeker Mode
          </label>
          <p className="text-xs text-gray-600">
            Show your profile to recruiters and get job recommendations
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            handleChange(
              "lookingForJobOpportunities",
              !learningJourney.lookingForJobOpportunities
            )
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            learningJourney.lookingForJobOpportunities
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
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
