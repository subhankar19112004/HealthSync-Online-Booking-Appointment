import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets_frontend/assets.js";

const SLIDES = [
  {
    id: 1,
    title: "Booking Appointments",
    highlight: "Made Easy",
    subtitle: "Quickcare",
    image: assets.header_img,
    description: "Explore our trusted network of doctors and easily book your appointment hassle-free.",
  },
  {
    id: 2,
    title: "Find Trusted Doctors",
    highlight: "Near You",
    subtitle: "Quickcare",
    image: assets.header_img,
    description: "Search and connect with verified healthcare professionals based on your needs and location.",
  },
  {
    id: 3,
    title: "Instant Consultation",
    highlight: "Anytime Anywhere",
    subtitle: "Quickcare",
    image: assets.header_img,
    description: "Skip long queues and consult with experienced doctors from the comfort of your home.",
  },
  {
    id: 4,
    title: "Your Health Records",
    highlight: "All in One Place",
    subtitle: "Quickcare",
    image: assets.header_img,
    description: "Securely store and access your medical history, prescriptions, and reports anytime.",
  },
  {
    id: 5,
    title: "Seamless Healthcare",
    highlight: "Experience",
    subtitle: "Quickcare",
    image: assets.header_img,
    description: "From booking to consultation, enjoy a smooth and reliable healthcare journey with Quickcare.",
  },
];

const Header = () => {
  const [index, setIndex] = useState(0);

  // --- Auto-Slider Logic (5 Seconds) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    /* FIXED: Added 'pt-32' for mobile and 'md:pt-40' for desktop. 
       This creates a safe zone so the Fixed Navbar doesn't cover your text.
    */
    <div className="relative overflow-hidden rounded-[2.5rem] bg-violet-600 min-h-[700px] md:h-[85vh] pt-50 mt-7 md:pt-40 flex items-center shadow-2xl mx-2 md:mx-0 transition-all duration-500">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row px-6 md:px-16 lg:px-24"
        >
          {/* --- TEXT CONTENT SIDE --- */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center gap-6 md:gap-10 text-center md:text-left z-10 pb-10 md:pb-0">
            
            <motion.div 
              initial={{ y: 40, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-black leading-[1.1] tracking-tight">
                {SLIDES[index].title} <br />
                <span className="text-violet-200 italic font-serif">
                  {SLIDES[index].highlight}
                </span>{" "}
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold">with</span>
                  <span className="text-white bg-red-500 px-4 py-1.5 rounded-xl text-sm md:text-lg shadow-xl font-black uppercase tracking-wider">
                    {SLIDES[index].subtitle}
                  </span>
                </div>
              </h1>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 text-white/90 bg-white/10 p-5 md:p-6 rounded-[2rem] backdrop-blur-xl border border-white/20 max-w-md shadow-2xl"
            >
              <img className="w-16 md:w-20" src={assets.group_profiles} alt="Profiles" />
              <p className="text-xs md:text-sm font-semibold leading-relaxed opacity-90">
                {SLIDES[index].description}
              </p>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
              <motion.a
                href="#speciality"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white px-10 md:px-14 py-4 md:py-5 rounded-full text-violet-600 font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all"
              >
                Book Now <img className="w-4 group-hover:translate-x-2 transition-transform" src={assets.arrow_icon} alt="arrow" />
              </motion.a>
            </motion.div>
          </div>

          {/* --- IMAGE SIDE --- */}
          <div className="w-full md:w-1/2 relative flex items-end justify-center h-full mt-auto md:mt-0 pt-10 md:pt-0">
            <motion.img
              key={`img-${index}`}
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
              src={SLIDES[index].image}
              alt="Doctor"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS INDICATORS */}
      <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className="h-1.5 w-10 md:w-20 bg-white/20 rounded-full overflow-hidden transition-all hover:bg-white/40">
            {index === i && (
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: 5, ease: "linear" }} 
                className="h-full bg-white shadow-[0_0_10px_#fff]" 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;