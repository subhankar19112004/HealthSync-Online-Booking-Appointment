import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStethoscope } from "react-icons/fa";

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Section Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold tracking-widest uppercase"
        >
          <FaStethoscope /> Medical Categories
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900"
        >
          Find by <span className="text-emerald-600">Speciality</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-xl text-sm md:text-base text-gray-500 font-medium leading-relaxed"
        >
          Simply browse through our trusted network of specialized doctors and
          schedule your medical consultation hassle-free.
        </motion.p>
      </div>

      {/* Scrollable Container with cards */}
      <div className="flex items-center sm:justify-center gap-6 sm:gap-8 pt-12 pb-8 w-full overflow-x-auto scrollbar-none scroll-smooth px-2">
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 120 }}
            className="shrink-0"
          >
            <Link
              onClick={() => window.scrollTo(0, 0)}
              className="flex flex-col items-center group"
              to={`/doctors/${item.speciality}`}
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border border-gray-100 group-hover:border-emerald-500/30 group-hover:bg-emerald-50/40 group-hover:-translate-y-2.5 shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-600/10 transition-all duration-300 ease-out p-4 relative overflow-hidden">
                {/* Subtle Hover Glow Backdrop */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />

                <img
                  className="w-14 sm:w-20 object-contain transition-transform duration-300 group-hover:scale-110 relative z-10"
                  src={item.image}
                  alt={item.speciality}
                />
              </div>

              <span className="mt-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-600 group-hover:text-emerald-600 transition-colors text-center max-w-[120px] truncate">
                {item.speciality}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
