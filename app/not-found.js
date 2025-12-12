// app/not-found.js
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiHome, FiArrowLeft, FiSearch, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Animated 404 */}
        <div className="relative mb-3">
        
          <div className="relative">
            <h1 className="text-4xl font-bold text-gray-600 mb-4">
              Page Not Found
            </h1>
            <p className="text-base text-gray-200 font-open-sans leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              Let's get you back on track.
            </p>

            {/* 👇 Added Image Section */}
            {/* <div className="flex justify-center">
              <Image
                src="/not-found-page.png" // put your image in /public/images/
                alt="404 Illustration"
                width={300}
                height={250}
                className="rounded-xl hover:scale-105 transition-transform duration-300"
              />
            </div> */}

        
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="flex justify-center gap-4 mb-8">
          <div
            onClick={() => router.push('/')}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-2  transition-all group cursor-pointer"
          >
          
            <h3 className="text-white font-semibold ">Go Home</h3>
            <p className="text-gray-400 text-sm">Return to the homepage</p>
          </div>

          <div 
            onClick={() => router.back()}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-2 hover:border-blue-500 transition-all group cursor-pointer"
          >
           
            <h3 className="text-white font-semibold ">Go Back</h3>
            <p className="text-gray-400 text-sm">Return to previous page</p>
          </div>
        </div> */}
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Image
            src="/not-found-page.png"
            alt="404 Illustration"
            width={300}
            height={250}
            priority
            className="rounded-xl hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:cursor-pointer"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all border border-gray-700 hover:cursor-pointer"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">
              contact our support team
            </Link>
            {' '}or{' '}
            <Link href="/help" className="text-purple-400 hover:text-purple-300 underline">
              visit our help center
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}