"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LeftSliderForSinUp from "../signup/LeftSliderForSinUp";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import TakeASpinSlider from "../signup/LeftSliderForSinUp";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { InputField } from "../components/InputField"

const GradientTypingText = () => {
  const text = "your next move, your next legacy...";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      } else {
        // Reset karke fir se start
        setTimeout(() => {
          setDisplayedText("");
          setIndex(0);
        }, 300); // 2 second wait after completion
      }
    }, 100);

    return () => clearInterval(interval);
  }, [index, text]);

  return (
    <motion.p
      className="text-lg text-left font-jost tracking-wide mt-3"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        background: "linear-gradient(to right, #8B016F, #020BA7FC, #8B016F)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {displayedText}
      {index < text.length && <span className="animate-pulse">|</span>}
    </motion.p>
  );
};
// Custom Input Field Component


export default function SpreadsSignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);
  const [authError, setAuthError] = useState(null);

  const illustrations = [
    {
      id: 1,
      title: "Professional Networking",
      description:
        "Connect with industry professionals and discover new opportunities.",
      img: "/SignInLeftImg1.jpg",
    },
    {
      id: 2,
      title: "Career Growth",
      description: "Climb the career ladder with personalized growth paths.",
      img: "/SignInLeftImg2.jpg",
    },
    {
      id: 3,
      title: "Remote Work",
      description: "Work from anywhere with global opportunities.",
      img: "/SignUpLeftImg1.jpg",
    },
    {
      id: 4,
      title: "Team Collaboration",
      description: "Build strong connections and collaborate effectively.",
      img: "/SignUpLeftImg2.jpg",
    },
    {
      id: 5,
      title: "Success Stories",
      description:
        "Join thousands of professionals achieving their career goals.",
      img: "/SignUpLeftImg3.jpg",
    },
  ];

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field if it's been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Login successful!", {
          position: "top-right",
        });

        // Save token and user data
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user || data.data) {
          localStorage.setItem("user", JSON.stringify(data.user || data.data));
        }

        // Redirect to onboarding page - "Tell Us about yourself" step
        router.push("/onboarding");
      } else {
        const errorMsg = data.message || "Invalid credentials";
        setAuthError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Something went wrong. Please try again.");
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    if (authError) {
      toast.error(authError, { position: "top-right" });
      setIsLoading(false);
    }
  }, [authError]);



  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white px-[10%]">
      {/* Left Side */}
      <div className="w-full lg:h-full flex flex-col sm:h-screen justify-center items-center px-6 py-20 text-center lg:text-left">
        <h2 className="text-[#040404] text-3xl sm:text-4xl font-semibold font-jost">
          Welcome Back, Builder.
        </h2>
        <p className="text-[#116AD1] mt-3 mb-6 text-base justify-items-center items-center text-center sm:text-lg font-medium font-jost">
          Your world of ideas, identity, and impact begins here.{" "}
          <br className="hidden lg:block align-middle" /> One login — infinite
          possibilities.
        </p>

        <div className="w-full max-w-[500px] h-[250px] sm:h-auto object-cover mx-auto">
          <TakeASpinSlider data={illustrations} />
        </div>

        <div className="mt-6">
          <GradientTypingText />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-full flex justify-center items-center sm:px-10 m-auto">
        <div className="w-full max-w-md rounded-2xl p-6 sm:p-8">
          <h2 className="text-3xl sm:text-3xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#000ACE] to-[#c2009b] mb-2">
            Spreadnext
          </h2>

          <p className="text-[#414141] font-medium mb-4 text-sm sm:text-base justify-items-center items-center text-center">
            Login into your Spreadnext account
          </p>

          <div className="flex flex-col gap-4">
            {/* Email Input */}
            <InputField
              name="email"
              type="text"
              label="Id, Phone number, Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              customBorder={true}   // gradient border true 
              gradientFrom="#000ACE"
              gradientTo="#C2009B"
            />
           
            {/* Password Input */}
            <div className="relative">

              <InputField
              name="password"
              type={showPassword ? "text" : "password"}
               label="Password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
              customBorder={true}   // gradient border true 
              gradientFrom="#000ACE"
              gradientTo="#C2009B"
              error={errors.password}
              touched={touched.password}
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaRegEye size={18} />
                ) : (
                  <FaRegEyeSlash size={18} />
                )}
              </button>
            
            </div>

            <div className="flex flex-col sm:flex-row justify-between text-sm mt-1 gap-2 sm:gap-0">
              <label className="flex items-center gap-1 text-gray-700 justify-center sm:justify-start">
                <input type="checkbox" className="accent-[#116AD1]" />{" "}
                <span className="font-light">Keep Remind Me</span>
              </label>
              <button className="text-[#116AD1] hover:underline text-center sm:text-right">
                Forget Password
              </button>
            </div>

            <div className="text-center flex-col gap-y-0">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-[#0031F5] text-white py-2 px-8 rounded-full border-2 font-medium hover:bg-[#0E5CB8] transition duration-300 mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            <Link
              href="/signup"
              className="text-center w-full text-[#116AD1] border-2 border-[#116AD1] font-medium focus:ring-2 rounded-full py-2 mt-1 hover:text-blue-900 hover:bg-blue-50 transition text-sm"
            >
              New in Spreadnext ? Signup
            </Link>

            <div className="flex items-center my-1">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-700 text-sm px-2">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="flex items-center justify-center gap-6">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <FcGoogle className="w-6 h-6 cursor-pointer" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <FaApple className="w-6 h-6 text-black cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
