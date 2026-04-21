import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

// Api to register user
const registerUser = async (req, res) => {
  try {
    // 1. Added 'gender' to the destructured body
    const { name, email, password, gender } = req.body;

    // 2. Updated validation to make gender mandatory
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        message: "All fields (Name, Email, Password, and Gender) are required",
        success: false
      })
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false
      })
    }

    // Password strength validation
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be stronger (Min 8 chars, including uppercase, numbers, and symbols)",
        success: false
      })
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Constructing user data with gender included
    const userData = {
      name,
      email,
      password: hashedPassword,
      gender: String(gender), // Ensuring it is stored as a clean string
      address: { line1: "", line2: "" }, // Default empty address to avoid frontend crashes
      dob: "Not Selected" // Default DOB
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      success: true
    })

  } catch (error) {
    console.log(error);
    // Check for duplicate email error
    if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists", success: false });
    }
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
      success: false
    })
  }
}

//Api for login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "cannot login without email or password, be sure you have passed them both",
        success: false
      })
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false
      })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "User logged in successfully",
      loggedInUserName: user.name,
      loggedInUserEmail: user.email,
      token: token,
      success: true
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    })
  }
}

//Api to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ take from middleware

    const userData = await userModel.findById(userId).select("-password");

    res.status(200).json({
      message: "User profile fetched successfully",
      userData,
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
}

//API for updating the user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Defensive address parsing
    let parsedAddress = address;
    try {
      if (typeof address === "string") {
        parsedAddress = JSON.parse(address);
      }
    } catch (err) {
      return res.status(400).json({
        message: "Invalid address format",
        success: false,
      });
    }

    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    // Image upload (optional)
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData, { runValidators: true });

    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      updatedUser: await userModel.findById(userId).select("-password"),
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

//API for booking appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.status(404).json({
        message: "No appointments available for this doctor",
        success: false
      });
    }

    let slots_booked = docData.slots_booked;
    // checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({
          message: "Slot already booked for this time",
          success: false
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    // Check if the user is blocked
    if (userData.blockUntil && new Date(userData.blockUntil) > new Date()) {
      return res.status(400).json({
        message: "Your account is blocked. You cannot book appointments at this time.",
        success: false
      });
    }
    delete docData.slots_booked;

    

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);

    await newAppointment.save();
    // save new slots data in docdata
    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked
    });

    res.status(200).json({
      message: "Appointment booked successfully",
      success: true,
      newAppointment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
};

//API to get user appointments in frontend

const listAppointment = async (req, res) => {
  try {
    console.log("Decoded User ID:", req.userId);  // Log the userId from the token

    const appointments = await appointmentModel.find({ userId: req.userId }).populate('docId', 'name speciality image address');

    console.log("Appointments:", appointments);  // Check the fetched appointments

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
};

//API to cancel user appointments
const cancelAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    // verify appointment belongs to user
    if (appointmentData.userId !== userId) {
      return res.status(400).json({
        message: "You can only cancel your own appointments",
        success: false
      });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked
    })
    res.status(200).json({
      message: "Appointment cancelled successfully",
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        message: "Appointment not found",
        success: false
      });
    }

    //creating otions for payment
    const options = {
      amount: appointmentData.amount * 120 + 999,
      currency: "INR",
      receipt: appointmentId
    };
    const order = await razorpayInstance.orders.create(options);
    res.json({
      success: true,
      order
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
}

//API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo)
    if( orderInfo.status === "paid" ) {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true
      });
      res.json({
        success: true,
        message: "Payment verified successfully"
      })
    } else{
      return res.status(400).json({
        message: "Payment not completed",
        success: false
      });
    }
    res.json({
      success: true,
      orderInfo
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false
    });
  }
}




export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointments, paymentRazorpay, verifyRazorpay };