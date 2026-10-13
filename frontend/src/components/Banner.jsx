import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus, FaCalendarCheck, FaShieldAlt } from "react-icons/fa";

const Banner = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate("/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActionForBooking = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("speciality");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 500, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[2.5rem] my-20 mx-4 sm:mx-8 md:mx-10 overflow-hidden shadow-[0_20px_50px_rgba(4,120,87,0.25)] border border-emerald-700/50"
    >
      {/* Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between px-8 sm:px-12 md:px-16 lg:px-20">
        {/* --- LEFT SIDE: Content --- */}
        <div className="flex-1 py-12 md:py-20 space-y-8 z-10 text-center md:text-left">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 shadow-sm">
              <FaShieldAlt className="text-emerald-300 text-xs" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                Verified Healthcare Network
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Ready to meet your <br />
              <span className="text-emerald-300 italic font-serif">
                Perfect Doctor?
              </span>
            </h2>
          </motion.div>

          {/* Action Buttons Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2"
          >
            <button
              onClick={handleAction}
              className="group relative w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 bg-white px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <FaUserPlus />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  New Patient?
                </p>
                <p className="text-sm font-black text-gray-900">
                  Join QuickCare
                </p>
              </div>
            </button>

            <button
              onClick={handleActionForBooking}
              className="group w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 bg-emerald-950/40 border border-white/20 px-7 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
                <FaCalendarCheck />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  Existing User
                </p>
                <p className="text-sm font-black text-white">Book Now</p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: 3D Image --- */}
        <div className="hidden md:flex md:w-1/2 lg:w-[420px] relative h-full items-end justify-end self-end pt-8">
          <motion.img
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            whileHover={{ scale: 1.04, rotate: -1 }}
            className="w-full max-w-sm drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.35)] object-contain"
            src={assets.appointment_img}
            alt="Doctor Support"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;
