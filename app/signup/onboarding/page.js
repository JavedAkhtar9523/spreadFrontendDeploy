"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import LearningJourneyStep from "./steps/LearningJourneyStep";
import CareerExpectationsStep from "./steps/CareerExpectationsStep";
import JobAlertStep from "./steps/JobAlertStep";
import RecentExperienceStep from "./steps/RecentExperienceStep";
import CollabStep from "./steps/OnboardCollab";
import ShareInterestStep from "./steps/ShareInterestStep";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      preferredLanguage: "",
      dateOfBirth: "",
      gender: "",
      journeyType: "",
    },
    // Step 2: Learning Journey
    learningJourney: {
      educationLevel: "",
      fieldOfStudy: "",
      specialization: "",
      degree: "",
      learningMode: "",
      lookingForJobOpportunities: false,
    },
    // Step 3: Career Expectations
    careerExpectations: {
      careerLevel: "",
      industry: "",
      preferredJobRoles: [],
      availability: "",
      recruiterVisibility: false,
    },
    // Step 4: Job Alert
    jobAlertPreferences: {
      preferredRoleTypes: [],
      locationPreference: "",
      targetRole: "",
      targetIndustry: "",
      salaryRange: {
        min: null,
        max: null,
        currency: "USD",
      },
    },
    // Step 5: Recent Experience
    recentExperience: {
      jobTitle: "",
      currentRole: "",
      experienceYears: "",
    },
    // Step 6: Collab (NEW STEP)
    collabConnections: {
      followedUsers: [],
      followedCompanies: [],
      followedColleges: [],
    },
    // Step 7: Share Interest
    interestsAndPreferences: {
      whyJoining: "",
      contentStylePreference: "",
      communityInterestClusters: [],
      contributionLevel: "",
      skillsOrThemesToShare: [],
      professionalIntent: "",
    },
  });

  const steps = [
    {
      title: "Tell Us about yourself",
      component: PersonalInfoStep,
      key: "personalInfo",
    },
    {
      title: "Where are you in your learning journey",
      component: LearningJourneyStep,
      key: "learningJourney",
      condition: (data) => data.personalInfo?.journeyType === "Student",
    },
    {
      title: "What's your most recent experience?",
      component: RecentExperienceStep,
      key: "recentExperience",
      condition: (data) =>
        data.personalInfo?.journeyType === "Professional / Jobseeker",
    },
    {
      title: "Sharp your needs and clearer expectations",
      component: CareerExpectationsStep,
      key: "careerExpectations",
      condition: (data) =>
        data.personalInfo?.journeyType === "Professional / Jobseeker",
    },
    {
      title: "Build your custom job alert",
      component: JobAlertStep,
      key: "jobAlert",
    },
    {
      title: "Connect with People, Companies & Colleges",
      component: CollabStep,
      key: "collab",
      description: "Step into a space where your craft finds its companions.",
    },
    {
      title: "Share your interest",
      component: ShareInterestStep,
      key: "shareInterest",
    },
  ];

  // Get filtered steps based on conditions
  const getFilteredSteps = () => {
    return steps.filter((step) => {
      if (step.condition) {
        return step.condition(formData);
      }
      return true;
    });
  };

  const filteredSteps = getFilteredSteps();

  // Load user email from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email) {
          setFormData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              email: user.email,
            },
          }));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const updateFormData = (stepKey, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }));
  };

  const handleNext = async () => {
    const currentFilteredSteps = getFilteredSteps();

    if (currentStep < currentFilteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        router.push("/signin");
        return;
      }

      // Get user data from localStorage
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userEmail = user?.email || "";
      const userFirstName = user?.firstName || "";
      const userLastName = user?.lastName || "";

      // Ensure personalInfo has required fields from User table
      const submitData = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
        },
      };

      // Send all data to backend
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Profile updated successfully!");

        // Get username from localStorage to redirect to profile page
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const username = user?.userName || user?.username;

        if (username) {
          router.push(`/in/${username}`);
        } else {
          router.push("/profile");
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = filteredSteps[currentStep]?.component;

  const stepDescriptions = {
    personalInfo:
      "Share knowledge, and to grow with others, pick what you want to see in your feeds",
    learningJourney:
      "It will help us to improve your journey. You can always change it later.",
    recentExperience:
      "We'll use your response to customize your experience. You can change it later.",
    careerExpectations:
      "Tell us about your career journey we'll tune the platform around your journey.",
    jobAlert:
      "Tell us about your career journey we'll tune the platform around your journey.",
    collab: "Step into a space where your craft finds its companions.",
    shareInterest:
      "Tell us about your educational journey we'll tune the platform around your journey.",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-light text-gray-600">
          Get Started With{" "}
          <span className="text-blue-600 font-semibold">Spreadnext</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {filteredSteps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / filteredSteps.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStep + 1) / filteredSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex items-center justify-center ${
          filteredSteps[currentStep]?.key === "collab" ? "px-8 md:px-16" : "p-4"
        } py-8`}
      >
        <div
          className={`w-full ${
            filteredSteps[currentStep]?.key === "collab" ? "" : "max-w-xl"
          }`}
        >
          {/* Step Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
              {filteredSteps[currentStep]?.title}
            </h1>
            <p className="text-gray-600 text-sm">
              {stepDescriptions[filteredSteps[currentStep]?.key]}
            </p>
          </div>

          {/* Form Content */}
          <div
            className={`bg-white rounded-2xl shadow-lg mb-6 border border-gray-100 ${
              filteredSteps[currentStep]?.key === "collab"
                ? "p-6 md:p-10"
                : "p-6 sm:p-8"
            }`}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                updateData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium"
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-md ml-auto"
            >
              {loading
                ? "Saving..."
                : currentStep === filteredSteps.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
