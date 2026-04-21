import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/adminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from "../../assets/assets_admin/assets.js";
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUserMd, FaCalendarAlt, FaClock, FaTrashAlt, FaCheckCircle, FaExclamationCircle, FaFilter, FaSearch } from 'react-icons/fa';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All'); // All, Completed, Cancelled, Active
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  // Helper: Check if expired
  const isExpired = (slotDate, slotTime) => {
    if (!slotDate || !slotTime) return false;
    const [day, month, year] = slotDate.split('-');
    const [time, modifier] = slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const appointmentDate = new Date(`${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    return appointmentDate <= new Date();
  };

  // Filter Logic
  const filteredAppointments = appointments.filter(item => {
    const matchesSearch = item.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.docData.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'Cancelled') return item.cancelled && matchesSearch;
    if (filterStatus === 'Completed') return item.isCompleted && matchesSearch;
    if (filterStatus === 'Active') return !item.cancelled && !item.isCompleted && !isExpired(item.slotDate, item.slotTime) && matchesSearch;
    return matchesSearch;
  });

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) cancelAppointment(selectedAppointment._id);
    setShowCancelModal(false);
  };

  return (
    <div className='p-6 w-full max-w-7xl mx-auto'>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Appointments</h1>
          <p className='text-gray-500 text-sm font-medium'>Manage and monitor all patient bookings</p>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input 
              type="text" 
              placeholder="Search patient or doctor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64 shadow-sm"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['All', 'Active', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- APPOINTMENTS TABLE --- */}
      <div className='bg-white/70 backdrop-blur-md rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden'>
        <div className='hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.2fr] bg-gray-50/50 py-4 px-8 border-b text-[11px] font-black text-gray-400 uppercase tracking-widest'>
          <p>#</p>
          <p>Patient Details</p>
          <p>Age</p>
          <p>Schedule</p>
          <p>Assigned Doctor</p>
          <p>Fee</p>
          <p className="text-center">Status / Actions</p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className='flex flex-col md:grid md:grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1.2fr] items-center py-5 px-8 border-b last:border-0 hover:bg-indigo-50/30 transition-colors'
                >
                  <p className='text-gray-400 font-bold text-xs md:block hidden'>{index + 1}</p>
                  
                  {/* Patient */}
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img className='w-full h-full object-cover' src={item?.userData?.image} alt="" />
                    </div>
                    <p className='font-bold text-gray-800 text-sm'>{item?.userData?.name}</p>
                  </div>

                  <p className='text-gray-500 font-semibold md:block hidden'>{calculateAge(item?.userData?.dob)}y</p>

                  {/* Schedule */}
                  <div className='flex flex-col gap-1'>
                    <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
                        <FaCalendarAlt className="text-indigo-400" /> {slotDateFormat(item?.slotDate)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium">
                        <FaClock /> {item?.slotTime}
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className='flex items-center gap-3'>
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center overflow-hidden">
                        <img className='w-full h-full object-cover' src={item?.docData?.image} alt="" />
                    </div>
                    <p className='text-gray-700 font-bold text-xs'>{item?.docData?.name}</p>
                  </div>

                  <p className='font-black text-gray-800'>{currency}{item?.amount}</p>

                  {/* Status & Actions */}
                  <div className='flex justify-center w-full'>
                    {item.cancelled ? (
                      <span className="bg-red-50 text-red-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-100">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-100">Completed</span>
                    ) : isExpired(item.slotDate, item.slotTime) ? (
                      <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Expired</span>
                    ) : (
                      <button 
                        onClick={() => handleCancelClick(item)}
                        className='flex items-center gap-2 bg-white text-red-500 border border-red-100 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm'
                      >
                        <FaTrashAlt /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <img className="w-32 opacity-20" src={assets.logo} alt="" />
                <p className="text-gray-400 font-bold mt-4">No matching appointments found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MODERN CANCELLATION MODAL --- */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCancelModal(false)}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative z-10 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                <FaExclamationCircle />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">Cancel Appointment?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
                This will release the slot for <strong>{selectedAppointment?.userData?.name}</strong> with <strong>{selectedAppointment?.docData?.name}</strong>.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmCancel}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                >
                  Yes, Cancel Appointment
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  No, Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllAppointments;