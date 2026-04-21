import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {

  const { docId } = useParams();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, userData, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Fetching doctor info
  const fetchDocInfo = async () => {
    const docInfo = await doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  // Get available slots logic
  // const getAvailableSlots = async () => {
  //   setDocSlots([]);

  //   // Getting current date
  //   let today = new Date();

  //   for (let i = 0; i < 7; i++) {
  //     let currentdate = new Date(today);
  //     currentdate.setDate(today.getDate() + i);

  //     // Setting end time for the day
  //     let endTime = new Date();
  //     endTime.setDate(today.getDate() + i);
  //     endTime.setHours(21, 0, 0, 0);

  //     // Setting hours
  //     if (today.getDate() === currentdate.getDate()) {
  //       currentdate.setHours(currentdate.getHours() > 10 ? currentdate.getHours() + 1 : 10);
  //       currentdate.setMinutes(currentdate.getMinutes() > 30 ? 30 : 0);
  //     } else {
  //       currentdate.setHours(10);
  //       currentdate.setMinutes(0);
  //     }

  //     let timeSlots = [];

  //     while (currentdate < endTime) {
  //       let formattedTime = currentdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  //       let day = currentdate.getDate();
  //       let month = currentdate.getMonth() + 1;
  //       let year = currentdate.getFullYear();

  //       // Formatting the slotDate to match the format in the DB (DD-MM-YYYY)
  //       const slotDate = `${day}-${month}-${year}`;

  //       // Check if the slot is available
  //       const isSlotAvailable = !docInfo?.slots_booked[slotDate]?.includes(formattedTime);

  //       // Debugging
  //       console.log(`Checking availability for ${slotDate} at ${formattedTime}: ${isSlotAvailable ? 'Available' : 'Booked'}`);

  //       if (isSlotAvailable) {
  //         timeSlots.push({
  //           dateTime: new Date(currentdate),
  //           time: formattedTime
  //         });
  //       }

  //       // Increment current time by 30 minutes
  //       currentdate.setMinutes(currentdate.getMinutes() + 30);
  //     }

  //     setDocSlots(prev => [...prev, timeSlots]);
  //   }
  // };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // Getting current date and time
    let today = new Date();
    const currentTime = today.getTime();  // Get current time in milliseconds

    for (let i = 0; i < 7; i++) {
      let currentdate = new Date(today);
      currentdate.setDate(today.getDate() + i);

      // Setting end time for the day
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours
      if (today.getDate() === currentdate.getDate()) {
        currentdate.setHours(currentdate.getHours() > 10 ? currentdate.getHours() + 1 : 10);
        currentdate.setMinutes(currentdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentdate.setHours(10);
        currentdate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentdate < endTime) {
        let formattedTime = currentdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentdate.getDate();
        let month = currentdate.getMonth() + 1;
        let year = currentdate.getFullYear();

        // Formatting the slotDate to match the format in the DB (DD-MM-YYYY)
        const slotDate = `${day}-${month}-${year}`;

        // Check if the slot is available and if the current slot time is greater than current time
        const isSlotAvailable = !docInfo?.slots_booked[slotDate]?.includes(formattedTime) && currentdate.getTime() > currentTime;

        // Debugging
        console.log(`Checking availability for ${slotDate} at ${formattedTime}: ${isSlotAvailable ? 'Available' : 'Booked'}`);

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentdate),
            time: formattedTime
          });
        }

        // Increment current time by 30 minutes
        currentdate.setMinutes(currentdate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
};


  // Book appointment
  const bookAppointment = async () => {
    try {
      if (!token) {
        toast.error('Please login to book an appointment');
        return navigate('/login');
      }

      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}-${month}-${year}`;

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {
        userId: userData._id,
        docId,
        slotDate,
        slotTime
      }, {
        headers: {
          token
        }
      });

      if (data.success) {
        toast.success(data.message || 'Appointment Booked Successfully');
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Try again later');
    }
  };

  // Use Effect hooks to fetch doctor data and available slots
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);  // Debugging the slots being generated
  }, [docSlots]);

  return docInfo && (
    <div>
      {/* ~~~~~~~~~~~~~~ Doctors-Details ------------ */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-violet-500 w-full sm:max-w-72 rounded-lg ' src={docInfo?.image} alt={docInfo?.name} />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7  bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ~~~~~~~~~~~~~~ Doc Info : name, degree, experience ------------ */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo?.name}
            <img className='w-5' src={assets?.verified_icon} />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo?.degree} - {docInfo?.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full hover:bg-gray-400 transition-colors duration-200'>{docInfo?.experience}</button>
          </div>

          {/* ----- Doctor About */}
          <div>
            <p className='flex items-center gap-1 text-sm mt-3 font-medium text-gray-900'>
              About
              <img src={assets?.info_icon} />
            </p>

            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo?.about}</p>
          </div>
          <p className='font-medium text-gray-500 mt-2'>Appointment fee: <span className='text-gray-900 font-light text-sm'>{currencySymbol}{docInfo?.fees}</span> </p>
        </div>
      </div>

      {/* ---------Booking-Slots---------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-violet-500 text-white' : 'border hover:bg-violet-300 transition-colors duration-150 border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-[80%] overflow-x-scroll mt-4'>
          {
            docSlots?.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${(item.time === slotTime ? 'bg-violet-500 text-white ' : 'text-gray-400 border hover:bg-violet-100 transition-colors duration-150 border-gray-400')}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} className='bg-violet-500 text-white px-12 py-3 rounded-full mt-10 shadow-xl/50 shadow-violet-500 hover:shadow-none  transition-all duration-300 '>Book an appointment</button>
      </div>

      {/* Related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo?.speciality} />
    </div>
  );
};

export default Appointment;