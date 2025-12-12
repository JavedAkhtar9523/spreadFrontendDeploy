"use client";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaGlobe,
  FaStar,
  FaAward,
  FaCertificate,
  FaBook,
  FaFolderOpen,
  FaCamera,
} from "react-icons/fa";
import {
  formatMonthYear,
  getLocationText,
  shouldShowSection,
} from "../../utils/resumeUtils";
import { useSate } from "react";
import { MdOutlineSportsBasketball } from "react-icons/md";
import { IoTodayOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { getPlatformIconObject } from "../../utils/resumeUtils";
import PageBreakHandler from "./PageBreakHandler";
import Page from "@/app/course/page";
import { FaCalendarAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { useRef, useState } from "react";

const ModernTemplate = ({
  data,
  profileImage,
  currentFont,
  currentColor,
  onImageUpdate,
}) => {
  const {
    personalInfo,
    profileSummary,
    projects,
    workExperience,
    education,
    skills,
    interests,
    socialLinks,
    certificates,
    publications,
    awardsAchievements,
    languages,
  } = data;
  const currentUser = useSelector((state) => state.users?.currentUser);

  // Use the correct priority: profileImage prop -> currentUser -> personalInfo
  const avatarSrc = profileImage || currentUser?.avatar || personalInfo?.avatar;

  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const fontClasses = {
    inter: "font-inter",
    roboto: "font-roboto",
    opensans: "font-open-sans",
    lato: "font-lato",
    montserrat: "font-montserrat",
    poppins: "font-poppins",
    playfair: "font-playfair",
    georgia: "font-georgia",
    times: "font-times",
  };

  const currentFontClass = fontClasses[currentFont] || "font-inter";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("File change detected:", file);

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      console.log("Image URL created:", imageUrl);

      // Call parent component's update function
      if (onImageUpdate) {
        console.log("Calling onImageUpdate with:", { imageUrl, file });
        onImageUpdate(imageUrl, file);
      } else {
        console.error("onImageUpdate is not available");
        alert("Image update functionality is not available");
      }
    }
  };

  const handleRemoveImage = () => {
    console.log("Remove image clicked");
    if (onImageUpdate) {
      onImageUpdate(null, null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className=" bg-white" templace="modern">
      <div
        className={`${currentFontClass}  min-h-screen text-gray-800  w-full`}
      >
        <section className="page-section">
          <div
            className="flex gap-5 border-b p-6 items-center"
            style={{
              borderColor: currentColor || "#1d19f9",
            }}
          >
            {/* Profile Image with Direct Upload Functionality */}

            <div
              className="relative mt-4 md:mt-0 md:ml-6 flex items-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {avatarSrc ? (
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden border-2"
                    style={{ borderColor: currentColor || "#1d19f9" }}
                  >
                    <img
                      src={avatarSrc}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Hover Overlay - Direct File Input */}
                  {isHovering && (
                    <div className="absolute inset-0 bg-[#1b191993] bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">
                      <label
                        htmlFor="profile-image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FaCamera className="text-white text-lg mb-1" />
                        <span className="text-white text-xs text-center">
                          Change Photo
                        </span>
                      </label>
                      <input
                        type="file"
                        id="profile-image-upload"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer"
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 hover:bg-blue-700"
                    style={{ backgroundColor: currentColor || "#1d19f9" }}
                  >
                    {personalInfo?.firstName?.[0] || "U"}
                  </div>
                  <input
                    type="file"
                    id="profile-image-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="page-subsection">
              <h1
                className="text-3xl font-bold mb-2 uppercase"
                style={{ color: currentColor || "#1d19f9" }}
              >
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
              {personalInfo?.headline && (
                <p
                  className="text-[14px] text-gray-600 font-medium mb-4"
                  style={{ color: currentColor || "#1d19f9" }}
                >
                  {personalInfo.headline}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="two-column-layout flex flex-col md:flex-row gap-2 px-6 ">
          {/* Left Column - Main Content */}
          <div className="left-column md:w-[80%] border-r   pe-3 border-gray-400 space-y-2 ">
            {/* Career Objective / Summary */}
            {profileSummary && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center  gap-3 mb-1 font-bold  uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Career Objective
                </h2>
                <div
                  className="text-gray-700 text-[12px] text-justify leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: profileSummary }}
                />
              </section>
            )}

            {/* Work Experience */}
            {/* {shouldShowSection(workExperience) && (
  <section className="page-section">
    <h2 
      className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b"
      style={{
        borderColor: currentColor || "#1d19f9",
        color: currentColor || "#1d19f9"
      }}
    >
      Professional Experience
    </h2>
    <div className="space-y-6">
      {workExperience.filter(exp => !exp.hidden).map((exp) => (
        <div key={exp.id} className="break-inside-avoid page-subsection">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[14px] text-gray-900 font-semibold">{exp.company}</h3>
              <p className="text-gray-700 text-[12px]">{exp.title}</p>
              <p className="flex gap-2 text-[12px] text-gray-600">
                {exp.employmentType && <span>{exp.employmentType}</span>} 
                {exp.field && <span>{exp.field}</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 font-medium text-[12px]">
                {formatMonthYear(exp.startMonth, exp.startYear, 'short')} –{" "}
                {exp.currentlyWorking ? "Present" : formatMonthYear(exp.endMonth, exp.endYear, 'short')}
              </p>
              {exp.location && (
                <p className="text-gray-500 text-xs mt-1">{exp.location}</p>
              )}
            </div>
          </div>

    
          {exp.description && (
            <div
              className="text-gray-700 text-[12px] leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )} 

<div
  className="text-gray-700 text-[12px] leading-relaxed role-description"
  dangerouslySetInnerHTML={{ __html: exp.description }}
/>




          {exp.bullets?.length > 0 && (
            <ul className="list-disc ml-5 mt-2 text-gray-700 text-[12px]">
              {exp.bullets.map((bullet, i) => (
                <li 
                  key={`bullet-${exp.id}-${i}`}
                  className="text-gray-700 text-[12px]"
                  dangerouslySetInnerHTML={{ __html: bullet }}
                />
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </section>
)} */}

            {shouldShowSection(workExperience) && (
              <section className="page-section mt-3">
                <h2
                  className="text-[14px] flex items-center gap-3 mb-1 font-bold  uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  <FaBriefcase />
                  Work Experience
                </h2>
                <div className="space-y-1">
                  {" "}
                  {/* Reduced from space-y-8 */}
                  {workExperience
                    .filter((exp) => !exp.hidden)
                    .map((exp, index) => (
                      <div
                        key={exp.id}
                        className="break-inside-avoid  page-subsection"
                      >
                        {/* Compact Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                              {exp.company}
                            </h3>
                            <p className="text-[14px] text-gray-700 font-medium mb-1">
                              {exp.title}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              {exp.employmentType && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                  {exp.employmentType}
                                </span>
                              )}
                              {exp.field && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                  {exp.field}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="text-gray-600 text-xs font-medium bg-gray-50 px-2 py-1 rounded">
                              {formatMonthYear(
                                exp.startMonth,
                                exp.startYear,
                                "short"
                              )}{" "}
                              –{" "}
                              {exp.currentlyWorking
                                ? "Present"
                                : formatMonthYear(
                                    exp.endMonth,
                                    exp.endYear,
                                    "short"
                                  )}
                            </p>
                            {exp.location && (
                              <p className="text-gray-500 text-xs mt-1 flex items-center justify-end gap-1">
                                <FaMapMarkerAlt className="text-xs" />{" "}
                                {exp.location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Compact Description */}
                        {exp.description && (
                          <div
                            className="text-gray-700 text-[13px] leading-relaxed mb-2 role-description"
                            dangerouslySetInnerHTML={{
                              __html: exp.description,
                            }}
                          />
                        )}

                        {/* Compact Bullet Points */}
                        {exp.bullets?.length > 0 && (
                          <ul className="list-disc ml-4 mt-2 space-y-1">
                            {exp.bullets.map((bullet, i) => (
                              <li
                                key={`bullet-${exp.id}-${i}`}
                                className="text-gray-700 text-[12px] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: bullet }}
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {shouldShowSection(projects) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b"
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Projects
                </h2>
                <div className="space-y-6">
                  {projects
                    .filter((project) => !project.hidden)
                    .map((project) => (
                      <div
                        key={project.id}
                        className="break-inside-avoid page-subsection"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[14px] font-semibold text-gray-900">
                              {project.title}
                            </h3>
                            {project.organization && (
                              <p className="text-gray-700 text-[12px]">
                                {project.organization}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 font-medium text-[12px]">
                              {formatMonthYear(
                                project.startMonth,
                                project.startYear,
                                "short"
                              )}{" "}
                              –{" "}
                              {project.currentlyWorking
                                ? "Present"
                                : formatMonthYear(
                                    project.endMonth,
                                    project.endYear,
                                    "short"
                                  )}
                            </p>
                          </div>
                        </div>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            className="text-gray-600 text-[12px] hover:underline block mb-2 flex items-center gap-1"
                          >
                            <FaGlobe className="text-xs" /> View Project
                          </a>
                        )}
                        {project.description && (
                          <div
                            className="text-gray-700 text-[12px] leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: project.description,
                            }}
                          />
                        )}
                        {project.bullets?.length > 0 && (
                          <ul className="list-disc ml-5 mt-2 text-gray-700 text-[12px]">
                            {project.bullets.map((bullet, i) => (
                              <li
                                key={`project-bullet-${project.id}-${i}`}
                                className="text-gray-700 text-[12px] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: bullet }}
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Publications */}
            {shouldShowSection(publications) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold uppercase tracking-wide border-b-2 "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Publications
                </h2>

                <div className="">
                  {publications
                    .filter((pub) => !pub.hidden)
                    .map((publication) => (
                      <div
                        key={publication.id}
                        className="break-inside-avoid page-subsection"
                      >
                        {/* Header Row - Title Left, Date Right */}
                        <div className="flex justify-between items-start">
                          <h3 className="text-[14px] font-bold text-gray-900 mt-2 mb-1">
                            {publication.title}
                          </h3>

                          {publication.publicationMonth &&
                            publication.publicationYear && (
                              <p className="text-gray-600 text-xs text-right mt-2 min-w-[100px]">
                                Published:{" "}
                                {formatMonthYear(
                                  publication.publicationMonth,
                                  publication.publicationYear,
                                  "long"
                                )}
                              </p>
                            )}
                        </div>

                        {/* Publisher */}
                        {publication.publisher && (
                          <p className="text-gray-700 text-[12px] mb-1">
                            {publication.publisher}
                          </p>
                        )}

                        {/* Authors */}
                        {publication.authors && (
                          <p className="text-gray-600 text-xs mb-1">
                            <span className="font-semibold">Authors:</span>{" "}
                            {publication.authors}
                          </p>
                        )}

                        {/* Description */}
                        {publication.description && (
                          <div
                            className="text-gray-700 text-[12px] leading-relaxed mt-2 text-left"
                            dangerouslySetInnerHTML={{
                              __html: publication.description,
                            }}
                          />
                        )}

                        {/* URL */}
                        {publication.url && (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 flex items-center gap-2 text-xs  hover:underline"
                          >
                            <FaGlobe className="text-xs" /> View Publication
                          </a>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="right-column md:w-[30%] pe-2 space-y-2">
            {/* Contact Information */}
            <section className="page-section">
              <h2
                className="text-[14px] flex items-center gap-3 font-bold mb-2 uppercase tracking-wide border-b "
                style={{
                  borderColor: currentColor || "#1d19f9",
                  color: currentColor || "#1d19f9",
                }}
              >
                Contact
              </h2>
              <div className="space-y-2 text-[12px]">
                {personalInfo?.email && (
                  <div className="flex flex-wrap gap-1">
                    <strong className="block text-gray-700">Email:</strong>
                    <div className="text-gray-600">{personalInfo.email}</div>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex flex-wrap gap-1">
                    <strong className="block text-gray-700">Phone:</strong>
                    <div className="text-gray-600">{personalInfo.phone}</div>
                  </div>
                )}
                {getLocationText(personalInfo) && (
                  <div className="flex flex-wrap gap-1">
                    <strong className="block text-gray-700">Location:</strong>
                    <div className="text-gray-600">
                      {getLocationText(personalInfo)}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {socialLinks && socialLinks.length > 0 && (
                  <div className="mt-3 page-subsection">
                    <h2
                      className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                      style={{
                        borderColor: currentColor || "#1d19f9",
                        color: currentColor || "#1d19f9",
                      }}
                    >
                      Social Links
                    </h2>
                    <div className="flex flex-col gap-1">
                      {socialLinks.map((link, index) => {
                        const IconComponent = getPlatformIconObject(
                          link.platform
                        );
                        return (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 transition-colors text-[12px]"
                          >
                            {IconComponent}
                            {link.customName ? (
                              <span>{link.customName}</span>
                            ) : (
                              <span>{link.platform}</span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            {/* {skills?.length > 0 && (
              <section className="page-section">
                <h2 
                  className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9"
                  }}
                >
                  Skills
                </h2>
                <div className="">
                  {skills.map((category, idx) => (
                    <div key={`skill-category-${idx}`} className=" py-0.5 my-0 !border-0">
                      <h4 className="font-semibold text-gray-700 text-[12px] ">
                        {category.categoryName.toUpperCase()}
                      </h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-0">
                        {category.skills.map((skill, i) => (
                          <div
                            key={`skill-${idx}-${i}`}
                            className="text-gray-700 text-[12px]"
                          >
                            • {skill} 
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )} */}

            {/* Skills */}
            {((skills?.technical && skills.technical.length > 0) ||
              (skills?.soft && skills.soft.length > 0)) && (
              <section className="page-section">
                {/* <h2 
      className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
      style={{
        borderColor: currentColor || "#1d19f9",
        color: currentColor || "#1d19f9"
      }}
    >
      Skills
    </h2> */}
                <div className="">
                  {/* Show Technical Skills if they exist */}
                  {skills?.technical && skills.technical.length > 0 && (
                    <div className="py-0.5 my-0 !border-0">
                      <h2
                        className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                        style={{
                          borderColor: currentColor || "#1d19f9",
                          color: currentColor || "#1d19f9",
                        }}
                      >
                        TECHNICAL SKILLS
                      </h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-0">
                        {skills.technical.map((skill, i) => (
                          <div
                            key={`tech-skill-${i}`}
                            className="text-gray-700 text-[12px]"
                          >
                            • {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show Soft Skills if they exist */}
                  {skills?.soft && skills.soft.length > 0 && (
                    <div className="py-0.5 my-0 !border-0">
                      <h2
                        className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                        style={{
                          borderColor: currentColor || "#1d19f9",
                          color: currentColor || "#1d19f9",
                        }}
                      >
                        SOFT SKILLS
                      </h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-0">
                        {skills.soft.map((skill, i) => (
                          <div
                            key={`soft-skill-${i}`}
                            className="text-gray-700 text-[12px]"
                          >
                            • {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Education */}
            {/* {shouldShowSection(education) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Education
                </h2>
                <div className="space-y-3">
                  {education
                    .filter((edu) => !edu.hidden)
                    .map((edu) => (
                      <div key={edu.id} className="text-[12px] text-gray-700 leading-snug">
                        {edu.course && (
                          <h3 className="font-semibold text-gray-900 text-[12px] mb-1">
                            {edu.course}
                          </h3>
                        )}
                        {(edu.college || edu.level) && (
                          <p className="text-gray-600 text-[12px] mb-1">
                            {edu.level} {edu.college && ` • ${edu.college}`} 
                          </p>
                        )}
                        {edu.specialisation && (
                          <p className="text-gray-500 text-[12px] mb-1">
                            <strong>Specialization:</strong> {edu.specialisation}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs">
                          {formatMonthYear(edu.startMonth, edu.startYear, "short")} –{" "}
                          {edu.currentlyStudying
                            ? "Present"
                            : formatMonthYear(edu.endMonth, edu.endYear, "short")}
                        </p>
                        {edu.marks && (
                          <p className="text-gray-500 text-xs mt-0.5">
                            <strong>GPA:</strong> {edu.marks}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )} */}

            {/* Education */}
            {shouldShowSection(education) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-2 font-bold mb-3 uppercase tracking-wide border-b-2 pb-1"
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Education
                </h2>

                <div className="space-y-2">
                  {education
                    .filter((edu) => !edu.hidden)
                    .map((edu) => (
                      <div
                        key={edu.id}
                        className="text-[12px] leading-relaxed break-inside-avoid page-subsection"
                      >
                        {/* Course Name */}
                        {edu.course && (
                          <h3 className="font-medium text-gray-700 text-[12px]">
                            {edu.course}
                          </h3>
                        )}

                        {/* Level + College */}
                        {(edu.level || edu.college) && (
                          <p className="text-gray-700 font-medium text-[13.5px]">
                            {edu.level}
                            {edu.college && (
                              <span className="text-gray-500 font-normal">
                                {" • "} {edu.college}
                              </span>
                            )}
                          </p>
                        )}

                        {/* Specialization */}
                        {edu.specialisation && (
                          <p className="text-gray-600 text-[13px]">
                            <span className="font-semibold">
                              Specialization:
                            </span>{" "}
                            {edu.specialisation}
                          </p>
                        )}

                        {/* Dates */}
                        {/* Dates */}
                        {(edu.startMonth ||
                          edu.startYear ||
                          edu.endMonth ||
                          edu.endYear) && (
                          <p className="text-gray-500 text-[12.5px] flex items-center gap-1">
                            <FaCalendarAlt className="text-[12px] text-gray-700 font-medium" />
                            {formatMonthYear(
                              edu.startMonth,
                              edu.startYear,
                              "short"
                            )}{" "}
                            –{" "}
                            {edu.currentlyStudying
                              ? "Present"
                              : formatMonthYear(
                                  edu.endMonth,
                                  edu.endYear,
                                  "short"
                                )}
                          </p>
                        )}

                        {/* Marks / GPA */}
                        {edu.marks && (
                          <p className="text-gray-600 text-[12.5px]">
                            <span className="font-semibold">GPA:</span>{" "}
                            {edu.marks}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Certificates */}
            {shouldShowSection(certificates) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b"
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certificates
                    .filter((cert) => !cert.hidden)
                    .map((cert) => (
                      <div
                        key={cert.id}
                        className="break-inside-avoid page-subsection"
                      >
                        <div>
                          <h3 className="text-[14px] font-semibold text-gray-600">
                            {cert.name}
                          </h3>
                          <p className="text-gray-700 text-[12px]">
                            {cert.authority}
                          </p>
                          {cert.issueDate && (
                            <p className="text-gray-600 text-xs mb-2">
                              Issued: {cert.issueDate}
                            </p>
                          )}
                          {cert.media && (
                            <a
                              href={
                                typeof cert.media === "string"
                                  ? cert.media
                                  : URL.createObjectURL(cert.media)
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" text-[12px] text-gray-700 flex items-center gap-1"
                            >
                              <FaGlobe className="text-[12px]" /> View Link
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Awards & Achievements */}
            {shouldShowSection(awardsAchievements) && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-3 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Awards/Achievements
                </h2>
                <div className="space-y-3">
                  {awardsAchievements
                    .filter((item) => !item.hidden)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="break-inside-avoid page-subsection"
                      >
                        <h3 className="text-[14px] font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-[12px] flex items-center">
                          <span>Issued by: {item.issuer}</span>
                        </p>
                        {item.media && (
                          <p>
                            <a
                              href={
                                typeof item.media === "string"
                                  ? item.media
                                  : URL.createObjectURL(item.media)
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-gray-700 flex items-center gap-1"
                            >
                              <FaGlobe className="text-[12px]" /> View Link
                            </a>
                          </p>
                        )}
                        {item.description && (
                          <div
                            className="text-gray-700 text-[12px] leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Interests */}
            {interests?.length > 0 && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-2 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Professional Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <span
                      key={`interest-${idx}`}
                      className="text-gray-800 text-[12px]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {/* {languages?.length > 0 && (
              <section className="page-section">
                <h2 
                  className="text-[14px] flex items-center gap-3 font-bold mb-2 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9"
                  }}
                >
                  Languages
                </h2>
                <div className="flex flex-col gap-1">
                  {languages.map((language, idx) => (
                    <div
                      key={`language-${idx}`}
                      className="flex items-center justify-between w-full break-inside-avoid page-subsection"
                    >
                      <p className="text-gray-600">
                        {language || "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )} */}
            {/* Languages - Simple Layout */}
            {languages?.length > 0 && (
              <section className="page-section">
                <h2
                  className="text-[14px] flex items-center gap-3 font-bold mb-1 uppercase tracking-wide border-b "
                  style={{
                    borderColor: currentColor || "#1d19f9",
                    color: currentColor || "#1d19f9",
                  }}
                >
                  Languages
                </h2>
                <div className=" ">
                  {languages.map((language, idx) => (
                    <div
                      key={`language-${idx}`}
                      className="flex justify-between items-center  page-subsection !py-0.5 !my-0.5"
                    >
                      <span className="text-gray-700 text-[12px]">
                        {language.language || language}
                      </span>
                      <span className="text-gray-500 text-xs px-2  rounded capitalize">
                        {language.proficiency || "Intermediate"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
