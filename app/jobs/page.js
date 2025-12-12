
"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  Heart,
  Bookmark,
  Share2,
  Grid3x3,
  List,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  TrendingUp,
  Star,
  Building2,
  Users,
  Calendar,
  Filter,
  Mic,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock Job Data
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
    { name: "IBM", logo: "I", color: "bg-blue-700" },
    { name: "Oracle", logo: "O", color: "bg-red-600" },
    { name: "Intel", logo: "I", color: "bg-blue-600" },
    { name: "Cisco", logo: "C", color: "bg-blue-500" },
    { name: "PayPal", logo: "P", color: "bg-blue-600" },
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
    "Mobile Developer",
    "Quality Assurance Engineer",
    "Technical Lead",
    "System Administrator",
    "Business Analyst",
    "Cybersecurity Engineer",
    "Database Administrator",
    "Scrum Master",
    "Python Developer",
    "React Native Developer",
    "Java Developer",
    "Solutions Architect",
    "AI Research Scientist",
    "Technical Writer",
  ];

  const locations = [
    "Bangalore, Karnataka",
    "Mumbai, Maharashtra",
    "Pune, Maharashtra",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Delhi, NCR",
    "Gurgaon, Haryana",
    "Noida, Uttar Pradesh",
    "Remote",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
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
    ["C++", "System Design", "Algorithms", "Linux", "Git"],
    ["Go", "Microservices", "gRPC", "Redis", "Kafka"],
  ];

  const jobs = [];
  for (let i = 0; i < 25; i++) {
    const company = companies[i % companies.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const isFeatured = Math.random() > 0.7;
    const isNew = daysAgo <= 2;
    const isHiring = Math.random() > 0.6;

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
        "We are looking for a talented professional to join our dynamic team. You will work on cutting-edge projects and collaborate with industry experts to deliver innovative solutions.",
      views: Math.floor(Math.random() * 1000 + 100),
      matchScore: Math.floor(Math.random() * 30 + 70),
      isFeatured,
      isNew,
      isHiring,
      isBookmarked: false,
      isLiked: false,
      isApplied: Math.random() > 0.8,
      companySize: ["Startup", "Mid-size", "Large", "Enterprise"][
        Math.floor(Math.random() * 4)
      ],
      industry: ["Technology", "Finance", "Healthcare", "E-commerce"][
        Math.floor(Math.random() * 4)
      ],
    });
  }
  return jobs;
};

