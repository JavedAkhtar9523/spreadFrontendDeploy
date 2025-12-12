"use client";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, toggleSaveItem } from "../store/userSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import LinkButton from "../button/Button";
import {
  CheckCircle,
  Star,
  Briefcase,
  MapPin,
  Share2,
  Bookmark,
  BookmarkCheck,
  Users,
  ThumbsUp,
  Gift,
  Clock,
} from "lucide-react";

export default function JobCard({ job }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [isSaved, setIsSaved] = useState(
    currentUser?.saved?.jobs?.includes(job.id) || false
  );

  const handleSave = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please log in to save jobs");
      return;
    }

    dispatch(toggleSaveItem({ type: "jobs", id: job.id }));
    setIsSaved(!isSaved);
    toast.success(!isSaved ? "Job saved successfully!" : "Removed from saved");
  };

  return (
    <div className="relative bg-white border border-gray-200 shadow-sm rounded-2xl mb-4 hover:shadow-md transition-all duration-300 p-5 font-[inter]">
      {/* Header Section */}
      <div className="flex justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex gap-3">
          <div className="w-16 h-16 flex items-center justify-center p-2 rounded-xl bg-gray-50">
            <img
              src={job.logo}
              alt={job.company}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {job.title}
              </h2>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{job.company}</span>
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{job.rating}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
          </div>
        </div>

        {/* Save + Share */}
        <div className="flex gap-3 items-start">
          {isSaved ? (
            <BookmarkCheck
              onClick={handleSave}
              className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-700"
            />
          ) : (
            <Bookmark
              onClick={handleSave}
              className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600"
            />
          )}
          <Share2 className="w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-600" />
        </div>
      </div>

      {/* Job Info */}
      <div className="my-3">
        <div className="flex items-center gap-6 text-sm mt-2">
          <span className="text-gray-700 font-medium">${job.salary}</span>
          <div className="flex items-center gap-2 text-gray-700">
            <Gift className="w-4 h-4" />
            <span>{job.experience}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-3xl border border-gray-300 bg-gray-50"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs px-2 py-1 border border-gray-300 rounded-3xl bg-gray-50">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-5 text-xs text-gray-500 mt-3">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-red-500" />
          <span>{job.posted}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{job.applicants}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{job.likes}</span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <LinkButton
          href={`/jobfeed/${job.id}`}
          name="View Details"
          showIcon={false}
          linkclassname="!bg-transparent !text-sm !text-gray-700 border border-blue-500 hover:!bg-blue-600 hover:!text-white"
        />
        <LinkButton
          href={`/apply/${job.id}`}
          name="Apply Now"
          showIcon={false}
          linkclassname="!py-1 !text-sm"
        />
      </div>
    </div>
  );
}
