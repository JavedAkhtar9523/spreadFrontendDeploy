"use client";
import { useState } from "react";
import { Avatar } from "../components/common/Avatar";

import { Buttonborder } from '../components/Button';

const suggestionsData = [
  {
    id: 1,
    name: "Coding Cup",
    description: "Most platform treat company ads mere banners or boosted posts. We believe in quality content.",
    image: "https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 2,
    name: "Gaming Club",
    description: "Most platform treat company ads mere banners or boosted posts. We believe in quality content.",
    image: "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 3,
    name: "Mai Senpai",
     description: "Most platform treat company ads mere banners or boosted posts. We believe in quality content.",
    image: "https://images.unsplash.com/photo-1688888745596-da40843a8d45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
  },
  {
    id: 4,
    name: "Azunyan U. Wu",
    description: "Most platform treat company ads mere banners or boosted posts. We believe in quality content.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fHww",
  },
  {
    id: 5,
    name: "Oarack Babama",
    description: "Most platform treat company ads mere banners or boosted posts. We believe in quality content.",
    image: "https://images.unsplash.com/photo-1762793193633-c26f3d34e710?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D",
  },
];

export default function JoinCommunity() {
  const [list, setList] = useState(suggestionsData);

//   const handleCollab = (id) => {
//     setList((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isCollabing: !item.isCollabing } : item
//       )
//     );
//   };

  return (
    <div 
    // className="w-full  items-center justify-between bg-[#ffffff] border-[0.3px] border-[#cccccc] rounded-4xl  py-2"
    className="w-full items-center my-2 justify-between bg-[#ffffff] py-2"

    >
      {/* Header */}
      <div className="flex items-center justify-between my-4 md:px-7 border-b pb-3 border-[#cccccc]">
        <h2 className="text-gray-800 font-semibold text-[18px]">Trending Community</h2>
        <button className="text-[#5063F4] text-[18px] font-medium hover:underline">
          See All
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-5 mx-2 md:px-7">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-1 "
          >
            <div className="flex gap-3  items-center">
        
               <img
                              src={item.image}
                              className="w-14 h-14 rounded-full object-cover"
                              // name={item.name}
                            />
              <div>

                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            
          <Buttonborder 
          name="join"
          // buttonclass="!text-[17px]"
           />
            {/* <JoinButton
              isCollabing={item.isCollabing} 
              onClick={() => handleCollab(item.id)}
            /> */}
          </div>
        ))}
      </div>
    </div>
  );
}