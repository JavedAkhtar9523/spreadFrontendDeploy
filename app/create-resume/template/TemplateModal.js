
"use client";
import { useState, useMemo } from "react";
import { FiX, FiSearch, FiCheck, FiFilter } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { resumeTemplates } from "./templateManager";

// Mock data - replace with your actual data
const templateCategories = {
  technology: {
    name: "Technology & IT",
    description: "For software developers, engineers, IT professionals",
    icon: "💻",
    templates: ["tech-minimal", "developer-modern", "ai-specialist"],
  },
  business: {
    name: "Business & Management",
    description: "For managers, executives, business professionals",
    icon: "💼",
    templates: ["executive-classic", "manager-professional"],
  },
  creative: {
    name: "Creative & Design",
    description: "For designers, artists, creative professionals",
    icon: "🎨",
    templates: ["creative-portfolio", "designer-modern"],
  },
  healthcare: {
    name: "Healthcare",
    description: "For doctors, nurses, healthcare professionals",
    icon: "🏥",
    templates: ["healthcare-professional", "medical-modern"],
  },
};

const experienceLevels = {
  entry: {
    name: "Entry Level",
    description: "For freshers and 0-2 years experience",
  },
  mid: { name: "Mid Level", description: "For 2-5 years experience" },
  senior: { name: "Senior Level", description: "For 5+ years experience" },
  executive: {
    name: "Executive",
    description: "For C-level and leadership roles",
  },
};

// const resumeTemplates = {
//   "tech-minimal": {
//      id: 'professional', // This should match the case in switch statement
//     name: 'Professional',
//     category: "technology",
//     experienceLevel: "mid",
//     layout: "minimal",
//     style: "modern",
//     description: "Clean tech-focused design for developers",
//     rating: 4.8,
//     popularity: 95,
//     atsFriendly: true,
//     recommendedFor: ["Software Developer", "Web Developer"],
//   },
//   "developer-modern": {
//     id: "developer-modern",
//     name: "Developer Modern",
//     category: "technology",
//     experienceLevel: "mid",
//     layout: "twoColumn",
//     style: "modern",
//     description: "Modern layout with code-friendly design",
//     rating: 4.7,
//     popularity: 92,
//     atsFriendly: true,
//     recommendedFor: ["Full Stack Developer", "Backend Engineer"],
//   },
//   "executive-classic": {
//     id: "executive-classic",
//     name: "Executive Classic",
//     category: "business",
//     experienceLevel: "executive",
//     layout: "single",
//     style: "classic",
//     description: "Elegant design for senior leadership",
//     rating: 4.8,
//     popularity: 90,
//     atsFriendly: true,
//     recommendedFor: ["CEO", "Director", "VP"],
//   },
//   "creative-portfolio": {
//     id: "creative-portfolio",
//     name: "Creative Portfolio",
//     category: "creative",
//     experienceLevel: "mid",
//     layout: "twoColumn",
//     style: "creative",
//     description: "Visual-focused design for creatives",
//     rating: 4.7,
//     popularity: 89,
//     atsFriendly: false,
//     recommendedFor: ["Graphic Designer", "UI/UX Designer"],
//   },
// };

