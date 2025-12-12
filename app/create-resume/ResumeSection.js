"use client";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ResumeSection = ({ title, isCollapsed, onToggle, children }) => {
  return (
    <div className="mb-4 border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        // className="w-full px-2 py-2 bg-[#050a10] hover:bg-[#03060b] transition-colors flex justify-between items-center"
        className="w-full px-2 py-2.5 bg-[#fff] border border-gray-400 transition-colors flex justify-between items-center"
      >
        <span className="font-semibold text-[#03060b] text-[14px] font-">{title}</span>
        {isCollapsed ? (
          <FiChevronDown className="text-gray-400" />
        ) : (
          <FiChevronUp className="text-gray-400" />
        )}
      </button>
      {!isCollapsed && (
        <div
        //  className="p-4 bg-[#10151B] bg-[#7fa9dde9]"
         className="p-4  bg-[#ffffff]"

        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ResumeSection;



// "use client";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// const ResumeSection = ({ title, isCollapsed, onToggle, children }) => {
//   return (
//     <div className="mb-6 border border-gray-700 rounded-lg overflow-hidden">
//       <button
//         onClick={onToggle}
//         className="w-full px-4 py-3 bg-[#050a10] hover:bg-[#03060b] transition-colors flex justify-between items-center"
//       >
//         <span className="font-semibold text-white">{title}</span>
//         {isCollapsed ? (
//           <FiChevronDown className="text-gray-400" />
//         ) : (
//           <FiChevronUp className="text-gray-400" />
//         )}
//       </button>
//       {!isCollapsed && (
//         <div className="p-4 bg-[#10151B]">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeSection;


