import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
  return (
    <div id='speciality' className='flex flex-col items-center gap-6 py-20 text-gray-800 px-6 max-w-7xl mx-auto'>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-3xl md:text-5xl font-black tracking-tight text-center'
      >
        Find by <span className="text-violet-600">Speciality</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='w-full max-w-lg text-center text-sm md:text-base text-gray-500 font-medium leading-relaxed'
      >
        Simply browse through our trusted network of doctors and schedule your appointment hassle-free.
      </motion.p>
      
      {/* Horizontal Scroll Container with added padding for the hover 'lift' effect */}
      <div className='flex sm:justify-center gap-4 md:gap-10 pt-10 pb-12 w-full overflow-x-auto custom-scrollbar scroll-smooth'>
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
            className="shrink-0"
          >
            <Link 
              onClick={() => window.scrollTo(0, 0)} 
              className='flex flex-col items-center group' 
              to={`/doctors/${item.speciality}`}
            >
              <div className='w-24 h-24 sm:w-32 sm:h-32 bg-violet-50 rounded-[2.5rem] flex items-center justify-center border-2 border-transparent group-hover:border-violet-200 group-hover:bg-white group-hover:-translate-y-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 ease-out'>
                <img className='w-14 sm:w-20' src={item.image} alt={item.speciality} />
              </div>
              <p className='mt-5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-violet-600 transition-colors text-center'>
                {item.speciality}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu;