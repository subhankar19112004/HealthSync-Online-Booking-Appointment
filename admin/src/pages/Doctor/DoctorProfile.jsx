import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/doctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets_admin/assets';

const DoctorProfile = () => {
    const { dToken, backendUrl } = useContext(DoctorContext);
    const [profileData, setProfileData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dtoken: dToken } });
            if (data.success) {
                setProfileData(data.profileData);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available
            };

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dtoken: dToken } });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    return profileData && (
        <div className='m-5'>
            <div className='flex flex-col gap-4'>
                
                {/* Profile Image & Basic Info */}
                <div className='flex flex-col sm:flex-row gap-8 bg-white p-8 rounded-xl shadow-sm border border-indigo-100'>
                    <div>
                        <img className='bg-indigo-400 w-full sm:max-w-64 rounded-xl shadow-md' src={profileData.image} alt="" />
                    </div>

                    <div className='flex-1'>
                        <h2 className='text-3xl font-bold text-gray-800'>{profileData.name}</h2>
                        <div className='flex items-center gap-2 mt-2 text-gray-600 text-lg'>
                            <p>{profileData.degree} - {profileData.speciality}</p>
                            <span className='py-0.5 px-3 border border-indigo-200 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600'>
                                {profileData.experience} Experience
                            </span>
                        </div>

                        <div className='mt-6'>
                            <p className='font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-2'>About</p>
                            <p className='text-gray-600 leading-relaxed'>{profileData.about}</p>
                        </div>
                    </div>
                </div>

                {/* Editable Section */}
                <div className='bg-white p-8 rounded-xl shadow-sm border border-indigo-100 flex flex-col gap-6'>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Fees Section */}
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold text-gray-700'>Consultation Fees</p>
                            <div className='flex items-center gap-2 text-gray-600'>
                                <span className='text-xl font-bold text-indigo-600'>₹</span>
                                {isEdit ? (
                                    <input 
                                        className='bg-gray-50 border border-gray-300 rounded px-2 py-1 outline-indigo-400 focus:bg-white transition-all'
                                        type='number' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                        value={profileData.fees} 
                                    />
                                ) : (
                                    <span className='text-lg'>{profileData.fees}</span>
                                )}
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold text-gray-700'>Clinic Address</p>
                            <div className='text-gray-600 flex flex-col gap-1'>
                                {isEdit ? (
                                    <>
                                        <input className='bg-gray-50 border border-gray-300 rounded px-2 py-1 mb-1 focus:bg-white' type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                        <input className='bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:bg-white' type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                    </>
                                ) : (
                                    <p>{profileData.address.line1}<br />{profileData.address.line2}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Availability Toggle */}
                    <div className='flex items-center gap-2 py-2 bg-indigo-50 p-4 rounded-lg self-start'>
                        <input 
                            className='w-4 h-4 cursor-pointer accent-indigo-600'
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                            checked={profileData.available} 
                            type="checkbox" 
                            id="available"
                        />
                        <label className='cursor-pointer text-gray-700 font-medium' htmlFor="available">Available for Appointments</label>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-4'>
                        {isEdit ? (
                            <button 
                                onClick={updateProfile} 
                                className='px-10 py-2.5 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95'
                            >
                                Save Changes
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className='px-10 py-2.5 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-95'
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;