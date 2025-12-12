"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Menu,
  X,
  UserRoundSearch,
  BriefcaseBusiness,
  Users,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import SearchBar from "../header/SearchBox";
import LinkButton from "../components/button/Button";
import { StaggeredContainer, AnimatedWrapper } from "../animation/animation";
import CreatePostModal from "./CreatePostModal";
import { FiSettings } from "react-icons/fi";
import { FaQuestionCircle } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Community", href: "/community" },
  { label: "Companies", href: "/companies" },
  { label: "Jobs", href: "/jobs" },
  { label: "about", href: "/About" },
];

export default function Header({ isSidebarOpen, toggleSidebar }) {
  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // refs
  const profileDropdownRef = useRef(null);

  // redux + router
  const { notifications = [] } = useSelector((s) => s.users || {});
  const { user } = useSelector((s) => s.auth || { user: null });
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // derived values
  const { unreadCount } = useMemo(() => {
    const unread = (notifications || []).reduce((c, n) => (!n.read ? c + 1 : c), 0);
    return { unreadCount: unread };
  }, [notifications]);

  // mount flag for client-only UI (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // scroll effect (lightweight)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  // close profile dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // handlers (memoized)
  const handleToggleMobile = useCallback(() => setMobileMenuOpen((s) => !s), []);
  const handleCloseMobile = useCallback(() => setMobileMenuOpen(false), []);
  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    router.push("/signin");
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  }, [dispatch, router]);

  const handleNavClick = useCallback(
    (href, e) => {
      // keep original behavior: if logged in, redirect signup/signin to jobfeed
      if ((user || localStorage.getItem("token")) && (href === "/signin" || href === "/signup")) {
        e?.preventDefault();
        router.push("/jobfeed");
        setMobileMenuOpen(false);
        return false;
      }
      return true;
    },
    [user, router]
  );

  const handleViewProfile = useCallback(() => {
    router.push("/in/rupendra");
    setShowProfileDropdown(false);
  }, [router]);

  // small subcomponents extracted for readability & reuse
  const IconLabel = ({ href, Icon, label, ariaLabel }) => (
    <Link href={href} aria-label={ariaLabel || label} className="flex flex-col items-center">
      <Icon size={26} strokeWidth={1.5} className="text-gray-700 cursor-pointer" />
      <span className="text-[12px] text-gray-700 font-medium">{label}</span>
    </Link>
  );

  const NavItem = ({ href, children }) => (
    <li>
      <Link
        href={href}
        onClick={(e) => {
          handleNavClick(href, e);
          handleCloseMobile();
        }}
        className={`group block py-2 px-4 rounded-lg ${pathname === href ? "text-[#1200B1]" : "text-gray-700"} hover:bg-blue-50`}
      >
        {children}
      </Link>
    </li>
  );

  function ProfileDropdown() {
    if (!showProfileDropdown) return null;
    return (
      <div
        ref={profileDropdownRef}
        className="absolute top-full mt-3 right-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideDown"
      >
        <div className="p-3 border-b border-gray-300">
          <div className="flex items-start gap-3">
            <img
              src={user?.avatar || "/default-user-profile.svg"}
              className="w-12 h-12 rounded-full object-cover"
              alt="User Profile"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{user?.name || "Rupendra Kumar"}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                {user?.bio || "Software Developer | Tech Enthusiast | AI + Frontend Enthusiast"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* settings */}
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 border-b border-gray-400 hover:bg-gray-100">
            <FiSettings className="w-4 h-4 text-gray-800" /> Settings
          </Link>

          <Link href="/help" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 border-b border-gray-400 hover:bg-gray-100">
            <FaQuestionCircle className="w-4 h-4 text-gray-800" /> Help &amp; Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <header
      className={`w-full bg-white border-b-[0.6px] border-[#aeadad] fixed top-0 z-30 transition-shadow ${scrolled ? "shadow-sm" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left: logo + search */}
          <div className="flex items-center gap-6">
            <Link href="/feeds" className="flex items-center gap-2">
              {/* using img here to keep parity with your original; Next/Image can be used if desired */}
              <img src="/spreads.svg" alt="Logo" className="w-12 h-11 transition-all" />
            </Link>

            {user && (
              <div className="hidden md:block">
                <SearchBar />
              </div>
            )}
          </div>

          {/* center (desktop) - left intentionally empty to preserve layout spacing */}
          <div className="flex-1" />

          {/* right actions */}
          <nav className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-6">
                  <IconLabel href="/collabs" Icon={UserRoundSearch} label="Collabs" />
                  <div className="flex flex-col items-center">
                    <Link href="/jobs" aria-label="Jobs" className="flex flex-col items-center">
                      <BriefcaseBusiness strokeWidth={1.5} className="text-gray-700 cursor-pointer" />
                    </Link>
                    <span className="text-[12px] text-gray-700 font-medium">Jobs</span>
                  </div>
                  <IconLabel href="/community" Icon={Users} label="Community" />
                  <div className="relative flex flex-col items-center">
                    <Link href="/notifications" aria-label="Notifications" className="flex flex-col items-center">
                      <Bell strokeWidth={1.5} className="text-gray-700 w-6 h-6" />
                      {mounted && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 rounded-full bg-[#F43F5E] text-white text-[10px] w-5 h-5 flex items-center justify-center shadow-md">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <span className="text-[12px] text-gray-700 font-medium">Notifications</span>
                  </div>
                </div>

                {/* profile avatar */}
                <div className="relative">
                  <button
                    aria-haspopup="true"
                    aria-expanded={showProfileDropdown}
                    onClick={() => {
                      setShowProfileDropdown((v) => !v);
                    }}
                    className="p-0 rounded-full focus:outline-none"
                  >
                    <img
                      src={user?.avatar || "/default-user-profile.svg"}
                      alt="User profile"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </button>
                  <ProfileDropdown />
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <LinkButton href="/signup" name="Sign Up" linkclassname="!py-1.5" showIcon={false} onClick={(e) => handleNavClick("/signup", e)} />
              </div>
            )}

            {/* mobile menu toggle (only for small screens) */}
            {!user && (
              <button
                className={`md:hidden p-2 rounded-lg transition ${mobileMenuOpen ? "bg-[#1200B1] text-white" : "text-gray-700"}`}
                onClick={handleToggleMobile}
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-5 h-5">
                  <Menu className={`absolute transition-transform ${mobileMenuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`} size={20} />
                  <X className={`absolute transition-transform ${mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} size={20} />
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed left-0 top-0 w-full h-screen bg-white z-40 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" onClick={handleCloseMobile}>
            <Image src="/Finalloo.svg" alt="Logo" width={40} height={40} className="w-10 h-10" />
          </Link>
          <button onClick={handleCloseMobile} aria-label="Close mobile menu" className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          <StaggeredContainer className="flex flex-col space-y-2">
            <ul className="space-y-1">
              {NAV_LINKS.map(({ label, href }, idx) => (
                <AnimatedWrapper key={href} delay={idx * 0.06} className="w-full">
                  <NavItem href={href}>
                    <span className={`text-lg font-medium ${pathname === href ? "text-[#1200B1]" : "text-gray-700"}`}>{label}</span>
                  </NavItem>
                </AnimatedWrapper>
              ))}
            </ul>

            <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
              <AnimatedWrapper delay={0.6}>
                {user ? (
                  <>
                    <Link href="/profile" onClick={handleCloseMobile} className="text-center py-3 px-6 rounded-lg border-2 border-[#1200B1] text-[#1200B1] font-medium hover:bg-[#1200B1] hover:text-white">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="text-center py-3 px-6 rounded-lg border-2 border-[#1200B1] text-[#1200B1] font-medium hover:bg-[#1200B1] hover:text-white">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-start space-y-3">
                    <LinkButton showIcon={false} href="/signin" name="Login" onClick={(e) => { handleNavClick("/signin", e); handleCloseMobile(); }} />
                    <LinkButton showIcon={false} href="/signup" name="Sign Up" onClick={(e) => { handleNavClick("/signup", e); handleCloseMobile(); }} />
                  </div>
                )}
              </AnimatedWrapper>
            </div>
          </StaggeredContainer>
        </div>
      </div>

      {/* backdrop */}
      {mobileMenuOpen && <div className="flex md:flex fixed inset-0 bg-black/20 z-30 backdrop-blur-sm" onClick={handleCloseMobile} />}

      {/* optional create post modal */}
      {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />}

      {/* local styles used by original component */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
