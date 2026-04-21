import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaLock, FaVenusMars, 
  FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaArrowRight 
} from 'react-icons/fa';

const Login = () => {
  const [state, setState] = useState('Sign Up'); // 'Sign Up' or 'Login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  
  // ✅ ADDED 'token' HERE TO FIX THE "NOT DEFINED" ERROR
  const { backendUrl, setToken, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- 3D Tilt Logic ---
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - card.top - card.height / 2) / 25;
    const y = (e.clientX - card.left - card.width / 2) / -25;
    setRotate({ x, y });
  };

  // --- Navigation Guard ---
  // Redirects user if they are already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Frontend Validations for Signup
    if (state === 'Sign Up') {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }
      if (password.length < 8) {
        return toast.error("Password must be at least 8 characters");
      }
    }

    setLoading(true);
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, gender });
        if (data.success) {
          toast.success('Account Created! Please Login.');
          setState('Login');
          // Clear sensitive fields
          setPassword('');
          setConfirmPassword('');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Welcome back!');
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Connection Error');
    }
    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center min-h-[90vh] perspective-2000 overflow-hidden py-10 px-4'>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotate({ x: 0, y: 0 })}
        style={{ rotateX: rotate.x, rotateY: rotate.y, transformStyle: "preserve-3d" }}
        className='w-full max-w-[480px] relative'
      >
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 blur-3xl -z-10" />

        <div className='bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white/60 relative'>
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-violet-200"
            >
              <FaShieldAlt className="text-white text-2xl" />
            </motion.div>
            <h2 className='text-4xl font-black tracking-tighter text-gray-900'>
              {state === 'Sign Up' ? 'Join Us' : 'Welcome'}
            </h2>
            <p className='text-gray-500 font-medium text-sm mt-1 italic'>Experience premium healthcare</p>
          </div>

          <form onSubmit={onSubmitHandler} className='space-y-4'>
            <AnimatePresence mode="wait">
              {state === 'Sign Up' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CustomInput label="Full Name" icon={<FaUser />} type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Subhankar Jena" />
                </motion.div>
              )}
            </AnimatePresence>

            <CustomInput label="Email" icon={<FaEnvelope />} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="hello@quickcare.com" />

            <div className="relative">
              <CustomInput 
                label="Password" icon={<FaLock />} 
                type={showPassword ? "text" : "password"} 
                value={password} onChange={(e)=>setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 bottom-4 text-gray-400 hover:text-violet-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <AnimatePresence>
              {state === 'Sign Up' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <CustomInput 
                      label="Confirm Password" icon={<FaCheckCircle />} 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} 
                      placeholder="Repeat password" 
                    />
                    {confirmPassword && password === confirmPassword && (
                      <FaCheckCircle className="absolute right-6 bottom-4 text-green-500" />
                    )}
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">Gender</label>
                    <div className="flex gap-2">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <button
                          key={g} type="button" onClick={() => setGender(g)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${gender === g ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className='w-full py-5 mt-4 bg-gray-900 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-gray-400 flex items-center justify-center gap-3 disabled:opacity-50 transition-shadow'
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
                <>
                  {state === 'Sign Up' ? 'Create Account' : 'Login Now'}
                  <FaArrowRight className="text-sm opacity-50" />
                </>
              )}
            </motion.button>
          </form>

          <div className='mt-8 text-center'>
            <button
              onClick={() => {
                setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
                setShowPassword(false);
              }}
              className='text-sm font-bold text-gray-400 hover:text-violet-600 transition-colors duration-300'
            >
              {state === 'Sign Up' ? 'Already a member? Sign In' : 'New to Quickcare? Join Now'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-component for Inputs ---
const CustomInput = ({ label, icon, type, value, onChange, placeholder }) => (
  <div className="group flex flex-col">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-6 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-violet-500 transition-colors duration-300">{icon}</span>
      <input
        type={type} value={value} onChange={onChange} required placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-violet-100 transition-all duration-300 outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-300"
      />
    </div>
  </div>
);

export default Login;

// import React, { useContext, useEffect, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaLock, FaVenusMars, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

// const Login = () => {
//   const [state, setState] = useState('Sign Up');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [name, setName] = useState('');
//   const [gender, setGender] = useState('Male');
  
//   const { backendUrl, setToken } = useContext(AppContext);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // 3D Tilt Logic
//   const [rotate, setRotate] = useState({ x: 0, y: 0 });
//   const handleMouseMove = (e) => {
//     const card = e.currentTarget.getBoundingClientRect();
//     const x = (e.clientY - card.top - card.height / 2) / 25;
//     const y = (e.clientX - card.left - card.width / 2) / -25;
//     setRotate({ x, y });
//   };

  

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
    
//     // Frontend Validations
//     if (state === 'Sign Up') {
//       if (password !== confirmPassword) {
//         return toast.error("Passwords do not match!");
//       }
//       if (password.length < 8) {
//         return toast.error("Password must be at least 8 characters");
//       }
//     }

//     setLoading(true);
//     try {
//       if (state === 'Sign Up') {
//         const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, gender });
//         if (data.success) {
//           toast.success('Account Created! Please Login.');
//           setState('Login');
//         } else {
//           toast.error(data.message);
//         }
//       } else {
//         const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
//         if (data.success) {
//           localStorage.setItem('token', data.token);
//           setToken(data.token);
//           navigate('/');
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Connection Error');
//     }
//     setLoading(false);
//   };
//   useEffect(() => {
//   if (token) {
//     navigate('/');
//   }
// }, [token, navigate]);


//   return (
//     <div className='flex items-center justify-center min-h-[90vh] perspective-2000 overflow-hidden py-10'>
//       <motion.div
//         onMouseMove={handleMouseMove}
//         onMouseLeave={() => setRotate({ x: 0, y: 0 })}
//         style={{ rotateX: rotate.x, rotateY: rotate.y, transformStyle: "preserve-3d" }}
//         className='w-full max-w-[480px] relative'
//       >
//         {/* The "Glow" Layer */}
//         <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 blur-3xl -z-10" />

//         <div className='bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-white/60 relative'>
          
//           <div className="text-center mb-10">
//             <motion.div 
//               initial={{ scale: 0 }} animate={{ scale: 1 }}
//               className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-violet-200"
//             >
//               <FaShieldAlt className="text-white text-2xl" />
//             </motion.div>
//             <h2 className='text-4xl font-black tracking-tighter text-gray-900'>
//               {state === 'Sign Up' ? 'Create' : 'Sign In'}
//             </h2>
//             <p className='text-gray-500 font-medium text-sm mt-1'>Join the Quickcare experience</p>
//           </div>

//           <form onSubmit={onSubmitHandler} className='space-y-4'>
//             <AnimatePresence mode="wait">
//               {state === 'Sign Up' && (
//                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
//                   <CustomInput label="Full Name" icon={<FaUser />} type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Subhankar Jena" />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <CustomInput label="Email" icon={<FaEnvelope />} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="hello@quickcare.com" />

//             <div className="relative">
//               <CustomInput 
//                 label="Password" icon={<FaLock />} 
//                 type={showPassword ? "text" : "password"} 
//                 value={password} onChange={(e)=>setPassword(e.target.value)} 
//                 placeholder="••••••••" 
//               />
//               <button 
//                 type="button" onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-5 bottom-4 text-gray-400 hover:text-violet-600 transition-colors"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>

//             <AnimatePresence>
//               {state === 'Sign Up' && (
//                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4">
//                   <div className="relative">
//                     <CustomInput 
//                       label="Confirm Password" icon={<FaCheckCircle />} 
//                       type={showPassword ? "text" : "password"} 
//                       value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} 
//                       placeholder="Repeat password" 
//                     />
//                     {confirmPassword && password === confirmPassword && (
//                       <FaCheckCircle className="absolute right-5 bottom-4 text-green-500" />
//                     )}
//                   </div>

//                   <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
//                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Gender Identification</label>
//                     <div className="flex gap-2">
//                       {['Male', 'Female', 'Other'].map((g) => (
//                         <button
//                           key={g} type="button" onClick={() => setGender(g)}
//                           className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${gender === g ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
//                         >
//                           {g}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <motion.button
//               whileHover={{ scale: 1.02, translateY: -2 }}
//               whileTap={{ scale: 0.98 }}
//               disabled={loading}
//               className='w-full py-5 mt-4 bg-gray-900 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-gray-300 flex items-center justify-center gap-3 disabled:opacity-50'
//             >
//               {loading ? "Processing..." : state === 'Sign Up' ? 'Create Account' : 'Login Now'}
//             </motion.button>
//           </form>

//           <div className='mt-8 text-center'>
//             <button
//               onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
//               className='text-sm font-bold text-gray-400 hover:text-violet-600 transition-colors'
//             >
//               {state === 'Sign Up' ? 'Already a member? Sign In' : 'New here? Create an Account'}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const CustomInput = ({ label, icon, type, value, onChange, placeholder }) => (
//   <div className="group flex flex-col">
//     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-5 mb-1">{label}</label>
//     <div className="relative">
//       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">{icon}</span>
//       <input
//         type={type} value={value} onChange={onChange} required placeholder={placeholder}
//         className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-violet-100 transition-all outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-300"
//       />
//     </div>
//   </div>
// );

// export default Login;