const JobSearchPage = () => {
  const [jobs, setJobs] = useState(generateMockJobs());
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobsToShow, setJobsToShow] = useState(12);
  const [comparisonJobs, setComparisonJobs] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [0, 50],
    salaryType: "annual",
    workMode: "",
    education: "",
    industries: [],
    companySize: "",
    postedDate: "",
    skills: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    experience: false,
    salary: false,
    workMode: true,
    education: false,
    industry: false,
    companySize: false,
    posted: true,
    skills: false,
  });

  useEffect(() => {
    applyFilters();
  }, [searchQuery, locationQuery, filters, sortBy]);

  useEffect(() => {
    setDisplayedJobs(filteredJobs.slice(0, jobsToShow));
  }, [filteredJobs, jobsToShow]);

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...jobs];

      if (searchQuery) {
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some((skill) =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      if (locationQuery) {
        filtered = filtered.filter((job) =>
          job.location.toLowerCase().includes(locationQuery.toLowerCase())
        );
      }

      if (filters.jobTypes.length > 0) {
        filtered = filtered.filter((job) =>
          filters.jobTypes.includes(job.jobType)
        );
      }

      if (filters.workMode) {
        filtered = filtered.filter((job) => job.workMode === filters.workMode);
      }

      if (filters.education && filters.education !== "Any") {
        filtered = filtered.filter(
          (job) => job.education === filters.education
        );
      }

      if (filters.industries.length > 0) {
        filtered = filtered.filter((job) =>
          filters.industries.includes(job.industry)
        );
      }

      if (filters.companySize) {
        filtered = filtered.filter(
          (job) => job.companySize === filters.companySize
        );
      }

      if (filters.postedDate) {
        const dayLimits = { "24h": 1, "7d": 7, "14d": 14, "30d": 30 };
        const limit = dayLimits[filters.postedDate];
        if (limit) {
          filtered = filtered.filter((job) => job.daysAgo <= limit);
        }
      }

      if (filters.skills.length > 0) {
        filtered = filtered.filter((job) =>
          filters.skills.some((skill) => job.skills.includes(skill))
        );
      }

      // Sorting
      if (sortBy === "recent") {
        filtered.sort((a, b) => a.daysAgo - b.daysAgo);
      } else if (sortBy === "salary-high") {
        filtered.sort((a, b) => {
          const aMax = parseInt(a.salary.split("-")[1].replace(/[^0-9]/g, ""));
          const bMax = parseInt(b.salary.split("-")[1].replace(/[^0-9]/g, ""));
          return bMax - aMax;
        });
      } else if (sortBy === "salary-low") {
        filtered.sort((a, b) => {
          const aMin = parseInt(a.salary.split("-")[0].replace(/[^0-9]/g, ""));
          const bMin = parseInt(b.salary.split("-")[0].replace(/[^0-9]/g, ""));
          return aMin - bMin;
        });
      } else if (sortBy === "match") {
        filtered.sort((a, b) => b.matchScore - a.matchScore);
      }

      setFilteredJobs(filtered);
      setLoading(false);
    }, 300);
  };

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[category])) {
        const updated = prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value];
        return { ...prev, [category]: updated };
      }
      return { ...prev, [category]: value };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      jobTypes: [],
      experienceLevels: [],
      salaryRange: [0, 50],
      salaryType: "annual",
      workMode: "",
      education: "",
      industries: [],
      companySize: "",
      postedDate: "",
      skills: [],
    });
    setSearchQuery("");
    setLocationQuery("");
  };

  const toggleBookmark = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
    setFilteredJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
  };

  const toggleLike = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isLiked: !job.isLiked } : job
      )
    );
    setFilteredJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isLiked: !job.isLiked } : job
      )
    );
  };

  const addToComparison = (job) => {
    if (
      comparisonJobs.length < 3 &&
      !comparisonJobs.find((j) => j.id === job.id)
    ) {
      setComparisonJobs([...comparisonJobs, job]);
    }
  };

  const removeFromComparison = (jobId) => {
    setComparisonJobs(comparisonJobs.filter((j) => j.id !== jobId));
  };

  const activeFilterCount =
    filters.jobTypes.length +
    filters.industries.length +
    filters.skills.length +
    (filters.workMode ? 1 : 0) +
    (filters.education ? 1 : 0) +
    (filters.companySize ? 1 : 0) +
    (filters.postedDate ? 1 : 0);

  const JobCard = ({ job }) => (
    <div
      onClick={() => (window.location.href = `/jobfeed/${job.id}`)}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className={`${job.companyColor} w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold flex-shrink-0`} >
          {job.companyLogo}
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer truncate">
                {job.title}
              </h3>
              <div className="text-gray-600 text-sm flex items-center gap-2 flex-wrap">
                <span className="hover:text-blue-600 cursor-pointer font-medium">
                  {job.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-start flex-shrink-0">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                {job.matchScore}% Match
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
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
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                Actively Hiring
              </span>
            )}
            {job.isApplied && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                Applied ✓
              </span>
            )}
          </div>

          {/* Job Info */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              {/* <DollarSign className="w-4 h-4 text-green-600" /> */}
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              {job.workMode}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-purple-600" />
              {job.jobType}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-600" />
              {job.postedDate}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
            <span className="text-blue-600 ml-1 cursor-pointer hover:underline font-medium">
              Read more
            </span>
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Quick Apply
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/jobfeed/${job.id}`;
              }}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => toggleBookmark(job.id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  job.isBookmarked
                    ? "fill-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              />
            </button>
            <button
              onClick={() => toggleLike(job.id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  job.isLiked ? "fill-red-600 text-red-600" : "text-gray-500"
                }`}
              />
            </button>
            <button
              onClick={() => addToComparison(job)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm ml-auto"
            >
              <Plus className="w-4 h-4" /> Compare
            </button>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {job.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
        )}
      </button>
      {isExpanded && <div className="space-y-2.5">{children}</div>}
    </div>
  );

  return (
    <div className="mt-5 min-h-screen bg-gray-50 text-gray-900">
      {/* Sticky Search Bar */}
      {/* <div className="sticky top-10 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-[3]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <div className="relative flex-[2]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State, or Remote"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
                />
              </div>
            </div>
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-3 rounded-lg bg-blue-600 text-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div
            className={`${
              showFilters
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent"
                : "hidden"
            } lg:block lg:w-80 flex-shrink-0`}
          >
            <div
              className={`${
                showFilters
                  ? "absolute right-0 top-0 bottom-0 w-80 overflow-y-auto"
                  : "sticky top-24"
              } bg-white border-gray-200 border rounded-xl p-5 max-h-[calc(100vh-120px)] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    Clear All
                  </button>
                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-5">
                <div className="flex flex-wrap gap-2">
                  {["Remote", "Full-time", "Part-time"].map((filter) => (
                    <button
                      key={filter}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <FilterSection
                title="Job Type"
                isExpanded={expandedSections.jobType}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    jobType: !prev.jobType,
                  }))
                }
              >
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                  "Freelance",
                ].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.jobTypes.includes(type)}
                      onChange={() => toggleFilter("jobTypes", type)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {type}
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Work Mode */}
              <FilterSection
                title="Work Mode"
                isExpanded={expandedSections.workMode}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    workMode: !prev.workMode,
                  }))
                }
              >
                {["Remote", "Hybrid", "On-site"].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="workMode"
                      checked={filters.workMode === mode}
                      onChange={() => toggleFilter("workMode", mode)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {mode}
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Posted Date */}
              <FilterSection
                title="Posted Date"
                isExpanded={expandedSections.posted}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    posted: !prev.posted,
                  }))
                }
              >
                {[
                  { label: "Last 24 hours", value: "24h" },
                  { label: "Last 7 days", value: "7d" },
                  { label: "Last 14 days", value: "14d" },
                  { label: "Last 30 days", value: "30d" },
                  { label: "Anytime", value: "" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="postedDate"
                      checked={filters.postedDate === option.value}
                      onChange={() => toggleFilter("postedDate", option.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Education */}
              <FilterSection
                title="Education"
                isExpanded={expandedSections.education}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    education: !prev.education,
                  }))
                }
              >
                <select
                  value={filters.education}
                  onChange={(e) => toggleFilter("education", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 border-gray-300 border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </FilterSection>

              {/* Industry */}
              <FilterSection
                title="Industry"
                isExpanded={expandedSections.industry}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    industry: !prev.industry,
                  }))
                }
              >
                {["Technology", "Finance", "Healthcare", "E-commerce"].map(
                  (industry) => (
                    <label
                      key={industry}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.industries.includes(industry)}
                        onChange={() => toggleFilter("industries", industry)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {industry}
                      </span>
                    </label>
                  )
                )}
              </FilterSection>

              {/* Company Size */}
              <FilterSection
                title="Company Size"
                isExpanded={expandedSections.companySize}
                onToggle={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    companySize: !prev.companySize,
                  }))
                }
              >
                {["Startup", "Mid-size", "Large", "Enterprise"].map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="companySize"
                      checked={filters.companySize === size}
                      onChange={() => toggleFilter("companySize", size)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {size}
                    </span>
                  </label>
                ))}
              </FilterSection>

              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors mt-4 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Featured Jobs Carousel */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Featured Jobs
                </h2>
              </div>
              <div className="relative group">
                <div
                  className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  id="featured-scroll"
                >
                  {jobs
                    .filter((job) => job.isFeatured)
                    .slice(0, 8)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="min-w-[400px] snap-start flex-shrink-0"
                      >
                        <JobCard job={job} />
                      </div>
                    ))}
                </div>
                <style jsx>{`
                  #featured-scroll::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
              </div>
            </div>

            {/* Top Bar */}
            <div className="bg-white border-gray-200 border rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold text-sm">
                  {filteredJobs.length} jobs found
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-50 border-gray-300 border focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="salary-high">Salary (High to Low)</option>
                  <option value="salary-low">Salary (Low to High)</option>
                  <option value="match">Best Match</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-2 font-medium">
                  <Bookmark className="w-4 h-4" />
                  Save Search
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  } gap-6`}
                >
                  {displayedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Load More */}
                {filteredJobs.length > displayedJobs.length && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setJobsToShow((prev) => prev + 12)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-sm"
                    >
                      Load More Jobs (
                      {filteredJobs.length - displayedJobs.length} remaining)
                    </button>
                  </div>
                )}

                {filteredJobs.length === 0 && (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Recommended Jobs */}
            {filteredJobs.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Recommended for You
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs
                    .filter((job) => job.matchScore >= 85)
                    .slice(0, 3)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`${job.companyColor} w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold`}
                          >
                            {job.companyLogo}
                          </div>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {job.matchScore}% Match
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-700 font-medium text-sm mb-3">
                          {job.company}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {/* <DollarSign className="w-4 h-4 text-green-600" /> */}
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4 text-purple-600" />
                            {job.workMode} • {job.jobType}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          Apply Now
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Comparison Bar */}
      {comparisonJobs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-gray-200 border-t shadow-2xl p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Compare Jobs ({comparisonJobs.length}/3)
              </h3>
              <button
                onClick={() => setComparisonJobs([])}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {comparisonJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-50 rounded-lg p-4 min-w-[250px] flex-shrink-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {job.title}
                      </h4>
                      <p className="text-gray-600 text-xs truncate">
                        {job.company}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromComparison(job.id)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-gray-600 text-xs space-y-1">
                    <p>💰 {job.salary}</p>
                    <p>📍 {job.workMode}</p>
                    <p>⭐ {job.matchScore}% Match</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
              Compare Selected Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;

// ========================
