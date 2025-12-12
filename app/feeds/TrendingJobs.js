"use client";
import { Bookmark, Heart, MoreHorizontal } from "lucide-react";
import { PiShareFatThin } from "react-icons/pi";  

export default function TrendingJobs() {
  const jobs = [
    {
      id: 1,
      title: "Software Solution",
      company: "AmbiSpine Technologies",
      logo: "/company1.png",
    },
    {
      id: 2,
      title: "Software Solution",
      company: "AmbiSpine Technologies",
      logo: "/company2.png",
    },
  ];

  return (
    <section className="w-full px-4  relative">
      <h2 className="text-lg font-medium text-gray-800 mb-3 px-4">
        Trending Jobs For You
      </h2>

      <div className="rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className=" border-[0.3px] border-[#cccccc] rounded-4xl  p-4 relative flex flex-col gap-4"
          >
            <button className="absolute right-3 top-3 text-gray-500 cursor-pointer">
              <MoreHorizontal size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                <img src={job.logo} className="w-10 h-10 object-cover" />
              </div>

              <div>
                <p className="font-semibold text-gray-800">{job.title}</p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 text-gray-600">
              <Bookmark size={18} />
              <PiShareFatThin size={18} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
