"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {

  Search,
} from "lucide-react";
import { InputField } from '../components/InputField'
// ==========================================
// EXTENDED DUMMY DATA
// ==========================================
const searchData = {
companies:  [
  {
    id: 1,
    name: "Google",
    type: "company",
    description: "Tech Giant",
    logo: "/google.png",
    location: "Mountain View",
    industry: "Technology",
    size: "Enterprise",
    funding: "Public",
  },
  {
    id: 2,
    name: "Microsoft",
    type: "company",
    description: "Software Company",
    logo: "/microsoft.png",
    location: "Redmond",
    industry: "Technology",
    size: "Enterprise",
    funding: "Public",
  },
  {
    id: 3,
    name: "Zomato",
    type: "company",
    description: "Food Delivery",
    logo: "/zomato.png",
    location: "Gurgaon",
    industry: "FoodTech",
    size: "Mid-size",
    funding: "Series E",
  },
  {
    id: 4,
    name: "Swiggy",
    type: "company",
    description: "Food Delivery",
    logo: "/swiggy.png",
    location: "Bangalore",
    industry: "FoodTech",
    size: "Mid-size",
    funding: "Series J",
  },
  {
    id: 5,
    name: "Paytm",
    type: "company",
    description: "FinTech Platform",
    logo: "/paytm.png",
    location: "Noida",
    industry: "FinTech",
    size: "Enterprise",
    funding: "Public",
  },
  {
    id: 6,
    name: "Infosys",
    type: "company",
    description: "IT Consulting",
    logo: "/infosys.png",
    location: "Bangalore",
    industry: "IT Services",
    size: "Enterprise",
    funding: "Public",
  },
  {
    id: 7,
    name: "TCS",
    type: "company",
    description: "Global IT Service Provider",
    logo: "/tcs.png",
    location: "Mumbai",
    industry: "IT Services",
    size: "Enterprise",
    funding: "Public",
  },
  {
    id: 8,
    name: "Freshworks",
    type: "company",
    description: "Customer Support SaaS",
    logo: "/freshworks.png",
    location: "Chennai",
    industry: "SaaS",
    size: "Mid-size",
    funding: "Public",
  },
  {
    id: 9,
    name: "Byju’s",
    type: "company",
    description: "EdTech Learning Platform",
    logo: "/byjus.png",
    location: "Bangalore",
    industry: "EdTech",
    size: "Enterprise",
    funding: "Series F",
  },
  {
    id: 10,
    name: "Ola",
    type: "company",
    description: "Ride-Hailing Platform",
    logo: "/ola.png",
    location: "Bangalore",
    industry: "Mobility",
    size: "Enterprise",
    funding: "Series J",
  },
  {
    id: 11,
    name: "Flipkart",
    type: "company",
    description: "E-commerce",
    logo: "/flipkart.png",
    location: "Bangalore",
    industry: "E-commerce",
    size: "Enterprise",
    funding: "Acquired",
  },
  {
    id: 12,
    name: "Nykaa",
    type: "company",
    description: "Beauty E-commerce",
    logo: "/nykaa.png",
    location: "Mumbai",
    industry: "E-commerce",
    size: "Mid-size",
    funding: "Public",
  },
  {
    id: 13,
    name: "Razorpay",
    type: "company",
    description: "Payment Gateway",
    logo: "/razorpay.png",
    location: "Bangalore",
    industry: "FinTech",
    size: "Mid-size",
    funding: "Series F",
  },
  {
    id: 14,
    name: "CRED",
    type: "company",
    description: "Credit Management App",
    logo: "/cred.png",
    location: "Bangalore",
    industry: "FinTech",
    size: "Mid-size",
    funding: "Series E",
  },
  {
    id: 15,
    name: "Meesho",
    type: "company",
    description: "Social Commerce",
    logo: "/meesho.png",
    location: "Bangalore",
    industry: "E-commerce",
    size: "Mid-size",
    funding: "Series F",
  }
],
  communities: [
  {
    id: 1,
    name: "React Developers India",
    type: "community",
    members: 5000,
    description: "React enthusiasts",
    tags: ["React", "JavaScript", "Frontend"],
    category: "Technology",
  },
  {
    id: 2,
    name: "Python Programmers",
    type: "community",
    members: 8000,
    description: "Python community",
    tags: ["Python", "Django", "Flask"],
    category: "Technology",
  },
  {
    id: 3,
    name: "AWS Cloud Engineers",
    type: "community",
    members: 2500,
    description: "Cloud specialists",
    tags: ["AWS", "Cloud", "DevOps"],
    category: "Cloud",
  },
  {
    id: 4,
    name: "Data Science Hub",
    type: "community",
    members: 6000,
    description: "Data scientists",
    tags: ["ML", "AI", "Python"],
    category: "Data Science",
  },
  {
    id: 5,
    name: "Startup Founders",
    type: "community",
    members: 3500,
    description: "Entrepreneur network",
    tags: ["Startup", "Business", "Innovation"],
    category: "Business",
  },
  {
    id: 6,
    name: "Next.js Developers",
    type: "community",
    members: 4200,
    description: "Next.js experts",
    tags: ["Next.js", "React", "SSR"],
    category: "Technology",
  },
  {
    id: 7,
    name: "Cybersecurity Club",
    type: "community",
    members: 3900,
    description: "Security researchers",
    tags: ["Cybersecurity", "Ethical Hacking"],
    category: "Security",
  },
  {
    id: 8,
    name: "UI/UX Designers India",
    type: "community",
    members: 4800,
    description: "Design community",
    tags: ["UI", "UX", "Figma"],
    category: "Design",
  },
  {
    id: 9,
    name: "Blockchain Innovators",
    type: "community",
    members: 5200,
    description: "Web3 & blockchain experts",
    tags: ["Web3", "Solidity", "Crypto"],
    category: "Blockchain",
  },
  {
    id: 10,
    name: "DevOps Engineers",
    type: "community",
    members: 3100,
    description: "CI/CD and Cloud Engineers",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    category: "Cloud",
  }
],



  colleges: [
  {
    id: 1,
    name: "IIT Bombay",
    type: "college",
    location: "Mumbai",
    students: 10000,
    logo: "/iit.png",
    programs: ["B.Tech", "M.Tech", "PhD"],
    tier: "Tier 1",
  },
  {
    id: 2,
    name: "NIT Trichy",
    type: "college",
    location: "Trichy",
    students: 8000,
    logo: "/nit.png",
    programs: ["B.Tech", "M.Tech"],
    tier: "Tier 1",
  },
  {
    id: 3,
    name: "BITS Pilani",
    type: "college",
    location: "Pilani",
    students: 4000,
    logo: "/bits.png",
    programs: ["B.E.", "M.E."],
    tier: "Tier 1",
  },
  {
    id: 4,
    name: "VIT Vellore",
    type: "college",
    location: "Vellore",
    students: 30000,
    logo: "/vit.png",
    programs: ["B.Tech", "M.Tech", "MBA"],
    tier: "Tier 2",
  },
  {
    id: 5,
    name: "IIT Delhi",
    type: "college",
    location: "Delhi",
    students: 12000,
    logo: "/iitd.png",
    programs: ["B.Tech", "PhD"],
    tier: "Tier 1",
  },
  {
    id: 6,
    name: "IIT Madras",
    type: "college",
    location: "Chennai",
    students: 9000,
    logo: "/iitm.png",
    programs: ["B.Tech", "M.Tech", "MS"],
    tier: "Tier 1",
  },
  {
    id: 7,
    name: "SRM University",
    type: "college",
    location: "Chennai",
    students: 45000,
    logo: "/srm.png",
    programs: ["Engineering", "MBA", "Science"],
    tier: "Tier 2",
  },
  {
    id: 8,
    name: "Amity University",
    type: "college",
    location: "Noida",
    students: 60000,
    logo: "/amity.png",
    programs: ["Engineering", "Law", "Management"],
    tier: "Tier 3",
  },
  {
    id: 9,
    name: "Delhi University",
    type: "college",
    location: "New Delhi",
    students: 50000,
    logo: "/du.png",
    programs: ["Arts", "Science", "Commerce"],
    tier: "Tier 2",
  },
  {
    id: 10,
    name: "Jadavpur University",
    type: "college",
    location: "Kolkata",
    students: 15000,
    logo: "/ju.png",
    programs: ["Engineering", "Arts"],
    tier: "Tier 1",
  }
],

 

  // users: [
  //   {
  //     id: 1,
  //     name: "Rahul Sharma",
  //     type: "user",
  //     role: "Senior Developer",
  //     company: "Google",
  //     avatar: "/user1.png",
  //     skills: ["React", "Node.js"],
  //     location: "Bangalore",
  //     experience: "5 years",
  //     college: "IIT Bombay",
  //   },
  //   {
  //     id: 2,
  //     name: "Priya Singh",
  //     type: "user",
  //     role: "Frontend Developer",
  //     company: "Microsoft",
  //     avatar: "/user2.png",
  //     skills: ["React", "JavaScript"],
  //     location: "Hyderabad",
  //     experience: "3 years",
  //     college: "NIT Trichy",
  //   },
  //   {
  //     id: 3,
  //     name: "Amit Kumar",
  //     type: "user",
  //     role: "Data Scientist",
  //     company: "Swiggy",
  //     avatar: "/user3.png",
  //     skills: ["Python", "ML"],
  //     location: "Bangalore",
  //     experience: "4 years",
  //     college: "BITS Pilani",
  //   },
  // ],

 users:  [
  {
    id: 1,
    name: "Rahul Sharma",
    type: "user",
    role: "Senior Developer",
    company: "Google",
    avatar: "/user1.png",
    skills: ["React", "Node.js"],
    location: "Bangalore",
    experience: "5 years",
    college: "IIT Bombay",
  },
  {
    id: 2,
    name: "Priya Singh",
    type: "user",
    role: "Frontend Developer",
    company: "Microsoft",
    avatar: "/user2.png",
    skills: ["React", "JavaScript"],
    location: "Hyderabad",
    experience: "3 years",
    college: "NIT Trichy",
  },
  {
    id: 3,
    name: "Amit Kumar",
    type: "user",
    role: "Data Scientist",
    company: "Swiggy",
    avatar: "/user3.png",
    skills: ["Python", "ML"],
    location: "Bangalore",
    experience: "4 years",
    college: "BITS Pilani",
  },
  {
    id: 4,
    name: "Sneha Verma",
    type: "user",
    role: "Product Manager",
    company: "Zomato",
    avatar: "/user4.png",
    skills: ["Product", "Agile", "Scrum"],
    location: "Gurgaon",
    experience: "6 years",
    college: "IIT Delhi",
  },
  {
    id: 5,
    name: "Karan Patel",
    type: "user",
    role: "Backend Engineer",
    company: "Paytm",
    avatar: "/user5.png",
    skills: ["Node.js", "MongoDB"],
    location: "Noida",
    experience: "3 years",
    college: "VIT Vellore",
  },
  {
    id: 6,
    name: "Neha Gupta",
    type: "user",
    role: "UI/UX Designer",
    company: "Freshworks",
    avatar: "/user6.png",
    skills: ["Figma", "Design"],
    location: "Chennai",
    experience: "4 years",
    college: "SRM University",
  },
  {
    id: 7,
    name: "Ravi Iyer",
    type: "user",
    role: "AI Engineer",
    company: "TCS",
    avatar: "/user7.png",
    skills: ["AI", "TensorFlow"],
    location: "Pune",
    experience: "5 years",
    college: "IIT Madras",
  },
  {
    id: 8,
    name: "Aditi Mishra",
    type: "user",
    role: "Cloud Engineer",
    company: "AWS",
    avatar: "/user8.png",
    skills: ["AWS", "DevOps"],
    location: "Bangalore",
    experience: "4 years",
    college: "NIT Trichy",
  },
  {
    id: 9,
    name: "Sahil Khan",
    type: "user",
    role: "Security Analyst",
    company: "Infosys",
    avatar: "/user9.png",
    skills: ["Cybersecurity", "Linux"],
    location: "Hyderabad",
    experience: "2 years",
    college: "Delhi University",
  },
  {
    id: 10,
    name: "Pooja Nair",
    type: "user",
    role: "Marketing Manager",
    company: "Nykaa",
    avatar: "/user10.png",
    skills: ["Marketing", "SEO"],
    location: "Mumbai",
    experience: "6 years",
    college: "Amity University",
  },
  {
    id: 11,
    name: "Arjun Reddy",
    type: "user",
    role: "DevOps Engineer",
    company: "Flipkart",
    avatar: "/user11.png",
    skills: ["Docker", "Kubernetes"],
    location: "Bangalore",
    experience: "4 years",
    college: "IIT Bombay",
  },
  {
    id: 12,
    name: "Mohit Jain",
    type: "user",
    role: "Software Engineer",
    company: "CRED",
    avatar: "/user12.png",
    skills: ["React", "TypeScript"],
    location: "Bangalore",
    experience: "3 years",
    college: "BITS Pilani",
  },
  {
    id: 13,
    name: "Sara Paul",
    type: "user",
    role: "AI Researcher",
    company: "Google",
    avatar: "/user13.png",
    skills: ["ML", "Deep Learning"],
    location: "Hyderabad",
    experience: "2 years",
    college: "IIT Delhi",
  },
  {
    id: 14,
    name: "Yash Mehta",
    type: "user",
    role: "Full Stack Developer",
    company: "Meesho",
    avatar: "/user14.png",
    skills: ["React", "Node"],
    location: "Indore",
    experience: "3 years",
    college: "Jadavpur University",
  },
  {
    id: 15,
    name: "Tanya Kapoor",
    type: "user",
    role: "HR Manager",
    company: "Paytm",
    avatar: "/user15.png",
    skills: ["HR", "Talent Acquisition"],
    location: "Noida",
    experience: "5 years",
    college: "VIT Vellore",
  }
]


};

