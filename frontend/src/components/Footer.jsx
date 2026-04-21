import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Scroll to top function for the branding
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='mt-40 relative'
    >
      {/* 3D Glassmorphic Wrapper */}
      <div className='bg-white/60 backdrop-blur-2xl rounded-t-[3rem] border-t border-white/80 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] px-6 md:px-16 pt-16 pb-8'>
        
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-16'>
          
          {/* --- Left Side: Branding --- */}
          <div className='space-y-6'>
            <motion.img 
              whileHover={{ scale: 1.05 }}
              onClick={scrollToTop}
              className='w-44 cursor-pointer drop-shadow-sm' 
              src={assets.logo} 
              alt="QuickCare Logo" 
            />
            <p className='w-full md:w-3/4 text-gray-500 leading-relaxed font-medium text-sm'>
              QuickCare is a user-friendly online platform that revolutionizes the way patients book doctor appointments. We bridge the gap between quality healthcare and convenience.
            </p>
            <div className='flex gap-3 text-violet-600'>
               <div className='w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all cursor-pointer'><FaGlobe size={14}/></div>
               {/* Add more social icons here if needed */}
            </div>
          </div>

          {/* --- Center: Navigation --- */}
          <div>
            <p className='text-lg font-bold text-gray-900 mb-6 tracking-tight'>COMPANY</p>
            <ul className='flex flex-col gap-3 text-gray-500 font-semibold'>
              {['Home', 'About us', 'Contact us', 'Privacy policy'].map((link) => (
                <li key={link} className='hover:text-violet-600 hover:translate-x-2 transition-all duration-300 cursor-pointer w-fit'>
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* --- Right Side: Contact --- */}
          <div>
            <p className='text-lg font-bold text-gray-900 mb-6 tracking-tight'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-4'>
              <li>
                <a href="mailto:aion@quickcare.com" className="flex items-center gap-3 group">
                  <div className='w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all'>
                    <FaEnvelope />
                  </div>
                  <span className='text-gray-500 font-semibold group-hover:text-violet-600 transition-colors'>aion@quickcare.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+919696932301" className="flex items-center gap-3 group">
                  <div className='w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all'>
                    <FaPhoneAlt />
                  </div>
                  <span className='text-gray-500 font-semibold group-hover:text-violet-600 transition-colors'>+91 96969 32301</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className='pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-400 font-bold text-xs uppercase tracking-widest'>
            © {currentYear} <span className='text-violet-600'>QuickCare</span>. All rights reserved.
          </p>
          
          <motion.button 
            whileHover={{ y: -5 }}
            onClick={scrollToTop}
            className='bg-violet-600 text-white p-3 rounded-2xl shadow-lg shadow-violet-200'
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer;