
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
    { title: "Tell Us about yourself", component: PersonalInfoStep },
    {
      title: "Where are you in your learning journey",
      component: LearningJourneyStep,
    },
    {
      title: "Sharp your needs and clearer expectations",
      component: CareerExpectationsStep,
    },
    { title: "Build your custom job alert", component: JobAlertStep },
    {
      title: "What's your most recent experience?",
      component: RecentExperienceStep,
    },
    {
      title: "Connect with People, Companies & Colleges",
      component: CollabStep,
      description: "Step into a space where your craft finds its companions.",
    },
    { title: "Share your interest", component: ShareInterestStep },
  ];

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
    if (currentStep < steps.length - 1) {
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

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white flex flex-col p-4">
      {/* Header */}
      <div className=" p-4">
       
          <h2 className="text-lg sm:text-xl font-jost  font-extralight text-gray-700 mb-1 mt-5">
          Get Start With <span className="text-blue-800 font-bold">Spreadnext</span>
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Step Title */}
          {/* <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">
              {steps[currentStep].title}
            </h1>
            {currentStep === 0 && (
              <p className="text-gray-600 text-sm sm:text-base">
                Share knowledge, and to grow with others, pick what you want to
                see in your feeds
              </p>
            )}
            {currentStep === 1 && (
              <p className="text-gray-600 text-sm sm:text-base">
                It will help us to improve your journey. You can always change
                it later.
              </p>
            )}
            {currentStep === 2 && (
              <p className="text-gray-600 text-sm sm:text-base">
                Tell us about your educational journey we'll tune the platform
                around your journey.
              </p>
            )}
            {currentStep === 3 && (
              <p className="text-gray-600 text-sm sm:text-base">
                Tell us about your career journey we'll tune the platform around
                your journey.
              </p>
            )}
            {currentStep === 4 && (
              <p className="text-gray-600 text-sm sm:text-base">
                We'll use your response to customize your experience. You can
                change it later.
              </p>
            )}
            {currentStep === 5 && (
              <p className="text-gray-600 text-sm sm:text-base">
                {steps[currentStep].description ||
                  "Step into a space where your craft finds its companions."}
              </p>
            )}
            {currentStep === 6 && (
              <p className="text-gray-600 text-sm sm:text-base">
                Tell us about your educational journey we'll tune the platform
                around your journey.
              </p>
            )}
          </div> */}

            <div className="w-full max-w-2xl text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#0631c0] font-jost font-medium">
            Tell us about yourself
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            It will help us to improve your journey. You can always change it later.
          </p>
        </div>

     

          {/* Form Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <CurrentStepComponent
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium"
              >
                ← Back
              </button>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                onClick={handleSkip}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition font-medium"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-md"
              >
                {loading
                  ? "Saving..."
                  : currentStep === steps.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
