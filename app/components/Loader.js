"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export const GlobalLoader = ({
  text = "Loading...",
  img = "/spreads.svg",
  type = "logo", // 'logo' or 'simple'
}) => {
  if (type === "simple") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070C11] text-white">
        <motion.div
          className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
          className="text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070C11]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Image
          src={img}
          alt={text}
          width={100}
          height={100}
          className="mb-6 mx-auto animate-pulse"
        />
        {text && <p className="text-blue-700 text-lg font-medium">{text}</p>}
        {/* <p className="text-gray-500 text-sm mt-2">Please wait...</p> */}
      </motion.div>
    </div>
  );
};
