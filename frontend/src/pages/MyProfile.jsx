import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, FaSave, FaEnvelope, FaPhoneAlt, 
  FaMapMarkerAlt, FaVenusMars, FaBirthdayCake, FaCamera 
} from 'react-icons/fa';
import { assets } from "../assets/assets_frontend/assets.js";
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, loadingUser, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const address = userData?.address || { line1: "", line2: "" };

  const updateUserProfileData = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      if (image) formData.append("image", image);

      const { data } = await axios.post(backendUrl + "/api/user/update-profile", formData, {
        headers: { token },
      });

      if (data.success) {
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const updateAddress = (key, value) => {
    setUserData(prev => ({
      ...prev,
      address: { ...(prev.address || {}), [key]: value }
    }));
  };

  if (loadingUser) return (
    <div className="flex h-screen items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!userData) return <div className="text-center mt-20">User not found</div>;
  console.log("Current Gender from DB:", userData.gender);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto my-10 p-4 md:p-0"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDEBAR: PROFILE CARD */}
        <div className="md:w-1/3 bg-gradient-to-b from-violet-600 to-indigo-700 p-8 text-white flex flex-col items-center text-center">
          <div className="relative group">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <img
                className="w-44 h-44 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
                src={image ? URL.createObjectURL(image) : userData?.image}
                alt="profile"
              />
              <AnimatePresence>
                {isEdit && (
                  <motion.label 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    htmlFor="image" 
                    className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  >
                    <FaCamera className="text-3xl" />
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
                  </motion.label>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="mt-6">
            {isEdit ? (
              <input
                className="bg-white/10 border-b border-white/40 text-center text-2xl font-bold focus:outline-none w-full pb-1"
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                value={userData.name}
              />
            ) : (
              <h2 className="text-3xl font-bold">{userData.name}</h2>
            )}
            <p className="text-violet-200 mt-1 opacity-80 uppercase tracking-widest text-xs font-bold">Patient Member</p>
          </div>

          <div className="mt-auto w-full pt-10">
            <button
              onClick={() => isEdit ? updateUserProfileData() : setIsEdit(true)}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isEdit ? "bg-green-500 hover:bg-green-600" : "bg-white text-violet-600 hover:shadow-lg"
              }`}
            >
              {isSaving ? "Saving..." : isEdit ? <><FaSave /> Save Profile</> : <><FaEdit /> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT: DETAILS */}
        <div className="md:w-2/3 p-8 md:p-12 relative">
          <AnimatePresence>
            {isSaving && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center"
              >
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          <section className="mb-10">
            <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoBox icon={<FaEnvelope />} label="Email Address" value={userData.email} />
              <InfoBox 
                icon={<FaPhoneAlt />} label="Phone Number" 
                isEdit={isEdit} value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <div className="md:col-span-2">
                <InfoBox 
                  icon={<FaMapMarkerAlt />} label="Residential Address" 
                  isEdit={isEdit} isAddress={true}
                  addressValues={address}
                  onAddressChange={updateAddress}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100 mb-10" />

          <section>
            <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoBox 
                icon={<FaVenusMars />} label="Gender" 
                isEdit={isEdit} isSelect={true} value={userData.gender}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              />
              <InfoBox 
                icon={<FaBirthdayCake />} label="Date of Birth" 
                isEdit={isEdit} isDate={true} value={userData.dob}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Sub-component for Clean Code
const InfoBox = ({ icon, label, value, isEdit, onChange, isSelect, isDate, isAddress, addressValues, onAddressChange }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      {isEdit ? (
        isSelect ? (
          <select className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-violet-200 outline-none" value={value} onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : isDate ? (
          <input type="date" className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-violet-200 outline-none" value={value} onChange={onChange} />
        ) : isAddress ? (
          <div className="space-y-2">
            <input className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-violet-200 outline-none" value={addressValues.line1} onChange={e => onAddressChange('line1', e.target.value)} placeholder="Line 1" />
            <input className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-violet-200 outline-none" value={addressValues.line2} onChange={e => onAddressChange('line2', e.target.value)} placeholder="Line 2" />
          </div>
        ) : (
          <input className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-violet-200 outline-none" value={value} onChange={onChange} />
        )
      ) : (
        <p className="text-gray-700 font-semibold break-words">
          {isAddress ? <>{addressValues.line1}<br/>{addressValues.line2}</> : value}
        </p>
      )}
    </div>
  </div>
);

export default MyProfile;