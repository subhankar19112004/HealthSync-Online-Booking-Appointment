import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets_frontend/assets.js";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  // Add subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/login");
  };

  // Navigation Links Config
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Doctors", path: "/doctors" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/help" },
  ];

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-300 w-full px-4 sm:px-8 py-3 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white border-b border-gray-200"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* --- LOGO --- */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            className="w-36 sm:w-40 object-contain transition-transform duration-300 group-hover:scale-105"
            src={assets.logo}
            alt="QuickCare Logo"
          />
        </div>

        {/* --- DESKTOP NAV LINKS --- */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? "text-white bg-emerald-600 shadow-md shadow-emerald-600/20"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100/60"
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* --- ACTIONS & PROFILE AREA --- */}
        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="relative">
              {/* Profile Trigger Button */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all border border-gray-200/60"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm">
                  <img
                    className="w-full h-full object-cover"
                    src={userData?.image || assets.profile_pic}
                    alt="User Profile"
                  />
                </div>
                <span className="hidden lg:block text-xs font-bold text-gray-700 max-w-[100px] truncate">
                  {userData?.name || "My Account"}
                </span>
                <FaChevronDown
                  className={`text-xs text-gray-400 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                />
              </div>

              {/* --- DROPDOWN MENU --- */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-[110] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {userData?.email || "Patient"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/my-profile");
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-left"
                    >
                      <FaUser className="text-emerald-600" /> My Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-appointments");
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-left"
                    >
                      <FaCalendarAlt className="text-emerald-600" /> My
                      Appointments
                    </button>

                    <div className="h-[1px] bg-gray-100 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all text-left"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-wider shadow-md shadow-emerald-600/20 transition-all uppercase"
            >
              <FaUserMd className="text-sm" /> Login / Sign Up
            </motion.button>
          )}

          {/* --- MOBILE HAMBURGER TOGGLE --- */}
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 md:hidden text-gray-700 hover:text-emerald-600 focus:outline-none transition-colors"
            aria-label="Open Menu"
          >
            <FaBars size={22} />
          </button>
        </div>

        {/* --- MOBILE FULLSCREEN SLIDE DRAWER --- */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm md:hidden flex justify-end"
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
              >
                {/* Drawer Header */}
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <img
                      className="w-32 object-contain"
                      src={assets.logo}
                      alt="Logo"
                    />
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>

                  {/* Mobile Links */}
                  <div className="flex flex-col gap-2 mt-6">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <NavLink
                          key={link.name}
                          onClick={() => setShowMenu(false)}
                          to={link.path}
                          className={`px-4 py-3 rounded-xl font-bold text-sm tracking-wider uppercase transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {link.name}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Footer / Auth Action */}
                <div className="pt-6 border-t border-gray-100">
                  {!token && (
                    <button
                      onClick={() => {
                        navigate("/login");
                        setShowMenu(false);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <FaUserMd /> Get Started / Login
                    </button>
                  )}
                  {token && (
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="w-full bg-rose-50 text-rose-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
