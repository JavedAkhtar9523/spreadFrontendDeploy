import React from "react";

export default function Button({
  children,
  type = "button",
  buttonclass = "",
  onClick,
  icon: Icon, // icon component (optional)
  showIcon = false, // only show icon when true
  ...props
}) {
  return (
    <button
      type={type}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-3xl hover:cursor-pointer transition text-[#2d53fb]  hover:text- ${buttonclass}`}
      onClick={onClick}
      {...props}
    >
      {showIcon && Icon && <Icon className="text-lg" />}
      {children}
    </button>
  );
}

export function Buttonborder({
  type = "button",
  name,
  onClick,
  classNameborder = "",
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={`text-[13px] flex justify-center items-center gap-1 px-4 py-1.5 rounded-full bg-[#0418f8fe] font-medium text-white hover:cursor-pointer  ${classNameborder}`}
    >
      {name} {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
}
