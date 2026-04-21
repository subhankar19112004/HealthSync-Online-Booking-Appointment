import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";



//addPatient function
const addPatient = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing Details: Name, Email, Password, and Gender are required",
      });
    }

    // 2. Email Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // 3. Password Strength Validation
    // This ensures the Admin creates secure accounts
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password too weak! Must be 8+ chars with uppercase, numbers, and symbols.",
      });
    }

    // 4. Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A patient with this email already exists",
      });
    }

    // 5. Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Preparing User Data
    const userData = {
      name,
      email,
      password: hashedPassword,
      gender,
      // Default image for new patients if not uploaded
      image: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
      createdAt: Date.now(),
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // 7. Generate Token (Optional for Admin, but good for immediate login if needed)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "New patient profile created successfully!",
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender
      }
    });

  } catch (error) {
    console.error("Add Patient Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// API to block/unblock a user
// Admin API to block or unblock a user
const blockUser = async (req, res) => {
  try {
    const { userId, blockDuration } = req.body; // blockDuration in days

    // Find the user to block
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let blockUntilDate = null;
    if (blockDuration > 0) {
      // Block the user for a specific number of days
      blockUntilDate = new Date();
      blockUntilDate.setDate(blockUntilDate.getDate() + blockDuration); // Add blockDuration days
    }

    // Update the user's blockUntil field
    await userModel.findByIdAndUpdate(userId, { blockUntil: blockUntilDate });

    res.status(200).json({
      message: blockDuration > 0
        ? `User blocked successfully for ${blockDuration} days`
        : "User unblocked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};
// API for adding doctors
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      degree,
      speciality,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !degree ||
      !speciality ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.status(400).json({
        message: "All fields are required",

        success: false,
      });
    }

    // validating email format
    if (validator.isEmail(email) === false) {
      return res.status(400).json({
        message: "Email is not valid",
        success: false,
      });
    }

    //password validator
    if (validator.isStrongPassword(password) === false) {
      return res.status(400).json({
        message: "Password is not strong enough",
        success: false,
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      degree,
      speciality,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    console.log(
      {
        name,
        email,
        password,
        degree,
        speciality,
        experience,
        about,
        fees,
        address,
      },
      imageFile
    );
    res.status(200).json({
      message: "Doctor Added successfully",
      data: newDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

//API for the admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
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
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Api to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({
      success: true,
      totalDoctors: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// API to get all appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({
      success: true,
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false,
    });
  }
};

//API to cancel the appointment from admin panel
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (slot) => slot !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });
    res.status(200).json({
      message: "Appointment cancelled successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false,
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const appointments = await appointmentModel.find({});
    const users = await userModel.find({});

    // Initialize arrays to hold monthly data
    const appointmentsByMonth = Array(12).fill(0); // Initialize 12 months
    const feesByMonth = Array(12).fill(0); // Initialize fees for each month

    // Helper function to convert DD-MM-YYYY to YYYY-MM-DD
    const convertToDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    };

    // Aggregate appointments and revenue (fees) by month
    appointments.forEach((appointment) => {
      const slotDate = convertToDate(appointment.slotDate); // Convert the date format
      const month = slotDate.getMonth(); // Get month (0-11)
      console.log(
        `Appointment Month: ${month}, Amount: ${appointment.amount}, Slot Date: ${slotDate}`
      ); // Debug: Log each appointment's month and amount
      appointmentsByMonth[month]++;
      feesByMonth[month] += appointment.amount; // Sum up the fees
    });

    console.log("Appointments by Month:", appointmentsByMonth); // Debug: Log the aggregated appointments
    console.log("Fees by Month:", feesByMonth); // Debug: Log the aggregated fees

    // Calculate total revenue from all appointments
    const revenue = appointments.reduce((acc, curr) => acc + curr.amount, 0);

    console.log("Total Revenue:", revenue); // Debug: Log total revenue calculation

    // Users increase over the months
    const usersByMonth = Array(12).fill(0); // Initialize 12 months for user growth
    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();
      usersByMonth[month]++;
    });

    console.log("Users by Month:", usersByMonth); // Debug: Log the aggregated users

    // Prepare the dashboard data
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
      revenue,
      appointmentsByMonth,
      feesByMonth,
      usersByMonth,
    };

    res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};
// API to get all users list with appointments, total cost, and pagination
const allUsersWithAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // pagination parameters

    // Calculate the skip and limit for pagination
    const skip = (page - 1) * limit;
    const users = await userModel.find().skip(skip).limit(limit);

    // Get total count of users for pagination
    const totalUsers = await userModel.countDocuments();

    // Fetch appointments and total cost for each user
    const usersWithAppointments = await Promise.all(
      users.map(async (user) => {
        const appointments = await appointmentModel.find({ userId: user._id });
        const totalCost = appointments.reduce(
          (acc, appointment) => acc + appointment.amount,
          0
        );
        return {
          ...user.toObject(),
          appointments,
          totalCost,
        };
      })
    );

    res.json({
      success: true,
      totalUsers,
      users: usersWithAppointments,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};


// API to update a user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, dob, gender } = req.body;
    const imageFile = req.file;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update text fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    // Handle Image Upload if a new file is provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      user.image = imageUpload.secure_url;
    }

    await user.save();

    res.json({
      success: true,
      message: "User profile updated successfully",
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Delete user
    await userModel.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};

// API to view a user profile
const viewUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Fetch appointments and total cost for user
    const appointments = await appointmentModel.find({ userId: user._id });
    const totalCost = appointments.reduce(
      (acc, appointment) => acc + appointment.amount,
      0
    );

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        appointments,
        totalCost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  allUsersWithAppointments,
  updateUserProfile,
  deleteUser,
  viewUserProfile,
  addPatient,
  blockUser
};
