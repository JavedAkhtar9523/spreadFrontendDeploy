"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
export default function Dropdown({
  button,
  children,
  className,
  onOpen,
  onClose,
  initialOpen = false,
}) {
  const [open, setOpen] = useState(initialOpen);
  const ref = useRef(null);

  // Use useEffect to handle state updates after render
  const openDropdown = useCallback(() => {
    setOpen(true);
    // Use setTimeout to avoid setState during render
    setTimeout(() => onOpen?.(), 0);
  }, [onOpen]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setTimeout(() => onClose?.(), 0);
  }, [onClose]);

  const toggleDropdown = useCallback(() => {
    setOpen((prev) => {
      const newVal = !prev;
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        if (newVal) onOpen?.();
        else onClose?.();
      }, 0);
      return newVal;
    });
  }, [onOpen, onClose]);

  // outside click + escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        closeDropdown();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeDropdown]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {button}
      </div>

      {open && (
        <div className={`absolute mt-4 z-50 ${className || ""}`}>
          {typeof children === "function"
            ? children({ close: closeDropdown, open: openDropdown })
            : children}
        </div>
      )}
    </div>
  );
}


export function SmartDropdown({ trigger, children, width = 320, gap = 8 }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!open) calculatePosition();
    setOpen(!open);
  };

  const calculatePosition = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 350;

    const needsTop = rect.bottom + dropdownHeight >= window.innerHeight;

    setPosition({
      left: rect.left,
      top: needsTop ? rect.top - dropdownHeight - gap : rect.bottom + gap,
    });
  };

  // FIX: Close only when clicking outside both trigger and dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div ref={triggerRef} onClick={toggleDropdown}>
        {trigger}
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-white border custom-scroll border-gray-200 rounded-2xl z-[9999] overflow-hidden"
            style={{
              top: position.top,
              left: position.left,
              width,
              maxHeight: 350,
              overflowY: "auto",
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}