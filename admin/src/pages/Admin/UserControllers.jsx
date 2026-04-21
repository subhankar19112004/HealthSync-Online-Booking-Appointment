import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaUserPlus, FaUserShield, FaUserCheck, FaUserSlash, 
  FaEnvelope, FaLock, FaVenusMars, FaSearch, FaTimes, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const UserControllers = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const [gender, setGender] = useState('Male');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const aToken = localStorage.getItem('aToken');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-users`, {
        headers: { aToken }
      });
      if (data.success) setUsers(data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    }
  };

  const blockUser = async (userId, blockDuration) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/block-user`, 
        { userId, blockDuration },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  const addPatient = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match!");
    if (password.length < 8) return toast.error("Use 8+ characters for password");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-patient`,
        { name, email, password, gender }, 
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success('Patient Added Successfully');
        setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setGender('Male');
        fetchUsers();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Access Control</h1>
          <p className='text-gray-500 text-sm font-medium'>Manage security and onboarding</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input 
              type="text" placeholder="Search users..." 
              value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-full md:w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all"
          >
            <FaUserPlus /> <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className='bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_3fr_2fr_2fr] bg-gray-50/50 py-5 px-8 border-b text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
          <p>User</p><p>Name</p><p>Email</p><p>Account Status</p><p className="text-right">Action</p>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          {filteredUsers.map((user) => (
  <div key={user._id} className='flex flex-col md:grid md:grid-cols-[1fr_3fr_3fr_2fr_2fr] items-center py-5 px-8 border-b last:border-0 hover:bg-indigo-50/30 transition-all'>
    
    {/* --- SIMPLE AVATAR --- */}
    <div className="w-10 h-10 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold border border-indigo-50 shadow-sm">
      {user.image || user.profilePic ? (
        <img 
          src={user.image || user.profilePic} 
          className="w-full h-full object-cover" 
          alt="" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span>${user.name.charAt(0)}</span>`;
          }}
        />
      ) : (
        <span>{user.name.charAt(0)}</span>
      )}
    </div>

    <p className="font-bold text-gray-800">{user.name}</p>
    <p className="text-gray-500 font-medium text-sm">{user.email}</p>
    
    <div>
      {user.blockUntil ? (
        <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100">
          <FaUserSlash /> Blocked
        </span>
      ) : (
        <span className="text-green-500 text-[10px] font-black uppercase flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100">
          <FaUserCheck /> Active
        </span>
      )}
    </div>

    <div className="flex justify-end w-full">
      <button 
        onClick={() => blockUser(user._id, user.blockUntil ? 0 : 7)}
        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${user.blockUntil ? 'bg-white text-green-600 border border-green-100 hover:bg-green-600 hover:text-white' : 'bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white'}`}
      >
        {user.blockUntil ? 'Unblock' : 'Block User'}
      </button>
    </div>
  </div>
))}
        </div>
      </div>

      {/* --- ADD PATIENT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-indigo-600 p-8 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><FaTimes /></button>
                <h2 className="text-2xl font-black tracking-tight">Onboard Patient</h2>
                <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">Security Configuration</p>
              </div>

              <form onSubmit={addPatient} className="p-8 space-y-4">
                <ModalInput label="Full Name" icon={<FaUser />} value={name} onChange={(e)=>setName(e.target.value)} />
                <ModalInput label="Email Address" icon={<FaEnvelope />} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                
                <div className="relative">
                  <ModalInput label="Create Password" icon={<FaLock />} type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-3 text-gray-400 hover:text-indigo-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <ModalInput label="Repeat Password" icon={<FaLock />} type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                  {confirmPassword && password === confirmPassword && (
                    <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute right-4 bottom-3 text-green-500"><FaUserCheck /></motion.span>
                  )}
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Gender Identification</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button key={g} type="button" onClick={() => setGender(g)} className={`py-2.5 rounded-xl text-[10px] font-bold transition-all border-2 ${gender === g ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                  {loading ? <ClipLoader color="#fff" size={18} /> : "Finalize Profile"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModalInput = ({ label, icon, type="text", value, onChange }) => (
  <div className="group">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors">{icon}</span>
      <input type={type} value={value} onChange={onChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 outline-none transition-all text-sm font-semibold text-gray-700 placeholder:text-gray-200" />
    </div>
  </div>
);

export default UserControllers;