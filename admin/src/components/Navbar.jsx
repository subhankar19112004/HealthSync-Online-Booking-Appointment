// import React, { useContext } from 'react'
// import { assets } from '../assets/assets_admin/assets'
// import { AdminContext } from '../context/adminContext'
// import { useNavigate } from 'react-router-dom'

// const Navbar = () => {
//     const { aToken, setAToken } = useContext(AdminContext);
//     const navigate = useNavigate();
//     const logout = () => {
//         aToken && setAToken('');
//         aToken && localStorage.removeItem('aToken');
//         navigate('/login');
//     }
    
//   return (
//     <div className=' flex justify-between items-center px-4 sm:px-10 py-3 border-b border-transparent bg-white'>
//         <div className='flex items-center gap-2 text-xs'>
//             <img className=' w-36 sm:w-40 cursor-pointer' onClick={() => navigate('/') } src={assets.admin_logo}/>
//             <p className=' border px-2.5 rounded-full py-0.5 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-300  '>{aToken ? 'Admin' : "Doctor" }</p>
//         </div>
//         <button className=' bg-violet-500 hover:bg-violet-100 hover:text-violet-500 transition-colors duration-300 text-white px-8 py-1 rounded-full' onClick={logout } type='button'>Logout</button>
//     </div>
//   )
// }

// export default Navbar

import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/adminContext'
import { DoctorContext } from '../context/doctorContext' // Added this
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext); // Destructure doctor token
    
    const navigate = useNavigate();

    const logout = () => {
        navigate('/login');
        // Clear Admin Token
        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }
        // Clear Doctor Token
        if (dToken) {
            setDToken('');
            localStorage.removeItem('dToken');
        }
    }
    
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b border-transparent bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer' onClick={() => navigate('/') } src={assets.admin_logo}/>
            {/* Improved label logic */}
            <p className='border px-2.5 rounded-full py-0.5 border-gray-500 text-gray-600'>
                {aToken ? 'Admin' : 'Doctor'}
            </p>
        </div>
        <button 
            className='bg-violet-500 hover:bg-violet-100 hover:text-violet-500 transition-colors duration-300 text-white px-8 py-1 rounded-full' 
            onClick={logout} 
            type='button'
        >
            Logout
        </button>
    </div>
  )
}

export default Navbar