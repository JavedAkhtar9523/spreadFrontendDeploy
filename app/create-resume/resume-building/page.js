"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { FiDownload, FiPlus } from "react-icons/fi";
import ResumeSection from "../ResumeSection";
import WorkExperienceCard from "../WorkExperienceCard";
import ProjectCard from "../ProjectCard";
import RichTextEditor from "./RichTextEditor";
import { InputWithCount } from "../../components/FormInput";
import ResumePreview from "./ResumePreview";
import EducationCard from "../EducationCard";
import ProfessionalSkillsInterestsSection from "../SkillsSection";
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateUrl,
} from "../../utils/validation";
import WebsiteSocialWebsiteCard from "../WebsiteSocialWebsiteCard";
import Certificate from "../Certificate";
import AwardAchivement from "../AwardsAchivement";
import Publications from "../Publications";
// import { generateResumePDF } from '../../utils/pdfGenerator'; // FIXED: Removed extra space
import { generateResumePDF } from "../../utils/generateResumePDF ";
import TemplateModal from "../template/TemplateModal";
import { resumeTemplates } from "../template/templateManager";
import TopActionBar from "./TopActionBar";
// import PremiumTemplateSystem from "./PremiumTemplateSystem";
import PremiumTemplateSystem from "../template/PremiumTemplateSystem";

const LocationSelector = dynamic(
  () => import("../../components/LocationSelector"),
  { ssr: false }
);

export default function ResumeBuilder() {
  const currentUser = useSelector((state) => state.users?.currentUser);
  const previewRef = useRef(null);
  const [currentTemplate, setCurrentTemplate] = useState("modern");
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumTemplate, setSelectedPremiumTemplate] = useState(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  const [brandingEnabled, setBrandingEnabled] = useState(false);
  const [currentFont, setCurrentFont] = useState("inter");
  const [currentColor, setCurrentColor] = useState("");
  const [currentTheme, setCurrentTheme] = useState("modern-pro");
 const [profileImage, setProfileImage] = useState(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      address: "",
    },
    socialLinks: [],
    certificates: [],
    publications: [],
    awardsAchievements: [], // FIXED: Combined into single array
    profileSummary: "",
    projects: [],
    workExperience: [],
    education: [],
    skills: [],
    interests: [],
    languages: [],
  });

  const [errors, setErrors] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({
    personalInfo: false,
    profileSummary: true,
    workExperience: true,
    socialLinks: true,
    education: true,
    projects: true,
    skillsInterests: true,
    certificates: true,
    publications: true,
    awardsAchievements: true, // FIXED: Single section
  });
  const [canProceed, setCanProceed] = useState(false);
  const [showCardErrors, setShowCardErrors] = useState({});
  const [sectionMessages, setSectionMessages] = useState({});

  // Load data from uploaded file or initialize with empty data
  useEffect(() => {
    const initialData = {
      personalInfo: {
        firstName: currentUser?.name?.split(" ")[0] || "",
        lastName: currentUser?.name?.split(" ")[1] || "",
        headline: "",
        email: currentUser?.email || "",
        phone: "",
        address: "",
        country: "",
        state: "",
        city: "",
        avatar: null,
      },
      profileSummary: "",
      socialLinks: [],
      projects: [],
      workExperience: [],
      education: [],
      skills: {
        technical: [],
        soft: [],
      },
      interests: [],
      languages: [],
      certificates: [],
      publications: [],
      awardsAchievements: [], // FIXED: Single array
    };

    setResumeData(initialData);
  }, [currentUser]);

  // ==================
  const handleImageUpdate = (imageUrl, imageFile) => {
    console.log("🔄 Parent: Image update received", { imageUrl, imageFile });

    // Update profile image state
    setProfileImage(imageUrl);

    // Update resume data
    setResumeData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        avatar: imageUrl,
      },
    }));

    // Save to localStorage
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("userProfileImage", reader.result);
        console.log("💾 Image saved to localStorage");
      };
      reader.readAsDataURL(imageFile);
    }
  };
  // ==================

  // ✅ Handle Template Selection with Premium Check
  const handleTemplateSelect = (templateId) => {
    const template = resumeTemplates[templateId];

    console.log("Template selected:", templateId, template);

    // Check if template is premium
    if (template.isPremium && !isPremiumUser) {
      console.log("Premium template selected, opening premium modal");
      setSelectedPremiumTemplate(template);
      setShowPremiumModal(true);
      setShowTemplateModal(false);
    } else {
      // Free template or user is already premium
      console.log("Applying template:", templateId);
      setCurrentTemplate(templateId);
      setShowTemplateModal(false);
    }
  };

  // ✅ Handle Premium Subscription Complete
  const handlePremiumSubscriptionComplete = (plan, template) => {
    console.log("Subscription complete:", plan, template);
    setIsPremiumUser(true);
    setCurrentPlan(plan);
    setCurrentTemplate(template.id);
    setShowPremiumModal(false);
  };

  // ✅ Handle Close Premium Modal
  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
    setSelectedPremiumTemplate(null);
  };

  // Validate form whenever resumeData changes
  useEffect(() => {
    validateForm();
  }, [resumeData]);

  const isPersonalInfoComplete = () => {
    const { firstName, lastName, headline, email } = resumeData.personalInfo;
    return (
      validateRequired(firstName) &&
      validateRequired(lastName) &&
      validateRequired(headline) &&
      validateRequired(email) &&
      validateEmail(email)
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Info Validation
    if (!validateRequired(resumeData.personalInfo.firstName)) {
      newErrors.firstName = "First name is required";
    }
    if (!validateRequired(resumeData.personalInfo.lastName)) {
      newErrors.lastName = "Last name is required";
    }
    if (!validateRequired(resumeData.personalInfo.headline)) {
      newErrors.headline = "Job title is required";
    }
    if (!validateRequired(resumeData.personalInfo.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(resumeData.personalInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (
      resumeData.personalInfo.phone &&
      !validatePhone(resumeData.personalInfo.phone)
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);

    // Check if can proceed (personal info complete + at least one section has complete data)
    const hasBasicInfo = isPersonalInfoComplete();

    const hasCompleteWorkExperience =
      resumeData.workExperience.length > 0 &&
      resumeData.workExperience.every(
        (exp) =>
          validateRequired(exp.title) &&
          validateRequired(exp.company) &&
          validateRequired(exp.startMonth) &&
          validateRequired(exp.startYear) &&
          (exp.currentlyWorking ||
            (validateRequired(exp.endMonth) && validateRequired(exp.endYear)))
      );

    const hasCompleteEducation =
      resumeData.education.length > 0 &&
      resumeData.education.every(
        (edu) =>
          validateRequired(edu.college) &&
          validateRequired(edu.course) &&
          validateRequired(edu.level) &&
          validateRequired(edu.startMonth) &&
          validateRequired(edu.startYear) &&
          (edu.currentlyStudying ||
            (validateRequired(edu.endMonth) && validateRequired(edu.endYear)))
      );

    const hasCompleteProjects =
      resumeData.projects.length > 0 &&
      resumeData.projects.every(
        (project) =>
          validateRequired(project.title) &&
          validateRequired(project.description)
      );

    // FIXED: Updated to use awardsAchievements instead of separate arrays
    const hasAtLeastOneCompleteSection =
      hasCompleteWorkExperience ||
      hasCompleteEducation ||
      hasCompleteProjects ||
      resumeData.skills.length > 0 ||
      resumeData.certificates.length > 0 ||
      resumeData.publications.length > 0 ||
      resumeData.awardsAchievements.length > 0; // FIXED: Single array

    setCanProceed(hasBasicInfo && hasAtLeastOneCompleteSection);
  };

  // FIXED: Improved hasIncompleteCards function
  const hasIncompleteCards = (section) => {
    if (
      !resumeData[section] ||
      !Array.isArray(resumeData[section]) ||
      resumeData[section].length === 0
    ) {
      return false;
    }

    return resumeData[section].some((item) => {
      if (section === "projects") {
        return !item?.title?.trim() || !item?.description?.trim();
      }
      if (section === "workExperience") {
        return (
          !item?.title?.trim() ||
          !item?.company?.trim() ||
          !item?.startMonth ||
          !item?.startYear ||
          (!item?.currentlyWorking && (!item?.endMonth || !item?.endYear))
        );
      }
      if (section === "education") {
        return (
          !item?.college?.trim() ||
          !item?.course?.trim() ||
          !item?.level ||
          !item?.startMonth ||
          !item?.startYear ||
          (!item?.currentlyStudying && (!item?.endMonth || !item?.endYear))
        );
      }
      if (section === "certificates") {
        return !item?.name?.trim() || !item?.authority?.trim();
      }
      if (section === "publications") {
        return !item?.title?.trim() || !item?.publisher?.trim();
      }
      if (section === "awardsAchievements") {
        // FIXED: Single section
        return !item?.name?.trim() || !item?.description?.trim();
      }
      return false;
    });
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (section, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayUpdate = (section, items) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: items,
    }));
  };

  // FIXED: Use useCallback to prevent infinite re-renders
  const handleLocationChange = useCallback((locationData) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...locationData,
      },
    }));
  }, []);

  const addNewItem = (section, template) => {
    if (hasIncompleteCards(section)) {
      const newShowCardErrors = { ...showCardErrors };
      resumeData[section].forEach((item) => {
        const cardErrors = validateCard(item, section);
        if (Object.keys(cardErrors).length > 0) {
          newShowCardErrors[item.id] = true;
        }
      });
      setShowCardErrors(newShowCardErrors);

      setSectionMessages((prev) => ({
        ...prev,
        [section]: `Please complete or delete unfinished entries in "${getSectionDisplayName(
          section
        )}" before adding new.`,
      }));
      return;
    }

    const newItem = {
      ...template,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));

    if (resumeData[section].length === 0 && collapsedSections[section]) {
      setCollapsedSections((prev) => ({
        ...prev,
        [section]: false,
      }));
    }

    setSectionMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[section];
      return newMessages;
    });
  };

  const getSectionDisplayName = (section) => {
    const names = {
      workExperience: "Work Experience",
      education: "Education",
      projects: "Projects",
      socialLinks: "Website & Social Links",
      certificates: "Certificates",
      publications: "Publications",
      awardsAchievements: "Awards & Achievements", // FIXED: Updated name
    };
    return names[section] || section;
  };

  const removeItem = (section, id) => {
    setShowCardErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));

    if (!hasIncompleteCards(section)) {
      setSectionMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[section];
        return newMessages;
      });
    }
  };

  const toggleHidden = (section, id) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, hidden: !item.hidden } : item
      ),
    }));
  };

  const downloadResume = async () => {
    if (!canProceed) {
      alert("Please complete your resume before downloading.");
      return;
    }

    try {
      const pdf = await generateResumePDF(resumeData, currentTemplate);

      const fileName =
        `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume_${currentTemplate}.pdf`
          .replace(/\s+/g, "_")
          .toLowerCase();

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const validateCard = (item, section) => {
    const cardErrors = {};

    if (section === "projects") {
      if (!item?.title?.trim()) cardErrors.title = "Project title is required";
      if (!item?.description?.trim())
        cardErrors.description = "Project description is required";
    }
    if (section === "workExperience") {
      if (!item?.title?.trim()) cardErrors.title = "Job title is required";
      if (!item?.company?.trim())
        cardErrors.company = "Company name is required";
      if (!item?.startMonth || !item?.startYear)
        cardErrors.startDate = "Start date is required";
      if (!item?.currentlyWorking && (!item?.endMonth || !item?.endYear)) {
        cardErrors.endDate = "End date is required when not currently working";
      }
    }
    if (section === "education") {
      if (!item?.college?.trim())
        cardErrors.college = "College name is required";
      if (!item?.course?.trim()) cardErrors.course = "Course is required";
      if (!item?.level) cardErrors.level = "Education level is required";
      if (!item?.startMonth || !item?.startYear)
        cardErrors.startDate = "Start date is required";
      if (!item?.currentlyStudying && (!item?.endMonth || !item?.endYear)) {
        cardErrors.endDate = "End date is required when not currently studying";
      }
    }
    if (section === "certificates") {
      if (!item?.name?.trim()) cardErrors.name = "Certificate name is required";
      if (!item?.authority?.trim())
        cardErrors.authority = "Issuing authority is required";
    }
    if (section === "publications") {
      if (!item?.title?.trim())
        cardErrors.title = "Publication title is required";
      if (!item?.publisher?.trim())
        cardErrors.publisher = "Publisher is required";
    }
    if (section === "awardsAchievements") {
      // FIXED: Single section validation
      if (!item?.name?.trim())
        cardErrors.name = "Award/Achievement name is required";
      if (!item?.description?.trim())
        cardErrors.description = "Description is required";
    }
    return cardErrors;
  };

  const handleNext = () => {
    if (canProceed) {
      console.log("Proceeding with data:", resumeData);
      // Add navigation logic here
    } else {
      if (!isPersonalInfoComplete()) {
        setShowCardErrors((prev) => ({ ...prev, personalInfo: true }));
        alert("Please complete personal information before proceeding.");
      } else {
        const incompleteSections = [];
        [
          "workExperience",
          "education",
          "projects",
          "certificates",
          "publications",
          "awardsAchievements",
        ].forEach((section) => {
          if (resumeData[section]?.length > 0 && hasIncompleteCards(section)) {
            incompleteSections.push(getSectionDisplayName(section));
          }
        });

        if (incompleteSections.length > 0) {
          const newShowCardErrors = { ...showCardErrors };
          incompleteSections.forEach((sectionName) => {
            const sectionKey = Object.keys(collapsedSections).find(
              (key) => getSectionDisplayName(key) === sectionName
            );
            resumeData[sectionKey]?.forEach((item) => {
              const cardErrors = validateCard(item, sectionKey);
              if (Object.keys(cardErrors).length > 0) {
                newShowCardErrors[item.id] = true;
              }
            });
          });
          setShowCardErrors(newShowCardErrors);
          alert(
            `Please complete all required fields in: ${incompleteSections.join(
              ", "
            )}`
          );
        } else {
          alert("Please add at least one section before proceeding.");
        }
      }
    }
  };

  // Share functionality
  const handleShareResume = () => {
    const shareData = {
      title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume`,
      text: "Check out my resume!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      alert("Share functionality requires a secure context (HTTPS)");
    }
  };

  const AddNewButton = ({ onClick, text, section }) => (
    <button
      onClick={() => {
        if (hasIncompleteCards(section)) {
          const newShowCardErrors = { ...showCardErrors };
          resumeData[section]?.forEach(item => {
            const cardErrors = validateCard(item, section);
            if (Object.keys(cardErrors).length > 0) {
              newShowCardErrors[item.id] = true;
            }
          });
          setShowCardErrors(newShowCardErrors);
          
          setSectionMessages(prev => ({
            ...prev,
            [section]: `Please complete or delete unfinished entries in "${getSectionDisplayName(section)}" before adding new.`
          }));
        } else {
          onClick();
        }
      }}
      className="w-full py-1.5 text-[14px] border-1  border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300"
    >
      <FiPlus className="w-4 h-4" /> {text}
    </button>
  );


  // const handleTemplateSelect = (templateId) => {
  //   setCurrentTemplate(templateId);
  //   setShowTemplateModal(false);
  // };

  return (
    <div className="min-h-screen font-roboto bg-[#ffffff] text-[#000]">
      <div className=" mx-auto px-20 py-8">
        <TopActionBar
          canProceed={canProceed}
          downloadResume={downloadResume}
          handleNext={handleNext}
          setShowTemplateModal={setShowTemplateModal}
          onShare={handleShareResume}
          currentFont={currentFont}
          currentColor={currentColor}
          currentTheme={currentTheme}
          currentTemplate={currentTemplate}
          onFontChange={setCurrentFont}
          onColorChange={setCurrentColor}
          onThemeChange={setCurrentTheme}
          onTemplateChange={setCurrentTemplate}
          isPremiumUser={isPremiumUser}
          currentPlan={currentPlan}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Edit Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <ResumeSection
              title="Personal Information *"
              isCollapsed={collapsedSections.personalInfo}
              onToggle={() => toggleSection("personalInfo")}
            >
              <div className="space-y-4">
                <InputWithCount
                  label="First Name *"
                  value={resumeData.personalInfo.firstName}
                  onChange={(value) =>
                    handleInputChange("personalInfo", "firstName", value)
                  }
                  maxLength={50}
                  showCount={false}
                  error={showCardErrors.personalInfo && errors.firstName}
                />

                <InputWithCount
                  label="Last Name *"
                  value={resumeData.personalInfo.lastName}
                  onChange={(value) =>
                    handleInputChange("personalInfo", "lastName", value)
                  }
                  maxLength={50}
                  showCount={false}
                  error={showCardErrors.personalInfo && errors.lastName}
                />

                <InputWithCount
                  label="Preferred job title/role *"
                  value={resumeData.personalInfo.headline}
                  onChange={(value) =>
                    handleInputChange("personalInfo", "headline", value)
                  }
                  maxLength={100}
                  showCount={false}
                  placeholder="e.g., Senior Software Engineer | Full Stack Developer"
                  error={showCardErrors.personalInfo && errors.headline}
                />

                <InputWithCount
                  label="Email *"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(value) =>
                    handleInputChange("personalInfo", "email", value)
                  }
                  maxLength={100}
                  showCount={false}
                  error={showCardErrors.personalInfo && errors.email}
                />

                <InputWithCount
                  label="Phone Number"
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(value) =>
                    handleInputChange("personalInfo", "phone", value)
                  }
                  maxLength={20}
                  error={showCardErrors.personalInfo && errors.phone}
                />

                <LocationSelector
                  onLocationChange={handleLocationChange}
                  initialData={resumeData.personalInfo}
                />
              </div>
            </ResumeSection>

            {/* Website & Social Links */}
            <ResumeSection
              title="Website & Social Links"
              isCollapsed={collapsedSections.socialLinks}
              onToggle={() => toggleSection("socialLinks")}
            >
              <div className="space-y-6">
                {resumeData.socialLinks.map((social, index) => (
                  <WebsiteSocialWebsiteCard
                    key={social.id}
                    value={social}
                    onChange={(updatedSocial) => {
                      const updated = [...resumeData.socialLinks];
                      updated[index] = { ...updated[index], ...updatedSocial };
                      handleArrayUpdate("socialLinks", updated);
                    }}
                    onRemove={() => removeItem("socialLinks", social.id)}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("socialLinks", {
                      platform: "Portfolio",
                      customName: "",
                      url: "",
                    })
                  }
                  text="Add Social Link"
                  section="socialLinks"
                />
              </div>
            </ResumeSection>

            {/* Profile Summary */}
            <ResumeSection
              title="Professional Summary"
              isCollapsed={collapsedSections.profileSummary}
              onToggle={() => toggleSection("profileSummary")}
            >
              <RichTextEditor
                value={resumeData.profileSummary}
                onChange={(value) =>
                  setResumeData((prev) => ({ ...prev, profileSummary: value }))
                }
                placeholder="Write a compelling professional summary..."
                maxLength={700}
                showCharCount={true}
              />
            </ResumeSection>

            {/* Work Experience */}
            <ResumeSection
              title="Work Experience"
              isCollapsed={collapsedSections.workExperience}
              onToggle={() => toggleSection("workExperience")}
            >
              {sectionMessages.workExperience && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.workExperience}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.workExperience.map((exp, index) => (
                  <WorkExperienceCard
                    key={exp.id}
                    experience={exp}
                    onUpdate={(updatedExp) => {
                      const updated = [...resumeData.workExperience];
                      updated[index] = { ...updated[index], ...updatedExp };
                      handleArrayUpdate("workExperience", updated);
                    }}
                    onRemove={() => removeItem("workExperience", exp.id)}
                    onToggleHidden={() =>
                      toggleHidden("workExperience", exp.id)
                    }
                    showErrors={showCardErrors[exp.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("workExperience", {
                      title: "",
                      company: "",
                      field: "",
                      employmentType: "",
                      location: "",
                      startMonth: "",
                      startYear: "",
                      endMonth: "",
                      endYear: "",
                      currentlyWorking: false,
                      description: "",
                      bullets: [],
                      hidden: false,
                    })
                  }
                  text="Add Work Experience"
                  section="workExperience"
                />
              </div>
            </ResumeSection>

            {/* Education */}
            <ResumeSection
              title="Education"
              isCollapsed={collapsedSections.education}
              onToggle={() => toggleSection("education")}
            >
              {sectionMessages.education && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.education}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <EducationCard
                    key={edu.id}
                    education={edu}
                    onUpdate={(updatedEdu) => {
                      const updated = [...resumeData.education];
                      updated[index] = { ...updated[index], ...updatedEdu };
                      handleArrayUpdate("education", updated);
                    }}
                    onRemove={() => removeItem("education", edu.id)}
                    onToggleHidden={() => toggleHidden("education", edu.id)}
                    showErrors={showCardErrors[edu.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("education", {
                      level: "",
                      college: "",
                      course: "",
                      specialisation: "",
                      marks: "",
                      currentlyStudying: false,
                      startMonth: "",
                      startYear: "",
                      endMonth: "",
                      endYear: "",
                      hidden: false,
                    })
                  }
                  text="Add Education"
                  section="education"
                />
              </div>
            </ResumeSection>

            {/* Projects Section */}
            <ResumeSection
              title="Projects"
              isCollapsed={collapsedSections.projects}
              onToggle={() => toggleSection("projects")}
            >
              {sectionMessages.projects && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.projects}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onUpdate={(updatedProject) => {
                      const updated = [...resumeData.projects];
                      updated[index] = { ...updated[index], ...updatedProject };
                      handleArrayUpdate("projects", updated);
                    }}
                    onRemove={() => removeItem("projects", project.id)}
                    onToggleHidden={() => toggleHidden("projects", project.id)}
                    showErrors={showCardErrors[project.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("projects", {
                      title: "",
                      url: "",
                      organization: "",
                      city: "",
                      country: "",
                      startMonth: "",
                      startYear: "",
                      endMonth: "",
                      endYear: "",
                      currentlyWorking: false,
                      description: "",
                      bullets: [],
                      hidden: false,
                    })
                  }
                  text="Add Project"
                  section="projects"
                />
              </div>
            </ResumeSection>

            {/* Certificates */}
            <ResumeSection
              title="Certificates"
              isCollapsed={collapsedSections.certificates}
              onToggle={() => toggleSection("certificates")}
            >
              {sectionMessages.certificates && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.certificates}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.certificates.map((certificate, index) => (
                  <Certificate
                    key={certificate.id}
                    certificate={certificate}
                    onUpdate={(updatedCert) => {
                      const updated = [...resumeData.certificates];
                      updated[index] = { ...updated[index], ...updatedCert };
                      handleArrayUpdate("certificates", updated);
                    }}
                    onRemove={() => removeItem("certificates", certificate.id)}
                    onToggleHidden={() =>
                      toggleHidden("certificates", certificate.id)
                    }
                    showErrors={showCardErrors[certificate.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("certificates", {
                      name: "",
                      authority: "",
                      url: "",
                      issueDate: "",
                      hidden: false,
                    })
                  }
                  text="Add Certificate"
                  section="certificates"
                />
              </div>
            </ResumeSection>

            {/* Publications Section */}
            <ResumeSection
              title="Publications"
              isCollapsed={collapsedSections.publications}
              onToggle={() => toggleSection("publications")}
            >
              {sectionMessages.publications && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.publications}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.publications.map((publication, index) => (
                  <Publications
                    key={publication.id}
                    publication={publication}
                    onUpdate={(updatedPub) => {
                      const updated = [...resumeData.publications];
                      updated[index] = { ...updated[index], ...updatedPub };
                      handleArrayUpdate("publications", updated);
                    }}
                    onRemove={() => removeItem("publications", publication.id)}
                    onToggleHidden={() =>
                      toggleHidden("publications", publication.id)
                    }
                    showErrors={showCardErrors[publication.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("publications", {
                      title: "",
                      publisher: "",
                      url: "",
                      publicationMonth: "",
                      publicationYear: "",
                      description: "",
                      authors: "",
                      hidden: false,
                    })
                  }
                  text="Add Publication"
                  section="publications"
                />
              </div>
            </ResumeSection>

            {/* Awards & Achievements Section - FIXED: Single combined section */}
            <ResumeSection
              title="Awards & Achievements"
              isCollapsed={collapsedSections.awardsAchievements}
              onToggle={() => toggleSection("awardsAchievements")}
            >
              {sectionMessages.awardsAchievements && (
                <p className="text-red-400 text-sm mb-4">
                  {sectionMessages.awardsAchievements}
                </p>
              )}

              <div className="space-y-6">
                {resumeData.awardsAchievements.map((item, index) => (
                  <AwardAchivement
                    key={item.id}
                    item={item}
                    onUpdate={(updated) => {
                      const updatedItems = [...resumeData.awardsAchievements];
                      updatedItems[index] = {
                        ...updatedItems[index],
                        ...updated,
                      };
                      handleArrayUpdate("awardsAchievements", updatedItems);
                    }}
                    onRemove={() => removeItem("awardsAchievements", item.id)}
                    onToggleHidden={() =>
                      toggleHidden("awardsAchievements", item.id)
                    }
                    showErrors={showCardErrors[item.id] || false}
                  />
                ))}

                <AddNewButton
                  onClick={() =>
                    addNewItem("awardsAchievements", {
                      name: "",
                      issuer: "",
                      media: "",
                      description: "",
                      hidden: false,
                    })
                  }
                  text="Add Award / Achievement"
                  section="awardsAchievements"
                />
              </div>
            </ResumeSection>

            {/* Professional Skills & Interests Section */}
            <ResumeSection
              title="Skills & Interests"
              isCollapsed={collapsedSections.skillsInterests}
              onToggle={() => toggleSection("skillsInterests")}
            >
              <ProfessionalSkillsInterestsSection
                skills={resumeData.skills}
                interests={resumeData.interests}
                languages={resumeData.languages}
                onSkillsUpdate={(updatedSkills) =>
                  handleArrayUpdate("skills", updatedSkills)
                }
                onInterestsUpdate={(updatedInterests) =>
                  handleArrayUpdate("interests", updatedInterests)
                }
                onLanguagesUpdate={(updatedLanguages) =>
                  handleArrayUpdate("languages", updatedLanguages)
                }
              />
            </ResumeSection>
          </div>

          {/* Right Side - Preview */}
          <div className="relative">
            <div className="sticky top-4 rounded-xl p-1">
              <div ref={previewRef}>
                <ResumePreview
                  data={resumeData}
                  template={currentTemplate}
                  currentFont={currentFont}
                   profileImage={profileImage}
                  currentColor={currentColor}
                  onImageUpdate={handleImageUpdate}
                />
              </div>
            </div>
          </div>

          <TemplateModal
            isOpen={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            onTemplateSelect={handleTemplateSelect}
            currentTemplate={currentTemplate}
          />
          {/* ✅ Premium Template System Modal */}
          {showPremiumModal && selectedPremiumTemplate && (
            <PremiumTemplateSystem
              template={selectedPremiumTemplate}
              onClose={handleClosePremiumModal}
              onSubscriptionComplete={handlePremiumSubscriptionComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
