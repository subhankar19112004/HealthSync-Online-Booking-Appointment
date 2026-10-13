import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorDashboard = () => {
    const { dToken, appointments, getAppointments } = useContext(DoctorContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    // Calculate Stats
    const totalEarnings = appointments.reduce((total, item) => total + (item.amount || 0), 0)
    const uniquePatients = new Set(appointments.map(item => item.userId)).size

    return appointments && (
        <div className='m-5'>
            {/* Top Stats Cards */}
            <div className='flex flex-wrap gap-5'>
                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl border border-indigo-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
                    <img className='w-14 bg-indigo-50 p-2 rounded-lg' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>$ {totalEarnings}</p>
                        <p className='text-gray-500'>Total Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl border border-indigo-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
                    <img className='w-14 bg-indigo-50 p-2 rounded-lg' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{appointments.length}</p>
                        <p className='text-gray-500'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 bg-white p-6 min-w-64 rounded-xl border border-indigo-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
                    <img className='w-14 bg-indigo-50 p-2 rounded-lg' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{uniquePatients}</p>
                        <p className='text-gray-500'>Unique Patients</p>
                    </div>
                </div>
            </div>

            {/* Latest Appointments List */}
            <div className='bg-white mt-10 rounded-xl border border-indigo-100 shadow-sm'>
                <div className='flex items-center gap-2.5 px-6 py-5 border-b'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-bold text-gray-800 text-lg'>Latest Appointments</p>
                </div>

                <div className='pt-4'>
                    {appointments.slice(0, 5).map((item, index) => (
                        <div key={index} className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-all border-b last:border-none'>
                            <img className='rounded-full w-12 border-2 border-indigo-100' src={item.userData?.image} alt="" />
                            <div className='flex-1'>
                                <p className='text-gray-800 font-semibold'>{item.userData?.name || "Patient"}</p>
                                <p className='text-gray-500 text-sm'>{item.slotDate} | {item.slotTime}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                {item.cancelled 
                                    ? <p className='text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded-full'>Cancelled</p>
                                    : <img className='w-8 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                                }
                            </div>
                        </div>
                    ))}
                    
                    {appointments.length === 0 && (
                        <div className='p-10 text-center text-gray-400'>
                            No recent activity to show.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard;