import { useContext, useState } from 'react';
import { assets } from '../../assets/assets_admin/assets.js';
import { AdminContext } from '../../context/adminContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserMd, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaGraduationCap, FaMapMarkerAlt, FaMoneyBillWave, 
  FaStethoscope, FaChartLine, FaCheckCircle, FaCamera, FaUndo 
} from 'react-icons/fa';

const Adddoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('Dr. ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState(1); 
  const [fees, setFees] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const SPECIALITIES = ['General Physician', 'Gynecologist', 'Pediatrician', 'Dermatologist', 'Neurologist', 'Cardiologist', 'Gastroenterologist'];

  // --- RESET FORM LOGIC ---
  const resetForm = () => {
    setDocImg(false);
    setName('Dr. ');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setExperience(1);
    setFees('');
    setSpeciality('General Physician');
    setDegree('');
    setAddress1('');
    setAddress2('');
    setAbout('');
    setShowPassword(false);
    toast.info("Form cleared to defaults");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!docImg) return toast.error(`Please upload doctor's profile image`);
    if (password !== confirmPassword) return toast.error("Passwords do not match!");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience >= 10 ? "10+ Years" : `${experience} Years`);
      formData.append('fees', Number(fees));
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      formData.append('about', about);

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { 
        headers: { atoken: aToken } 
      });

      if (data.success) {
        toast.success(data.message);
        resetForm(); // Reset fields instead of reloading page
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F9FD] p-6 overflow-hidden">
      <motion.form 
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-7xl h-[90vh] flex flex-col md:flex-row rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-white"
      >
        
        {/* --- LEFT SIDEBAR: LIVE IDENTITY PREVIEW & ACTIONS --- */}
        <div className="md:w-[340px] bg-indigo-600 p-10 text-white flex flex-col items-center justify-between relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full text-center z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8">Doctor Identity</p>
            
            <label htmlFor="doc-img" className="relative group cursor-pointer inline-block">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-44 h-44 rounded-[2.5rem] overflow-hidden border-4 border-white/20 group-hover:border-white transition-all duration-500 shadow-2xl bg-indigo-500/50"
              >
                <img 
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                  className="w-full h-full object-cover" 
                  alt="Upload Area" 
                />
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-3 rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform pointer-events-none">
                <FaCamera size={18} />
              </div>
            </label>

            <input 
              onChange={(e) => setDocImg(e.target.files[0])} 
              type="file" 
              id="doc-img" 
              accept="image/*"
              hidden 
            />

            <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold truncate px-2">{name || "Doctor Name"}</h3>
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-widest">{speciality}</p>
            </div>
          </div>

          <div className="w-full space-y-4 z-10">
             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-left mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Experience</span>
                    <FaChartLine className="text-indigo-300 text-xs" />
                </div>
                <p className="text-2xl font-black">{experience >= 10 ? "10+" : experience} <span className="text-sm font-normal opacity-70">Years</span></p>
             </div>

             <div className="flex flex-col gap-3">
                <button type="submit" disabled={loading} className="w-full py-5 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 flex items-center justify-center">
                  {loading ? <ClipLoader color="#4f46e5" size={20} /> : "Finalize Profile"}
                </button>

                <button 
                  type="button" 
                  onClick={resetForm}
                  className="w-full py-3 bg-transparent border border-white/20 text-white/60 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <FaUndo className="text-[8px]" /> Reset Form
                </button>
             </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: FORM FIELDS --- */}
        <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div className="md:col-span-2 space-y-6">
              <SectionHeader number="01" title="Account Credentials" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input icon={<FaUserMd />} label="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
                <Input icon={<FaEnvelope />} label="Doctor Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                
                <div className="relative">
                  <Input icon={<FaLock />} label="Set Password" type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-6 bottom-4 text-gray-300 hover:text-indigo-600">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <Input icon={<FaLock />} label="Confirm Password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                  <AnimatePresence>
                    {confirmPassword && password === confirmPassword && (
                        <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute right-6 bottom-4 text-green-500"><FaCheckCircle /></motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader number="02" title="Professional Stats" />
              <div className="flex gap-4">
                <Input icon={<FaGraduationCap />} label="Highest Degree" value={degree} onChange={(e)=>setDegree(e.target.value)} placeholder="e.g. MBBS" />
                <Input icon={<FaMoneyBillWave />} label="Fees" type="number" value={fees} onChange={(e)=>setFees(e.target.value)} placeholder="500" />
              </div>

              <div className="bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100 mt-2">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience Level</label>
                    <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-bold">
                        {experience === 10 ? "10+ Years" : `${experience} Years`}
                    </span>
                </div>
                <input 
                    type="range" min="1" max="10" step="1" 
                    value={experience} onChange={(e)=>setExperience(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-2"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase">
                    <span>1 Yr</span>
                    <span>5 Yrs</span>
                    <span>10+ Yrs</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <SectionHeader number="03" title="Speciality" />
              <div className="grid grid-cols-2 gap-3">
                {SPECIALITIES.map(spec => (
                  <button 
                    key={spec} type="button" onClick={()=>setSpeciality(spec)}
                    className={`p-4 rounded-2xl text-[11px] font-bold border-2 transition-all ${speciality === spec ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <SectionHeader number="04" title="Clinic & Biography" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input icon={<FaMapMarkerAlt />} label="Clinic Location (Line 1)" value={address1} onChange={(e)=>setAddress1(e.target.value)} />
                <Input icon={<FaMapMarkerAlt />} label="Clinic Location (Line 2)" value={address2} onChange={(e)=>setAddress2(e.target.value)} />
              </div>
              <textarea 
                value={about} onChange={(e)=>setAbout(e.target.value)} 
                className="w-full p-6 bg-gray-50 rounded-[2rem] focus:bg-white border-2 border-transparent focus:border-indigo-50 transition-all outline-none text-sm font-medium text-gray-600 min-h-[140px]"
                placeholder="Briefly describe the doctor's experience..."
              />
            </div>

          </div>
        </div>
      </motion.form>
    </div>
  );
};

const SectionHeader = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-2">
        <span className="text-[10px] font-black w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">{number}</span>
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const Input = ({ icon, label, type="text", value, onChange, placeholder }) => (
  <div className="flex flex-col group">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-6 mb-1 tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors">{icon}</div>
      <input 
        type={type} value={value} onChange={onChange} required placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[1.5rem] focus:bg-white border-2 border-transparent focus:border-indigo-100 outline-none transition-all text-sm font-semibold text-gray-700"
      />
    </div>
  </div>
);

export default Adddoctor;