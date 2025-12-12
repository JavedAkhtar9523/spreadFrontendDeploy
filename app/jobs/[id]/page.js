
"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  GraduationCap,
  Heart,
  Bookmark,
  Share2,
  Building2,
  Users,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Upload,
  X,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  Star,
  Eye,
} from "lucide-react";

// Mock user profile data (in real app, this would come from authentication/profile system)
const mockUserProfile = {
  fullName: "Rahul Kumar",
  email: "rahul.kumar@example.com",
  phone: "9876543210",
  linkedin: "http://linkedin.com/in/rahulkumar",
  portfolio: "https://rahulkumar.dev",
  experience: "3-5",
  currentCtc: "₹12 LPA",
  expectedCtc: "₹18 LPA",
  noticePeriod: "30days",
  resumeFile: {
    name: "Rahul_Kumar_Resume.pdf",
    size: 245000, // in bytes
  },
};

// Mock data generator
const generateMockJobs = () => {
  const companies = [
    { name: "Google", logo: "G", color: "bg-blue-600" },
    { name: "Microsoft", logo: "M", color: "bg-green-600" },
    { name: "Amazon", logo: "A", color: "bg-orange-500" },
    { name: "Meta", logo: "F", color: "bg-blue-500" },
    { name: "Apple", logo: "A", color: "bg-gray-800" },
    { name: "Netflix", logo: "N", color: "bg-red-600" },
    { name: "Tesla", logo: "T", color: "bg-red-500" },
    { name: "Spotify", logo: "S", color: "bg-green-500" },
    { name: "Adobe", logo: "A", color: "bg-red-600" },
    { name: "Salesforce", logo: "S", color: "bg-blue-400" },
  ];

  const titles = [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Frontend Engineer",
    "Backend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Machine Learning Engineer",
    "Cloud Architect",
  ];

  const locations = [
    "Bangalore, Karnataka",
    "Mumbai, Maharashtra",
    "Pune, Maharashtra",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Delhi, NCR",
    "Gurgaon, Haryana",
    "Remote",
  ];

  const workModes = ["Remote", "Hybrid", "On-site"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const skillSets = [
    ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
    ["Java", "Spring Boot", "MySQL", "Microservices", "Jenkins"],
    ["React", "TypeScript", "Redux", "Tailwind CSS", "Next.js"],
    ["Angular", "RxJS", "NgRx", "Material UI", "GraphQL"],
    ["Vue.js", "Nuxt.js", "Vuex", "Firebase", "GCP"],
  ];

  const jobs = [];
  for (let i = 0; i < 25; i++) {
    const company = companies[i % companies.length];
    const daysAgo = Math.floor(Math.random() * 30);

    jobs.push({
      id: i + 1,
      title: titles[i % titles.length],
      company: company.name,
      companyLogo: company.logo,
      companyColor: company.color,
      location: locations[Math.floor(Math.random() * locations.length)],
      salary: `₹${Math.floor(Math.random() * 40 + 10)}L - ₹${Math.floor(
        Math.random() * 50 + 40
      )}L`,
      workMode: workModes[Math.floor(Math.random() * workModes.length)],
      jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      education: ["Bachelor's", "Master's", "Any"][
        Math.floor(Math.random() * 3)
      ],
      experience: `${Math.floor(Math.random() * 10)}+ years`,
      postedDate:
        daysAgo === 0
          ? "Today"
          : daysAgo === 1
          ? "Yesterday"
          : `${daysAgo} days ago`,
      daysAgo: daysAgo,
      skills: skillSets[i % skillSets.length],
      description:
        "We are looking for a talented professional to join our dynamic team.",
      fullDescription: `
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">About the Role</h3>
        <p style="margin-bottom: 1.5rem; color: #4b5563;">We are seeking an experienced professional to join our innovative team. This role offers an exciting opportunity to work on challenging projects and make a significant impact on our products and services.</p>
        
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Key Responsibilities</h3>
        <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #4b5563;">
          <li style="margin-bottom: 0.5rem;">Design and develop scalable software solutions</li>
          <li style="margin-bottom: 0.5rem;">Collaborate with cross-functional teams to deliver high-quality products</li>
          <li style="margin-bottom: 0.5rem;">Write clean, maintainable code following best practices</li>
          <li style="margin-bottom: 0.5rem;">Participate in code reviews and technical discussions</li>
          <li style="margin-bottom: 0.5rem;">Mentor junior team members and share knowledge</li>
          <li style="margin-bottom: 0.5rem;">Contribute to architectural decisions and technical strategy</li>
        </ul>
        
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Requirements</h3>
        <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #4b5563;">
          <li style="margin-bottom: 0.5rem;">Strong problem-solving and analytical skills</li>
          <li style="margin-bottom: 0.5rem;">Excellent communication and collaboration abilities</li>
          <li style="margin-bottom: 0.5rem;">Experience with modern development tools and frameworks</li>
          <li style="margin-bottom: 0.5rem;">Ability to work in a fast-paced environment</li>
          <li style="margin-bottom: 0.5rem;">Bachelor's degree in Computer Science or related field</li>
          <li style="margin-bottom: 0.5rem;">Proven track record of delivering quality software</li>
        </ul>
        
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Benefits</h3>
        <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: #4b5563;">
          <li style="margin-bottom: 0.5rem;">Competitive salary and equity options</li>
          <li style="margin-bottom: 0.5rem;">Comprehensive health insurance for you and your family</li>
          <li style="margin-bottom: 0.5rem;">Flexible working hours and remote work options</li>
          <li style="margin-bottom: 0.5rem;">Learning and development budget for courses and conferences</li>
          <li style="margin-bottom: 0.5rem;">Modern office with latest equipment and tools</li>
          <li style="margin-bottom: 0.5rem;">Regular team outings and company events</li>
        </ul>
      `,
      views: Math.floor(Math.random() * 1000 + 100),
      applicants: Math.floor(Math.random() * 500 + 50),
      matchScore: Math.floor(Math.random() * 30 + 70),
      isFeatured: Math.random() > 0.7,
      isNew: daysAgo <= 2,
      isHiring: Math.random() > 0.6,
      isBookmarked: false,
      isLiked: false,
      isApplied: false,
      companySize: ["Startup", "Mid-size", "Large", "Enterprise"][
        Math.floor(Math.random() * 4)
      ],
      industry: ["Technology", "Finance", "Healthcare", "E-commerce"][
        Math.floor(Math.random() * 4)
      ],
      companyWebsite: "https://company.com",
      companyEmail: "careers@company.com",
      companyPhone: "+91-9876543210",
    });
  }
  return jobs;
};

const JobDetailsPage = ({ params }) => {
  const [job, setJob] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);

  // User profile state
  const [userProfile] = useState(mockUserProfile);

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    resume: null,
    coverLetter: "",
    experience: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const jobs = generateMockJobs();
    const foundJob = jobs.find((j) => j.id === parseInt(params.id || 1));
    if (foundJob) {
      setJob(foundJob);
      setIsBookmarked(foundJob.isBookmarked);
      setIsLiked(foundJob.isLiked);

      const similar = jobs
        .filter(
          (j) =>
            j.id !== foundJob.id &&
            (j.industry === foundJob.industry ||
              j.skills.some((s) => foundJob.skills.includes(s)))
        )
        .slice(0, 3);
      setSimilarJobs(similar);
    }
  }, [params.id]);

  // Pre-fill form when modal opens
  const handleOpenApplyModal = () => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        linkedin: userProfile.linkedin || "",
        portfolio: userProfile.portfolio || "",
        resume: userProfile.resumeFile || null,
        coverLetter: "",
        experience: userProfile.experience || "",
        currentCtc: userProfile.currentCtc || "",
        expectedCtc: userProfile.expectedCtc || "",
        noticePeriod: userProfile.noticePeriod || "",
      });
    }
    setShowApplyModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
      if (formErrors.resume) {
        setFormErrors((prev) => ({ ...prev, resume: "" }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Invalid phone number";
    }
    if (!formData.resume) errors.resume = "Resume is required";
    if (!formData.experience) errors.experience = "Experience is required";
    if (!formData.currentCtc.trim())
      errors.currentCtc = "Current CTC is required";
    if (!formData.expectedCtc.trim())
      errors.expectedCtc = "Expected CTC is required";
    if (!formData.noticePeriod)
      errors.noticePeriod = "Notice period is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setTimeout(() => {
        setApplicationSubmitted(true);
        setJob((prev) => ({ ...prev, isApplied: true }));
      }, 1000);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const ApplyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!applicationSubmitted ? (
          <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply for this position
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {job?.title} at {job?.company}
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
              {/* Profile Data Pre-filled Indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Profile data auto-filled
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Your saved profile information has been pre-filled below.
                    You can edit any field before submitting.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.fullName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="+91-9876543210"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.experience
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-8">5-8 years</option>
                      <option value="8+">8+ years</option>
                    </select>
                    {formErrors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notice Period *
                    </label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.noticePeriod
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select notice period</option>
                      <option value="immediate">Immediate</option>
                      <option value="15days">15 days</option>
                      <option value="30days">30 days</option>
                      <option value="60days">60 days</option>
                      <option value="90days">90 days</option>
                    </select>
                    {formErrors.noticePeriod && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.noticePeriod}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current CTC *
                    </label>
                    <input
                      type="text"
                      name="currentCtc"
                      value={formData.currentCtc}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.currentCtc
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="₹12 LPA"
                    />
                    {formErrors.currentCtc && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.currentCtc}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected CTC *
                    </label>
                    <input
                      type="text"
                      name="expectedCtc"
                      value={formData.expectedCtc}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.expectedCtc
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="₹18 LPA"
                    />
                    {formErrors.expectedCtc && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.expectedCtc}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documents
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume *
                    </label>

                    {/* Show pre-filled resume */}
                    {formData.resume && formData.resume.name ? (
                      <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formData.resume.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formData.resume.size
                                  ? `${(formData.resume.size / 1024).toFixed(
                                      1
                                    )} KB`
                                  : "From your profile"}
                              </p>
                            </div>
                          </div>
                          <label
                            htmlFor="resume-upload"
                            className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Change
                          </label>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="resume-upload"
                        />
                      </div>
                    ) : (
                      <div
                        className={`border-2 border-dashed ${
                          formErrors.resume
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer`}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </label>
                      </div>
                    )}
                    {formErrors.resume && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.resume}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your application for {job?.title} at {job?.company} has been
              submitted. We'll review your application and get back to you soon.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplicationSubmitted(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Browsing Jobs
              </button>
              <button
                onClick={handleBack}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Job Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex gap-6 mb-6">
                <div
                  className={`${job.companyColor} w-20 h-20 rounded-xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0`}
                >
                  {job.companyLogo}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h1>
                      <p className="text-xl text-gray-700 font-medium mb-2">
                        {job.company}
                      </p>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.postedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {job.views} views
                        </span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-700" /> Featured
                      </span>
                    )}
                    {job.isNew && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                    {job.isHiring && (
                      <span className="bg-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        Actively Hiring
                      </span>
                    )}
                    {job.isApplied && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        Applied ✓
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleOpenApplyModal}
                      disabled={job.isApplied}
                      className={`${
                        job.isApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
                    >
                      {job.isApplied ? "Applied ✓" : "Apply Now"}
                    </button>
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isBookmarked
                          ? "bg-blue-50 border-blue-600"
                          : "border-gray-300 hover:border-blue-600"
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isBookmarked
                            ? "fill-blue-600 text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isLiked
                          ? "bg-red-50 border-red-600"
                          : "border-gray-300 hover:border-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isLiked
                            ? "fill-red-600 text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button className="p-3 rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Salary</p>
                  <p className="font-semibold text-gray-900">{job.salary}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Work Mode</p>
                  <p className="font-semibold text-gray-900">{job.workMode}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Job Type</p>
                  <p className="font-semibold text-gray-900">{job.jobType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">
                    {job.experience}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Job Description
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: job.fullDescription }}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Similar Jobs
              </h2>
              <div className="space-y-4">
                {similarJobs.map((similarJob) => (
                  <div
                    key={similarJob.id}
                    onClick={() =>
                      (window.location.href = `/jobs/${similarJob.id}`)
                    }
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                  >
                    <div className="flex gap-4">
                      <div
                        className={`${similarJob.companyColor} w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}
                      >
                        {similarJob.companyLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600">
                          {similarJob.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {similarJob.company} • {similarJob.location}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {similarJob.workMode}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {similarJob.salary}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                            {similarJob.matchScore}% Match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  About Company
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Company Size</p>
                      <p className="font-semibold text-gray-900">
                        {job.companySize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Industry</p>
                      <p className="font-semibold text-gray-900">
                        {job.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">Headquarters</p>
                      <p className="font-semibold text-gray-900">
                        {job.location.split(",")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Application Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="font-bold text-gray-900">{job.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applicants</span>
                    <span className="font-bold text-gray-900">
                      {job.applicants}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="font-bold text-gray-900">
                      {job.postedDate}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-start gap-2 text-xs text-gray-700 bg-white p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p>
                      Apply soon! This position is receiving high interest from
                      candidates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Contact Recruiter
                </h3>
                <div className="space-y-3 text-sm">
                  <a
                    href={`mailto:${job.companyEmail}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{job.companyEmail}</span>
                  </a>
                  <a
                    href={`tel:${job.companyPhone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{job.companyPhone}</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Ready to Apply?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Don't miss this opportunity to join an amazing team!
                </p>
                <button
                  onClick={handleOpenApplyModal}
                  disabled={job.isApplied}
                  className={`w-full ${
                    job.isApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  } py-3 rounded-lg font-semibold transition-colors`}
                >
                  {job.isApplied ? "Already Applied ✓" : "Apply Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && <ApplyModal />}
    </div>
  );
};

export default JobDetailsPage;
