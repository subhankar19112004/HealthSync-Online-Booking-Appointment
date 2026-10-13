// import doctorModel from "../models/doctorModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import appointmentModel from "../models/appointmentModel.js";

// //API for controlling doctors
// const changeAvailability = async (req, res) => {
//     try {
        
//         const {docId} = req.body;
//         const docData = await doctorModel.findById(docId);
//         await doctorModel.findByIdAndUpdate(docId, {
//             available: !docData.available
//         });
//         res.json({
//             success: true,
//             message: "Availability changed successfully"  
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Something went wrong",
//             success: false
//         })
//     }
// }

// const doctorList = async (req, res) => {
//     const doctors = await doctorModel.find({}).select(["-password",, "-email"]);
//     res.json({
//         success: true,
//         doctors
//     });
// }

// // API for doctor login
// const loginDoctor = async ( req, res ) => {
//     try {
//         const { email, password } = req.body;
//         const doctor = await doctorModel.findOne({ email });
//         if (doctor) {
//             const isMatch = await bcrypt.compare(password, doctor.password);
//             if (!isMatch) {
//                 return res.status(400).json({
//                     message: "check the credentials😖",
//                     success: false,
//                 });
//             }
//             const token = jwt.sign({ userId: doctor._id }, process.env.JWT_SECRET);
//             res.json({
//                 success: true,
//                 token,
//             });
//         } else {
//             res.status(400).json({
//                 message: "Invalid credentials",
//                 success: false,
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Something went wrong",
//             success: false
//         })
//     }
// }

// // API to get doctor profile for doctor panel
// const doctorProfile = async (req, res) => {
//     try {
//         const { docId } = req.body; // or req.docId if your middleware attaches it there
//         const profileData = await doctorModel.findById(docId).select("-password");

//         res.json({
//             success: true,
//             profileData
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };



// //API to get doctor appointments for doctor panel
// const getDoctorAppointments = async (req, res) => {
//     try {
//         console.log("Decoded User ID:", req.docId);  // Log the userId from the token

//     const appointments = await appointmentModel.findOne({ docId: req.docId });

//         res.json({
//             success: true,  
//             appointments,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Something went wrong while fetching appointments",
//             success: false,
//         });
//     }
// };

// // Example for updateDoctorProfile in doctorController.js
// const updateDoctorProfile = async (req, res) => {
//     try {
//         const { docId, fees, address, available } = req.body;

//         await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

//         res.json({ success: true, message: 'Profile Updated' });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// export {changeAvailability, doctorList, loginDoctor, getDoctorAppointments, doctorProfile, updateDoctorProfile};

import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (doctor) {
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "check the credentials😖",
                    success: false,
                });
            }
            // Ensure the payload key matches what your middleware expects (userId)
            const token = jwt.sign({ userId: doctor._id }, process.env.JWT_SECRET);
            res.json({
                success: true,
                token,
            });
        } else {
            res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
}

// API to get doctor appointments for doctor panel
const getDoctorAppointments = async (req, res) => {
    try {
        const docId = req.docId; // Extracted from authDoctor middleware
        const appointments = await appointmentModel.find({ docId });

        res.json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong while fetching appointments",
            success: false,
        });
    }
};

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId; // Extracted from authDoctor middleware
        const profileData = await doctorModel.findById(docId).select("-password");

        res.json({
            success: true,
            profileData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId; // Extracted from authDoctor middleware
        const { fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

        res.json({
            success: true,
            message: "Profile Updated Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to change doctor availability (Used by Admin and Doctor)
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available,
        });
        res.json({
            success: true,
            message: "Availability changed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};

// API to get all doctors list for frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(["-password", "-email"]);
        res.json({
            success: true,
            doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", success: false });
    }
};

export {
    loginDoctor,
    getDoctorAppointments,
    doctorProfile,
    updateDoctorProfile,
    changeAvailability,
    doctorList,
};