export default function TemplateModal({
  isOpen,
  onClose,
  onTemplateSelect,
  currentTemplate,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const filteredTemplates = useMemo(() => {
    let filtered = Object.values(resumeTemplates);

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }

    if (selectedExperience !== "all") {
      filtered = filtered.filter(
        (template) => template.experienceLevel === selectedExperience
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          template.recommendedFor.some((role) =>
            role.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  }, [selectedCategory, selectedExperience, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedExperience("all");
    setSearchTerm("");
  };

  const handleTemplateSelect = (templateId) => {
    onTemplateSelect(templateId);
    // Don't auto-close, let parent handle it
  };

  const generateTemplatePreview = (template) => {
    const previewColors = {
      modern: { primary: "#2563eb", secondary: "#1e40af" },
      classic: { primary: "#4b5563", secondary: "#374151" },
      creative: { primary: "#ec4899", secondary: "#db2777" },
      professional: { primary: "#0d9488", secondary: "#0f766e" },
    };
    return previewColors[template.style] || previewColors.modern;
  };

  if (!isOpen) return null;

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedExperience !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl max-w-7xl w-full h-[95vh] flex flex-col border border-gray-700 shadow-2xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-600 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Choose Your Template
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Professional designs optimized for ATS systems
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-green-600 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-semibold text-xs">
                    {
                      Object.values(resumeTemplates).filter(
                        (t) => t.atsFriendly
                      ).length
                    }{" "}
                    ATS Friendly
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-blue-600 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-400 font-semibold text-xs">
                    {Object.keys(templateCategories).length} Industries
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-purple-600 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-400 font-semibold text-xs">
                    Global Compatible
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-gray-700"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar - Fixed */}
        <div className="flex-shrink-0 p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex gap-3 items-center mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, role, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-semibold text-sm ${
                showFilters
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gray-800 text-red-400 border border-red-600 rounded-xl hover:bg-red-900 hover:bg-opacity-20 transition-all font-semibold text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="space-y-3">
              {/* Industry Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Industry
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap text-sm font-semibold ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <span>🌐</span>
                    All Industries
                  </button>
                  {Object.entries(templateCategories).map(([key, category]) => {
                    const count = Object.values(resumeTemplates).filter(
                      (t) => t.category === key
                    ).length;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap text-sm font-semibold ${
                          selectedCategory === key
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            selectedCategory === key
                              ? "bg-white bg-opacity-20"
                              : "bg-gray-700"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Experience Level
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll">
                  <button
                    onClick={() => setSelectedExperience("all")}
                    className={`px-4 py-2 rounded-lg border transition-all whitespace-nowrap text-sm font-semibold ${
                      selectedExperience === "all"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    All Levels
                  </button>
                  {Object.entries(experienceLevels).map(([key, level]) => {
                    const count = Object.values(resumeTemplates).filter(
                      (t) => t.experienceLevel === key
                    ).length;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedExperience(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap text-sm font-semibold ${
                          selectedExperience === key
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        {level.name}
                        {count > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              selectedExperience === key
                                ? "bg-white bg-opacity-20"
                                : "bg-gray-700"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Templates Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900 custom-scroll">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {filteredTemplates.length} Templates Found
              </h3>
              {selectedCategory !== "all" && (
                <p className="text-gray-400 text-sm mt-1">
                  in {templateCategories[selectedCategory]?.name}
                </p>
              )}
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No templates found
              </h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
              >
                Show All Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = currentTemplate === template.id;
                const colors = generateTemplatePreview(template);

                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`group cursor-pointer transition-all duration-200 hover:scale-105 rounded-xl ${
                      isSelected
                        ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/50"
                        : "hover:ring-2 hover:ring-gray-600"
                    }`}
                  >
                    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col hover:border-gray-600 transition-all">
                      {/* <div
                        className="aspect-[1/1.414] relative p-4"
                        style={{ backgroundColor: colors.primary }}
                      >

                      
                        <div className="absolute top-4 left-4 right-4">
                          <div className="h-3 bg-white rounded-full mb-3"></div>
                          <div className="h-2 bg-white bg-opacity-70 rounded-full mb-2 w-3/4"></div>
                          <div className="h-2 bg-white bg-opacity-70 rounded-full mb-2 w-1/2"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="h-8 bg-white bg-opacity-20 rounded-lg mb-2"></div>
                          <div className="flex gap-1">
                            <div className="h-2 bg-white bg-opacity-30 rounded-full flex-1"></div>
                            <div className="h-2 bg-white bg-opacity-30 rounded-full flex-1"></div>
                            <div className="h-2 bg-white bg-opacity-30 rounded-full flex-1"></div>
                          </div>
                        </div>

                    
                        <div className="absolute top-2 right-2 flex gap-1">
                          {template.atsFriendly && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              ATS ✓
                            </span>
                          )}
                          {isSelected && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                              <FiCheck className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                       
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all">
                            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm">
                              {isSelected ? "Selected ✓" : "Select Template"}
                            </div>
                          </div>
                        </div>
                      </div> */}
                      {/* ✅ Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
                            <FaCrown className="w-3 h-3" />
                            PREMIUM
                          </span>
                        </div>
                      )}
                      <img
                        src={template.img}
                        className="w-full h-full"
                        alt={template.name}
                      />

                      {/* Template Info */}
                      <div className="p-4 bg-gray-800 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white text-sm">
                            {template.name}
                          </h3>
                          {isSelected && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500 capitalize bg-gray-700 px-2 py-1 rounded">
                            {template.style}
                          </span>
                          <span className="text-xs text-yellow-400 flex items-center gap-1 font-semibold">
                            ⭐ {template.rating}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.recommendedFor?.slice(0, 2).map((role) => (
                            <span
                              key={role}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                            >
                              {role}
                            </span>
                          ))}
                          {template.recommendedFor?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{template.recommendedFor.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              <div className="font-semibold text-white mb-1">
                Selected:{" "}
                <span className="text-blue-400">
                  {resumeTemplates[currentTemplate]?.name || "None"}
                </span>
              </div>
              <div className="text-xs">
                Showing {filteredTemplates.length} of{" "}
                {Object.keys(resumeTemplates).length} templates
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all border border-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                Apply Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
