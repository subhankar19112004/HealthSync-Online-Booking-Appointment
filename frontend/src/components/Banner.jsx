import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserPlus, FaCalendarCheck, FaShieldAlt } from 'react-icons/fa'

const Banner = () => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleActionForBooking = () => {
    navigate('/#speciality');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[2.5rem] my-20 md:mx-10 overflow-hidden shadow-[0_20px_50px_rgba(124,58,237,0.3)]'
    >
      {/* Decorative Animated Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-44 h-44 bg-indigo-400/20 rounded-full blur-2xl" />

      <div className='flex flex-col md:flex-row items-center px-8 sm:px-12 md:px-16 lg:px-20'>
        
        {/* --- LEFT SIDE: Content --- */}
        <div className='flex-1 py-12 md:py-24 space-y-8 z-10 text-center md:text-left'>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
              <FaShieldAlt className="text-violet-200 text-xs" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Verified Healthcare Network</span>
            </div>
            
            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]'>
              Ready to meet your <br/> 
              <span className="text-indigo-200 italic font-serif">Perfect Doctor?</span>
            </h2>
          </motion.div>

          {/* NEW UNIQUE ACTION SECTION (Replacing the old button) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <button 
              onClick={handleAction}
              className='group relative flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden'
            >
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <FaUserPlus />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Patient?</p>
                <p className="text-sm font-black text-gray-800">Join QuickCare</p>
              </div>
            </button>

            <button 
              onClick={handleActionForBooking}
              className='group flex items-center gap-4 bg-transparent border border-white/30 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300'
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <FaCalendarCheck />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Existing User</p>
                <p className="text-sm font-black text-white">Book Now</p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: 3D Image --- */}
        <div className='hidden md:flex md:w-1/2 lg:w-[450px] relative h-full items-end justify-end self-end pt-10'>
          <motion.img 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className='w-full max-w-sm drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.3)]' 
            src={assets.appointment_img} 
            alt="Doctor Support" 
          />
        </div>
      </div>
    </motion.div>
  )
}

export default Banner