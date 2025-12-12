"use client";
import { FiDownload, FiChevronDown, FiSearch } from "react-icons/fi";
import { FaMagic, FaShareAlt, FaHistory, FaPalette, FaFont, FaEye } from "react-icons/fa";
import Dropdown from "../../components/Dropdown";
import { useState } from "react";

export default function TopActionBar({
  canProceed,
  downloadResume,
  handleNext,
  setShowTemplateModal,
  onShare,
  onHistory,
  currentFont,
  currentColor,
  currentTheme,
  currentTemplate,
  onFontChange,
  onColorChange,
  onThemeChange,
  onTemplateChange
}) {

  const [fontFocus, setFontFocus] = useState(false);
  // Professional font options with CSS classes
  const fontOptions = [
    {
      id: 'inter',
      name: 'Inter',
      class: 'font-inter',
      css: `font-family: 'Inter', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'roboto',
      name: 'Roboto',
      class: 'font-roboto',
      css: `font-family: 'Roboto', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'opensans',
      name: 'Open Sans',
      class: 'font-open-sans',
      css: `font-family: 'Open Sans', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'lato',
      name: 'Lato',
      class: 'font-lato',
      css: `font-family: 'Lato', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'montserrat',
      name: 'Montserrat',
      class: 'font-montserrat',
      css: `font-family: 'Montserrat', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'poppins',
      name: 'Poppins',
      class: 'font-poppins',
      css: `font-family: 'Poppins', sans-serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'playfair',
      name: 'Playfair Display',
      class: 'font-playfair',
      css: `font-family: 'Playfair Display', serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'lora',
      name: 'Lora',
      class: 'font-lora',
      css: `font-family: 'Lora', serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'georgia',
      name: 'Georgia',
      class: 'font-georgia',
      css: `font-family: 'Georgia', serif;`,
      preview: 'The quick brown fox'
    },
    {
      id: 'times',
      name: 'Times New Roman',
      class: 'font-times',
      css: `font-family: 'Times New Roman', serif;`,
      preview: 'The quick brown fox'
    }
  ];

  // Professional color schemes with transparency support
  const colorSchemes = [
    { id: 'professional-blue', name: 'Professional Blue', primary: '#2563eb', text: '#1e40af' },
    { id: 'corporate-gray', name: 'Corporate Gray', primary: '#4b5563', text: '#374151' },
    { id: 'executive-navy', name: 'Executive Navy', primary: '#1e3a8a', text: '#1e40af' },
    { id: 'modern-teal', name: 'Modern Teal', primary: '#0d9488', text: '#0f766e' },
    { id: 'creative-purple', name: 'Creative Purple', primary: '#7c3aed', text: '#6d28d9' },
    { id: 'bold-red', name: 'Bold Red', primary: '#dc2626', text: '#b91c1c' },
    { id: 'classic-green', name: 'Classic Green', primary: '#059669', text: '#047857' },
    { id: 'warm-amber', name: 'Warm Amber', primary: '#d97706', text: '#b45309' },
    { id: 'transparent-blue', name: 'Transparent Blue', primary: '#2563eb80', text: '#1e40af' },
    { id: 'transparent-purple', name: 'Transparent Purple', primary: '#7c3aed80', text: '#6d28d9' },
    { id: 'transparent-gray', name: 'Transparent Gray', primary: '#4b556380', text: '#374151' }
  ];

  // Quick themes (template + color + font combinations)
  const themeOptions = [
    {
      id: 'modern-pro',
      name: 'Modern Pro',
      description: 'Clean professional design',
      template: 'modern1',
      colors: { primary: '#2563eb', text: '#1e40af' },
      font: 'inter'
    },
    {
      id: 'executive-classic',
      name: 'Executive Classic',
      description: 'Traditional executive style',
      template: 'executive1',
      colors: { primary: '#1e3a8a', text: '#1e40af' },
      font: 'georgia'
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Modern creative design',
      template: 'creative1',
      colors: { primary: '#7c3aed', text: '#6d28d9' },
      font: 'poppins'
    },
    {
      id: 'tech-minimal',
      name: 'Tech Minimal',
      description: 'Clean tech industry style',
      template: 'minimal1',
      colors: { primary: '#0d9488', text: '#0f766e' },
      font: 'montserrat'
    },
    {
      id: 'corporate-pro',
      name: 'Corporate Pro',
      description: 'Professional corporate design',
      template: 'corporate1',
      colors: { primary: '#4b5563', text: '#374151' },
      font: 'roboto'
    }
  ];

  const [fontSearch, setFontSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  const handleThemeSelect = (theme) => {
    onThemeChange(theme.id);
    onColorChange(theme.colors.primary);
    onFontChange(theme.font);
    onTemplateChange(theme.template);
  };

  const getCurrentFont = () => {
    return fontOptions.find(font => font.id === currentFont) || fontOptions[0];
  };

  const getCurrentColor = () => {
    return colorSchemes.find(color => color.primary === currentColor) || colorSchemes[0];
  };

  // Filter fonts based on search
  const filteredFonts = fontOptions.filter(font =>
    font.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
    font.id.toLowerCase().includes(fontSearch.toLowerCase())
  );

  // Filter colors based on search
  const filteredColors = colorSchemes.filter(color =>
    color.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
    color.primary.toLowerCase().includes(colorSearch.toLowerCase())
  );

  // Function to check if color has transparency
  const hasTransparency = (color) => {
    return color.length === 9 || (color.length === 7 && color.includes('80'));
  };

  return (
    <div className="flex justify-center items-center mb-8 p-0.5 border border-gray-600 bg-[#ffffff] rounded-md">
      <div className="flex items-center justify-center gap-3 flex-wrap">

        {/* Template Selector */}
        <button
          onClick={() => setShowTemplateModal(true)}
          className="px-4 py-2.5 rounded-xl  flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group"
        >
          <FaMagic className="w-4 h-4  " />
          Templates
          {/* <span className="text-xs bg-purple-600 px-1.5 py-0.5 rounded-full">12+</span> */}
        </button>

        {/* Font Selector Dropdown with Search */}
        <Dropdown
          button={
            <button className="px-4 py-2 rounded-xl  flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group min-w-32 justify-between">
              <div className="flex items-center gap-2">
                <FaFont className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                <span className={getCurrentFont().class}>
                  {getCurrentFont().name}
                </span>
              </div>
              <FiChevronDown className="w-3 h-3 transition-transform" />
            </button>
          }
          className="left-0 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50"
        >
          {({ close }) => (
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide flex justify-between items-center">
                <span>Font Family</span>
                {/* <span className="text-green-400">✓ {getCurrentFont().name}</span> */}
              </div>


              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-[#222020] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                {filteredFonts.map(font => (
                  <div
                    key={font.id}
                    onClick={() => {
                      onFontChange(font.id);
                      setFontSearch("");
                      close();
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-all  ${currentFont === font.id
                        ? ' text-[#222020]'
                        : 'hover:bg-gray-700 text-gray-200 border-transparent'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">
                        <span className={font.class}>{font.name}</span>
                        {/* {currentFont === font.id && (
                          <span className="ml-2 text-xs bg-green-500 px-1.5 py-0.5 rounded-full">Active</span>
                        )} */}
                      </div>
                    </div>
                    <div className={`text-xs mt-1 ${font.class} ${currentFont === font.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                      {font.preview}
                    </div>
                  </div>
                ))}

                {fontSearch && filteredFonts.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    No fonts found matching "{fontSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </Dropdown>

        {/* Font Selector with Direct Search and List */}
        {/* <div className=" ">

  <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide flex justify-between items-center">
    <span>Font Family</span>
    <span className="text-green-400">✓ {getCurrentFont().name}</span>
  </div>


  <div className="relative mb-3 w-full" >
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search fonts..."
        value={fontSearch}
        onChange={(e) => setFontSearch(e.target.value)}
        onFocus={() => setFontFocus(true)}
        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-[#222020] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {fontFocus && filteredFonts.length > 0 && (
        <div className="absolute mt-2 left-0 right-0 max-h-60 overflow-y-auto custom-scroll bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          {filteredFonts.map((font) => (
            <div
              key={font.id}
              onClick={() => {
                onFontChange(font.id);
                setFontSearch("");
                setFontFocus(false);
              }}
              className={`p-3 cursor-pointer transition-all border-b border-gray-700 last:border-none ${
                currentFont === font.id
                  ? "bg-blue-600 text-[#222020]"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">
                  <span className={font.class}>{font.name}</span>
                  {currentFont === font.id && (
                    <span className="ml-2 text-xs bg-green-500 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`text-xs mt-1 ${font.class} ${
                  currentFont === font.id ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {font.preview}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>


  <div className=" space-y-2 max-h-60 overflow-y-auto custom-scroll">
   


    {fontSearch && filteredFonts.length === 0 && (
      <div className="text-center py-4 text-gray-400 text-sm">
        No fonts found matching "{fontSearch}"
      </div>
    )}
  </div>
</div> */}


        {/* Color Selector Dropdown with Search and Transparency */}
        <Dropdown
          button={
            <button className="px-4 py-2.5 rounded-xl  flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group min-w-32 justify-between">
              <div className="flex items-center gap-2">
                <FaPalette className="w-4 h-4 text-[#faf9fa]" />
                <span>Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-gray-600 shadow-lg"
                  style={{ backgroundColor: currentColor }}
                ></div>
                {/* <FiChevronDown className="w-3 h-3 transition-transform" /> */}
              </div>
            </button>
          }
          className="left-0 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50"
        >
          {({ close }) => (
            <div className="p-4">




              {/* Preset Colors */}
              <div className="">
                <label className="block text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                  Preset Colors
                </label>
                <div className="flex flex-wrap justify-start gap-2 ">
                  {filteredColors.map(color => (
                    <div
                      key={color.id}
                      onClick={() => {
                        onColorChange(color.primary);
                        setColorSearch("");
                        close();
                      }}
                      className={`group cursor-pointer text-center p-2 rounded-lg transition-all ${currentColor === color.primary ? 'bg-gray-700 ring-2 ring-blue-500' : 'hover:bg-gray-700'
                        }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border-2 mx-auto shadow-lg transition-all mb-1 relative"
                        style={{
                          backgroundColor: color.primary,
                          borderColor: currentColor === color.primary ? '#3b82f6' : '#4b5563'
                        }}
                      >

                      </div>
                      <div className={`text-xs transition-all ${currentColor === color.primary ? 'text-[#222020] font-semibold' : 'text-gray-300'
                        }`}>

                      </div>

                    </div>
                  ))}
                  <div className="mt-2">
                    <input
                      type="color"
                      value={currentColor.length === 9 ? currentColor.substring(0, 7) : currentColor}
                      onChange={(e) => onColorChange(e.target.value)}
                      className="w-8 h-8  bg-gray-600 border border-gray-500 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>


              </div>
            </div>
          )}
        </Dropdown>

        {/* Theme Selector Dropdown
        <Dropdown
          button={
            <button className="px-4 py-2.5 rounded-xl  flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group">
              <FaEye className="w-4 h-4 text-[#222020]" />
              Quick Themes
              <FiChevronDown className="w-3 h-3 transition-transform" />
            </button>
          }
          className="left-0 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50"
        >
          {({ close }) => (
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                Quick Apply Themes
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                {themeOptions.map(theme => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        handleThemeSelect(theme);
                        close();
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-all border group ${
                        isActive 
                          ? 'bg-blue-600 text-[#222020] border-blue-500' 
                          : 'hover:bg-gray-700 text-gray-200 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm">
                          {theme.name}
                          {isActive && (
                            <span className="ml-2 text-xs bg-green-500 px-1.5 py-0.5 rounded-full">Active</span>
                          )}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div 
                            className="w-4 h-4 rounded border border-gray-600"
                            style={{ backgroundColor: theme.colors.primary }}
                          ></div>
                          <span className={`text-xs font-mono bg-gray-700 px-1.5 py-0.5 rounded ${theme.font === 'inter' ? 'font-inter' : theme.font === 'roboto' ? 'font-roboto' : ''}`}>
                            {theme.font}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                        {theme.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-2 flex gap-2">
                        <span>Template: {theme.template}</span>
                        <span>•</span>
                        <span>Font: {theme.font}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Dropdown> */}

        {/* Download PDF */}
        <button
          onClick={downloadResume}
          className="px-4 py-2.5 rounded-xl  flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group"
        >
          <FiDownload className="w-4 h-4" />
          Download PDF
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="px-4 py-2.5 rounded-xl   flex items-center gap-2 text-sm font-medium text-[#222020] transition-all duration-200 hover:scale-105  group"
        >
          <FaShareAlt className="w-4 h-4" />
          Share
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-6 py-1.5 rounded-xl  flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-105   ${canProceed
              ? ' text-[#222020]'
              : ' text-gray-400 cursor-not-allowed'
            }`}
        >
          Next
          <span className="text-lg">→</span>
        </button>
      </div>

      <style jsx>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #808080 25%, transparent 25%),
            linear-gradient(-45deg, #808080 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #808080 75%),
            linear-gradient(-45deg, transparent 75%, #808080 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}