// ==========================================
// ADVANCED SEARCH FUNCTION
// ==========================================
const performAdvancedSearch = (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results = [];

  // Helper function to calculate match score
  const calculateScore = (fields) => {
    let score = 0;
    fields.forEach((field) => {
      if (!field) return;
      const fieldLower = field.toString().toLowerCase();
      if (fieldLower === searchTerm) score += 100;
      else if (fieldLower.startsWith(searchTerm)) score += 50;
      else if (fieldLower.includes(searchTerm)) score += 25;
    });
    return score;
  };

  // Search Companies
  searchData.companies.forEach((item) => {
    const score = calculateScore([
      item.name,
      item.description,
      item.location,
      item.industry,
      item.size,
    ]);
    if (score > 0) {
      results.push({
        ...item,
        category: "Companies",
        matchScore: score,
        subtitle: `${item.industry} • ${item.size} • ${item.location}`,
      });
    }
  });

  // Search Jobs
  // searchData.jobs.forEach((item) => {
  //   const score = calculateScore([
  //     item.title,
  //     item.company,
  //     item.location,
  //     item.jobType,
  //     item.workMode,
  //     item.department,
  //     ...item.skills,
  //   ]);
  //   if (score > 0) {
  //     results.push({
  //       ...item,
  //       category: "Jobs",
  //       matchScore: score,
  //       subtitle: `${item.company} • ${item.location} • ${item.workMode}`,
  //       logo: item.companyLogo,
  //     });
  //   }
  // });

  // Search Internships
  // searchData.internships.forEach((item) => {
  //   const score = calculateScore([
  //     item.title,
  //     item.company,
  //     item.location,
  //     ...item.skills,
  //     item.eligibility,
  //   ]);
  //   if (score > 0) {
  //     results.push({
  //       ...item,
  //       category: "Internships",
  //       matchScore: score,
  //       subtitle: `${item.company} • ${item.stipend} • ${item.duration}`,
  //       logo: item.companyLogo,
  //     });
  //   }
  // });



  // Search Communities
  searchData.communities.forEach((item) => {
    const score = calculateScore([
      item.name,
      item.description,
      item.category,
      ...item.tags,
    ]);
    if (score > 0) {
      results.push({
        ...item,
        category: "Communities",
        matchScore: score,
        subtitle: `${item.members.toLocaleString()} members • ${item.tags.join(
          ", "
        )}`,
      });
    }
  });

  // Search Colleges
  searchData.colleges.forEach((item) => {
    const score = calculateScore([
      item.name,
      item.location,
      item.tier,
      ...item.programs,
    ]);
    if (score > 0) {
      results.push({
        ...item,
        category: "Colleges",
        matchScore: score,
        subtitle: `${item.location} • ${item.tier} • ${item.programs.join(
          ", "
        )}`,
      });
    }
  });


  // Search Users
  searchData.users.forEach((item) => {
    const score = calculateScore([
      item.name,
      item.role,
      item.company,
      item.location,
      item.college,
      ...item.skills,
    ]);
    if (score > 0) {
      results.push({
        ...item,
        category: "People",
        matchScore: score,
        subtitle: `${item.role} at ${item.company} • ${item.experience}`,
      });
    }
  });



  return results.sort((a, b) => b.matchScore - a.matchScore);
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const searchResults = performAdvancedSearch(searchQuery);
      setResults(searchResults);
      setIsLoading(false);
    }, 200);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length >= 2) {
      setIsLoading(true);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
  };

  // const getCategoryIcon = (category) => {
  //   const iconMap = {
  //     Companies: <Building2 size={18} className="text-blue-600" />,
  //     Jobs: <Briefcase size={18} className="text-purple-600" />,
  //     Internships: <GraduationCap size={18} className="text-green-600" />,
  //     Skills: <Code size={18} className="text-orange-600" />,
  //     Communities: <Users size={18} className="text-pink-600" />,
  //     Colleges: <GraduationCap size={18} className="text-indigo-600" />,
  //     Events: <Calendar size={18} className="text-red-600" />,
  //     People: <User size={18} className="text-teal-600" />,
  //     Recruiters: <Target size={18} className="text-yellow-600" />,
  //     Resources: <BookOpen size={18} className="text-cyan-600" />,
  //     Courses: <Laptop size={18} className="text-violet-600" />,
  //   };
  //   return iconMap[category] || <IoSearchOutline size={18} />;
  // };

  const getResultLink = (result) => {
    const linkMap = {
      company: `/companies/${result.id}`,
      job: `/jobs/${result.id}`,
      internship: `/internships/${result.id}`,
      skill: `/skills/${result.name}`,
      community: `/community/${result.id}`,
      college: `/colleges/${result.id}`,
      event: `/events/${result.id}`,
      user: `/profile/${result.id}`,
      recruiter: `/recruiters/${result.id}`,
      article: `/articles/${result.id}`,
      course: `/courses/${result.id}`,
    };
    return linkMap[result.type] || "#";
  };

  const groupedResults = results.reduce((acc, result) => {
    const category = result.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {});

  return (
    <div className="relative flex gap-5 items-center">
      <div
        // className="relative w-[180px] sm:w-[320px] lg:w-[450px]"
        className="flex  items-center  text-[#B6C9DF] relative gap-2 px-6  "
      >
        <input suppressHydrationWarning
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search "
  style={{
    outline: "none",
    boxShadow: "none",
    WebkitAppearance: "none",
  }}
  className={`
    rounded-full px-4 
    !bg-[#f0f0f0]
    w-[320px] h-[40px]
    placeholder:!text-gray-800 placeholder:font-medium
    transition-all duration-300 ease-in-out
    
    border border-transparent
    focus:border-gray-400
    focus:w-[500px]

    focus:outline-none
    focus:ring-0
  `}
  />
    <Search className="absolute right-14 w-4  h-4 text-[#727981]" />

 <div>
     {isFocused && query.trim().length >= 1 && (
          <div className="absolute top-[38px]  w-[500px] left-6 mt-2   bg-[#fff] border-[0.3px] border-[#cccccc] rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto z-50 custom-scroll">
            {results.length === 0 && !isLoading && (
              <div className="px-4 py-4 text-center text-gray-500">
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            )}

            {Object.keys(groupedResults).map((category) => (
              <div
                key={category}
              
              >
              

  {groupedResults[category].slice(0, 4).map((result, idx) => (
  <Link
    key={`${result.type}-${result.id}-${idx}`}
    href={getResultLink(result)}
    className="relative flex justify-between items-center gap-3 px-4 py-3 transition-colors   group"
    onClick={() => {
      setIsFocused(false);
      setQuery("");
      setResults([]);
    }}
  >
    <div className="flex gap-2">
      <img
        src={result.avatar || "/default-user-profile.svg"}
        alt={result.name}
        className="w-10 h-10 object-cover"
      />

      <div>
        <h6 className="truncate text-[12px] flex gap-0.5 font-medium text-gray-900">
          {result.name || result.title}
        </h6>
        <p className="text-[10px] text-gray-600 truncate">
          {result.subtitle}
        </p>
      </div>
    </div>

    {/* 🔥 Now visible */}
    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#727981]" />
  </Link>
))}

              </div>
            ))}

<div className="sticky bottom-0 border-t border-[#cccccc]  p-2 z-50">
  <Link
    href="/explore"
    onClick={() => setIsFocused(false)}
    className="block text-center w-full text-sm font-semibold py-2 rounded-md 
                text-blue-700 "
  >
    See more 
  </Link>
  </div>
          </div>
        )}
 </div>
        {isFocused && (
          <div
            onClick={() => setIsFocused(false)}
            // className="fixed inset-0 bg-[rgba(7,7,7,0.31)] z-40"
            className="fixed left-0 right-0 top-[64px] bottom-0 bg-[rgba(7,7,7,0.31)] z-40"

          ></div>
        )}
     
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
