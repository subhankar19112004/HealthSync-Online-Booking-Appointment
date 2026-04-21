import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Login from './pages/Login'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmoothScroll from './components/SmoothScroll' // Import the one we made

const App = () => {
  const location = useLocation();

  return (
    <SmoothScroll>
      <div className='mx-5 sm:mx-[5%]'>
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={true} />
        <Navbar /> 
        
        {/* AnimatePresence allows for exit animations when switching routes */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home/>}/>
            <Route path='/doctors' element={<Doctors/>}/>
            <Route path='/doctors/:speciality' element={<Doctors/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/help' element={<Contact/>}/>
            <Route path='/my-profile' element={<MyProfile/>}/>
            <Route path='/my-appointments' element={<MyAppointments/>}/>
            <Route path='/appointment/:docId' element={<Appointment/>}/>
          </Routes>
        </AnimatePresence>

        <Footer />
      </div>
    </SmoothScroll>
  )
}

export default App;