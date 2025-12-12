"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Modal({
  show,
  onClose,
  title,
  children,
  widthClass = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (show) {
      document.body.style.overflow = "hidden";
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show, mounted, onClose]);

  if (!mounted || !show) return null;

  return createPortal(
    <>
      {/* Background overlay - outside click pe close hoga */}
      <div
        className="fixed inset-0 bg-[#0d0d0d89]  z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed inset-0 flex  justify-center items-start mt-20 z-50 ">
        <div
          className={`border-2 border-gray-400  max-h-[85vh] rounded-3xl bg-[rgb(255,255,255)] shadow-2xl  overflow-auto w-full m-2 lg:w-[750px] transition-all duration-200 ${widthClass} transition-all duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between  border-gray-400 px-6 pt-2">
            <div>
              {title && (
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pt-4 overflow-y-auto  custom-scroll">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
