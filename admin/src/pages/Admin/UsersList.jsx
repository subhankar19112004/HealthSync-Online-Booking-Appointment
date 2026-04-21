
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt, FaArrowLeft, FaArrowRight, FaTimes, FaCamera, FaUser, FaPhone, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const aToken = localStorage.getItem('aToken');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUsers = async (page = 1) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-users?page=${page}`, {
        headers: { aToken }
      });
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const deleteUser = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-user/${deleteUserId}`, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success('User deleted');
        setDeleteUserId(null);
        fetchUsers(currentPage);
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editUser.name);
      formData.append('phone', editUser.phone || '');
      formData.append('dob', editUser.dob || '');
      formData.append('gender', editUser.gender || 'Male');
      
      if (editUser.newProfilePic) {
        formData.append('image', editUser.newProfilePic);
      }

      const { data } = await axios.put(`${backendUrl}/api/admin/update-user/${editUser._id}`, formData, {
        headers: { aToken, 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success('Profile Updated!');
        setEditUser(null);
        fetchUsers(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(currentPage); }, [currentPage]);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto h-screen overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className='text-3xl font-black text-gray-800 tracking-tight'>User Directory</h1>
          <p className='text-gray-500 text-sm font-medium'>View and manage registered patients</p>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className='bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex-1 flex flex-col'>
        <div className='hidden md:grid grid-cols-[3fr_3fr_2fr_1.5fr] bg-gray-50/50 py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b'>
          <p>Patient</p><p>Email</p><p>Total Revenue</p><p className="text-right">Actions</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {users.map((user) => (
            <div key={user._id} className='flex flex-col md:grid md:grid-cols-[3fr_3fr_2fr_1.5fr] items-center py-4 px-8 border-b last:border-0 hover:bg-indigo-50/30 transition-all'>
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 overflow-hidden">
                  <img src={user.image || user.profilePic} className="w-full h-full object-cover" alt="" />
                </div>
                <p className="font-bold text-gray-800">{user.name}</p>
              </div>
              <p className="text-gray-500 font-medium text-sm w-full">{user.email}</p>
              <p className="font-black text-indigo-600 w-full">₹{user.totalCost || 0}</p>
              <div className="flex justify-end gap-2 w-full">
                <ActionButton icon={<FaEye />} color="text-blue-500" onClick={() => setViewUser(user)} />
                <ActionButton icon={<FaEdit />} color="text-yellow-500" onClick={() => { setEditUser(user); setPreviewImage(user.image || user.profilePic); }} />
                <ActionButton icon={<FaTrashAlt />} color="text-red-500" onClick={() => setDeleteUserId(user._id)} />
              </div>
            </div>
          ))}
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-6 bg-gray-50/50 border-t flex justify-center items-center gap-4">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 bg-white rounded-xl shadow-sm disabled:opacity-30"><FaArrowLeft /></button>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 bg-white rounded-xl shadow-sm disabled:opacity-30"><FaArrowRight /></button>
        </div>
      </div>

      <AnimatePresence>
        {/* --- VIEW MODAL --- */}
        {viewUser && (
          <Modal close={() => setViewUser(null)} title="Patient File">
             <div className="flex flex-col items-center mb-8">
                <img src={viewUser.image || viewUser.profilePic} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white mb-4" alt="" />
                <h2 className="text-2xl font-black text-gray-800">{viewUser.name}</h2>
                <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{viewUser.gender || 'Not Specified'}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Email" value={viewUser.email} />
                <InfoItem label="Phone" value={viewUser.phone || 'N/A'} />
                <InfoItem label="Birthday" value={viewUser.dob || 'N/A'} />
                <InfoItem label="Total Spent" value={`₹${viewUser.totalCost || 0}`} />
             </div>
          </Modal>
        )}

        {/* --- EDIT MODAL --- */}
        {editUser && (
          <Modal close={() => setEditUser(null)} title="Update Profile">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="edit-img" className="relative cursor-pointer group">
                  <img src={previewImage} className="w-28 h-28 rounded-3xl object-cover border-4 border-indigo-50 group-hover:border-indigo-200 transition-all" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity text-white"><FaCamera /></div>
                </label>
                <input type="file" id="edit-img" hidden onChange={(e) => {
                   const file = e.target.files[0];
                   setPreviewImage(URL.createObjectURL(file));
                   setEditUser({...editUser, newProfilePic: file});
                }} />
              </div>
              <EditInput icon={<FaUser />} label="Name" value={editUser.name} onChange={(val)=>setEditUser({...editUser, name: val})} />
              <EditInput icon={<FaPhone />} label="Phone" value={editUser.phone} onChange={(val)=>setEditUser({...editUser, phone: val})} />
              <div className="flex gap-4">
                <EditInput icon={<FaBirthdayCake />} label="DOB" type="date" value={editUser.dob} onChange={(val)=>setEditUser({...editUser, dob: val})} />
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Gender</label>
                    <select value={editUser.gender} onChange={(e)=>setEditUser({...editUser, gender: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-semibold text-gray-700">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center">
                {loading ? <ClipLoader color="#fff" size={20} /> : "Save Changes"}
              </button>
            </form>
          </Modal>
        )}

        {/* --- DELETE CONFIRMATION --- */}
        {deleteUserId && (
          <Modal close={() => setDeleteUserId(null)} title="Danger Zone">
            <div className="text-center py-4">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Are you sure you want to permanently delete this user?</h3>
                <div className="flex gap-4">
                    <button onClick={deleteUser} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-100">Delete User</button>
                    <button onClick={() => setDeleteUserId(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200">Cancel</button>
                </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const ActionButton = ({ icon, color, onClick }) => (
    <button onClick={onClick} className={`p-2 rounded-xl bg-white border border-gray-100 shadow-sm ${color} hover:scale-110 transition-all`}>{icon}</button>
);

const Modal = ({ children, close, title }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} exit={{y:50, opacity:0}} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">{title}</h2>
                <button onClick={close} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><FaTimes /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
        </motion.div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-700">{value}</p>
    </div>
);

const EditInput = ({ label, icon, value, onChange, type="text" }) => (
    <div className="flex flex-col group">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">{icon}</span>
            <input type={type} value={value || ''} onChange={(e)=>onChange(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl focus:bg-white border-2 border-transparent focus:border-indigo-50 outline-none text-sm font-semibold text-gray-700" />
        </div>
    </div>
);

export default UsersList;