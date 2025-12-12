"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./header/SideBar";
import Header from "./header/Header";
import { useSelector } from "react-redux";

export default function MainLayout({ children }) {
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const pathname = usePathname();

  // 🧭 Routes where header (navbar) should be hidden
  const hideHeaderRoutes = ["/signin", "/signup"];
  const hideHeader = hideHeaderRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Conditionally render Header */}
      {!hideHeader && (
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className={`flex flex-1 ${!hideHeader ? "mt-10" : ""}`}>
        {/* Sidebar only when user is logged in */}
        {user ? (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            user={user}
          />
        ) : null}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
