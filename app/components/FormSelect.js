import React from "react";
import FormField from "./FormField";

export default function SelectField({
  label,
  options = [],
  error,
  selectCless,
  ...props
}) {
  return (
    <FormField label={label}>
      <select
        className={`w-full px-3 border-2 border-blue-500 bg-[#fbfbfb] text-[#000] custom-scroll rounded-[30px] py-3
          ${error ? "border-red-500" : ""} 
          ${selectCless}`}
        style={{
          outline: "none",
          boxShadow: "none",
        }}
        {...props}
      >
        {options.map((opt, i) => (
          <option
            key={i}
            className="bg-white text-gray-800 py-3 px-4 hover:bg-blue-50 rounded-xl m-1"
            style={{
              padding: "12px 16px",
              margin: "4px",
              borderRadius: "8px",
            }}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </FormField>
  );
}
