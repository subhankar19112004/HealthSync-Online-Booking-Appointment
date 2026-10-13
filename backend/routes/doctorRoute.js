// import express from 'express';
// import { doctorList, getDoctorAppointments, loginDoctor } from '../controllers/doctorController.js';
// import authDoctor from '../middlewares/authDoctor.js';


// const doctorRouter = express.Router();

// doctorRouter.get('/list', doctorList);
// doctorRouter.post('/login', loginDoctor);
// doctorRouter.get('/appointments', authDoctor, getDoctorAppointments)


// export default doctorRouter;

import express from 'express';
import { 
    doctorList, 
    getDoctorAppointments, 
    loginDoctor, 
    doctorProfile,      // Add this
    updateDoctorProfile  // Add this
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments);

// --- New Profile Routes ---
// GET profile data
doctorRouter.get('/profile', authDoctor, doctorProfile);

// POST updated profile data
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);

export default doctorRouter;