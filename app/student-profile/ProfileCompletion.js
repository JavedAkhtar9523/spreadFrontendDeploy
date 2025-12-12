import React from 'react'
import Link from 'next/link';
import { Bookmark, Briefcase, GraduationCap, Award, BookOpen } from "lucide-react";

const quickLinks = [
  { id: 1, label: "Saved Jobs", icon: Bookmark, href: "/saved-jobs" },
  { id: 2, label: "Applied Jobs", icon: Briefcase, href: "/applied-jobs" },
  { id: 3, label: "Learning Path", icon: BookOpen, href: "/learning" },
];

export default function ProfileCompletion() {
  return (
          <div>
         <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-sm border border-gray-300 my-2">
            <h3 className="font-semibold">Profile Completion</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">75% Complete</p>
          </div>
          </div>
          <div className="bg-white p-4 rounded-sm border border-gray-300 my-2">
        <h3 className="font-semibold mb-2">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          {quickLinks.map(({ id, label, icon: Icon, href }) => (
            <li key={id}>
              <Link
                href={href}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
