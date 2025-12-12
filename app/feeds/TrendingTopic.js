"use client";
import { MoreHorizontal } from "lucide-react";

export default function TrendingTopic() {
  const topics = [
    {
      id: 1,
      name: "Prabha Shrinivasan",
      role: "Content Writer | SEO",
      title: "Happiness Is the Key Achievement of Life.",
      desc: `happiness in every generation, through changing traditions, shifting technologies, and evolving dreams, one truth has quietly guided the human journey.`,
      img: "https://plus.unsplash.com/premium_photo-1762591318545-462f9c69051e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ5fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D", // replace with your image
    },
    {
      id: 2,
      name: "Prabha Shrinivasan",
      role: "Content Writer | SEO",
      title: "Happiness Is the Key Achievement of Life.",
      desc: `happiness in every generation, through changing traditions, shifting technologies, and evolving dreams, one truth has quietly guided the human journey.`,
      img: "https://plus.unsplash.com/premium_photo-1762591318545-462f9c69051e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ5fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D",
    },
  ];

  return (
    <section className="w-full  p-4 relative">
      <h2 className="text-lg font-medium text-gray-800 mb-3 px-4">
        Trending Topic
      </h2>

      <div className="rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((item) => (
          <div
            key={item.id}
            className=" border-[0.3px] border-[#cccccc] rounded-4xl  p-4 flex gap-4 relative"
          >
            <button className="absolute right-3 top-3 text-gray-500 cursor-pointer">
              <MoreHorizontal size={18} />
            </button>

            <img
              src={item.img}
              className="w-16 h-16 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <p className="font-md text-gray-800 font-semibold">{item.name}</p>
              <p className="text-xs text-gray-500 font-semibold">{item.role}</p>

              <p className="font-md text-gray-900 mt-2 font-semibold">{item.title}</p>

              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {item.desc} <span className="text-blue-600">…more</span>
              </p>
            </div>
          </div>
        ))}

        {/* Arrow Button */}
        <div className="absolute right-5 bottom-4 text-blue-700 cursor-pointer">
          →
        </div>
      </div>
    </section>
  );
}
