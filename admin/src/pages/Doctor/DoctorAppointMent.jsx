import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/doctorContext';

const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);
  const [isLoading, setIsLoading] = useState(false); // Start as false

  useEffect(() => {
    if (dToken) {
      setIsLoading(true);
      getAppointments().finally(() => setIsLoading(false)); 
    }
    // Remove getAppointments from here to stop the infinite loop!
  }, [dToken]); 

  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <h1 className="text-2xl font-bold mb-5 text-gray-800">Your Appointments</h1>
      
      <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] py-4 px-6 bg-gray-50 border-b font-semibold text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* List */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div key={index} className='flex flex-wrap sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] items-center text-gray-500 py-4 px-6 border-b hover:bg-gray-50 transition-all'>
              <p className='max-sm:hidden'>{index + 1}</p>
              <p className='text-neutral-800 font-medium'>{item.userData?.name || "Patient"}</p>
              <p className='text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full inline-block w-fit'>
                {item.payment ? 'Online' : 'Cash'}
              </p>
              <p>{item.userData?.dob ? (new Date().getFullYear() - item.userData.dob.split('-')[0]) : '22'}</p>
              <p className='text-sm'>{item.slotDate}, {item.slotTime}</p>
              <p className='font-medium text-gray-700'>${item.amount}</p>
              <div className='flex gap-2'>
                <button className='p-1 hover:bg-red-50 rounded text-red-500 transition-colors'>Cancel</button>
              </div>
            </div>
          ))
        ) : (
          <div className='p-20 text-center text-gray-400'>No appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;