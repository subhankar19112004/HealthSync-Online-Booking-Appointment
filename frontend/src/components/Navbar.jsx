import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { token, setToken, userData } = useContext(AppContext);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
    }

    // Common classes for NavLinks to avoid repetition
    const linkClasses = ({ isActive }) => 
        `relative py-1 px-2 transition-all duration-300 font-bold tracking-widest text-[11px] uppercase 
        ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`;

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b w-full border-gray-300 bg-white sticky top-0 z-[100] px-2 md:px-0'>
            {/* --- LOGO --- */}
            <img 
                onClick={() => navigate('/')} 
                className='w-40 md:w-44 cursor-pointer hover:opacity-80 transition-all duration-300' 
                src={assets.logo} 
                alt="Logo"
            />

            {/* --- DESKTOP MENU --- */}
            <ul className='hidden md:flex items-center gap-6'>
                <NavLink className={linkClasses} to='/'>
                    <li>HOME</li>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-indigo-600 transition-all duration-300 -translate-x-1/2 group-hover:w-full"></span>
                </NavLink>

                <NavLink className={linkClasses} to='/doctors'>
                    <li>ALL DOCTORS</li>
                </NavLink>

                <NavLink className={linkClasses} to='/about'>
                    <li>ABOUT</li>
                </NavLink>

                <NavLink className={linkClasses} to='/help'>
                    <li>CONTACT</li>
                </NavLink>
            </ul>

            {/* --- ACTIONS & PROFILE --- */}
            <div className='flex items-center gap-4'>
                {token && userData ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <div className="w-9 h-9 rounded-full border-2 border-indigo-100 p-0.5 group-hover:border-indigo-500 transition-all">
                            <img className='w-full h-full rounded-full object-cover' src={userData?.image} alt="User" />
                        </div>
                        <img className='w-2.5 opacity-50 group-hover:rotate-180 transition-transform duration-300' src={assets.dropdown_icon} alt="" />
                        
                        {/* --- DROPDOWN MENU --- */}
                        <div className='absolute top-full right-0 mt-2 hidden group-hover:block z-[110]'>
                            <div className='min-w-[180px] bg-white rounded-xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-1'>
                                <p onClick={() => navigate('/my-profile')} className='hover:bg-indigo-50 px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-gray-600 hover:text-indigo-600 transition-all'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:bg-indigo-50 px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-gray-600 hover:text-indigo-600 transition-all'>Appointments</p>
                                <hr className='my-1 border-gray-50' />
                                <p onClick={logout} className='hover:bg-rose-50 px-4 py-2.5 rounded-lg cursor-pointer font-semibold text-rose-500 transition-all'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className='bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-[10px] tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all hidden md:block uppercase'
                    >
                        Login
                    </button>
                )}

                {/* --- MOBILE TOGGLE --- */}
                <img 
                    src={assets.menu_icon} 
                    className='w-6 md:hidden cursor-pointer active:scale-90 transition-transform' 
                    onClick={() => setShowMenu(true)} 
                    alt="Menu"
                />

                {/* --- MOBILE FULLSCREEN MENU --- */}
                <div className={`fixed inset-0 z-[200] bg-white transition-all duration-500 transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <div className='flex items-center justify-between px-6 py-6 border-b'>
                        <img className='w-36' src={assets.logo} alt="Logo" />
                        <img className='w-7 cursor-pointer hover:rotate-90 transition-transform' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
                    </div>
                    
                    <ul className='flex flex-col items-center gap-6 mt-12 px-6 text-lg font-black text-gray-800 uppercase tracking-widest'>
                        <NavLink onClick={() => setShowMenu(false)} to='/' className={({isActive}) => `px-8 py-3 rounded-full transition-all ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-gray-500'}`}>
                            Home
                        </NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctors' className={({isActive}) => `px-8 py-3 rounded-full transition-all ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-gray-500'}`}>
                            All Doctors
                        </NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about' className={({isActive}) => `px-8 py-3 rounded-full transition-all ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-gray-500'}`}>
                            About Us
                        </NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/help' className={({isActive}) => `px-8 py-3 rounded-full transition-all ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 text-gray-500'}`}>
                            Need Help?
                        </NavLink>

                        {!token && (
                            <button onClick={() => { navigate('/login'); setShowMenu(false); }} className='w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100'>
                                Get Started
                            </button>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;