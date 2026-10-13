import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { FaUserMd, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-4 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold tracking-widest uppercase"
        >
          <FaUserMd /> Expert Specialists
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900"
        >
          Top Doctors in our <span className="text-emerald-600">Network</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-xl text-sm md:text-base text-gray-500 font-medium leading-relaxed"
        >
          Simply browse through our extensive list of trusted medical
          specialists and book your consultation instantly.
        </motion.p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {doctors.slice(0, 10).map((item, index) => {
          const isAvailable = item?.available === true;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                window.scrollTo(0, 0);
              }}
              className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative bg-emerald-50/50 overflow-hidden aspect-square">
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Details Container */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className={`relative flex h-2.5 w-2.5`}>
                    {isAvailable && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                    ></span>
                  </span>
                  <span
                    className={`${isAvailable ? "text-emerald-600" : "text-rose-500"} font-bold text-[11px] tracking-wider uppercase`}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <h3 className="text-gray-900 text-base font-bold tracking-tight truncate group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider truncate">
                  {item.speciality}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* More Button */}
      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.03, translateY: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest shadow-lg shadow-emerald-600/20 transition-all uppercase flex items-center gap-3"
        >
          Explore All Doctors <FaArrowRight className="text-xs opacity-70" />
        </motion.button>
      </div>
    </section>
  );
};

export default TopDoctors;
