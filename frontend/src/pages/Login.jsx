import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaStethoscope,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";

const Login = () => {
  const [state, setState] = useState("Sign Up"); // 'Sign Up' or 'Login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");

  const { backendUrl, setToken, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- Navigation Guard ---
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Frontend Validations for Signup
    if (state === "Sign Up") {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }
      if (password.length < 8) {
        return toast.error("Password must be at least 8 characters");
      }
    }

    setLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          gender,
        });
        if (data.success) {
          toast.success("Account Created! Please Login.");
          setState("Login");
          setPassword("");
          setConfirmPassword("");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection Error");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] py-6 px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Animated Healthcare Branding Panel (Inspired by reference) */}
        <div className="relative bg-[#134e4a] p-10 lg:p-14 flex flex-col justify-between overflow-hidden text-white">
          {/* Background Decorative Blobs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <FaStethoscope className="text-emerald-300 text-lg" />
            </div>
            <span className="font-bold tracking-wider text-sm uppercase text-emerald-200">
              QuickCare Health
            </span>
          </div>

          {/* Center Content & Animated SVG Illustration */}
          <div className="relative z-10 my-10 space-y-6">
            <div className="space-y-3">
              <motion.h2
                key={state}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl lg:text-4xl font-black tracking-tight leading-snug"
              >
                {state === "Sign Up"
                  ? "Start your journey to better health today."
                  : "Connect with expert doctors from anywhere."}
              </motion.h2>
              <p className="text-emerald-100/80 text-sm font-medium">
                Book appointments securely, consult top-rated specialists, and
                track your wellness journey seamlessly.
              </p>
            </div>

            {/* Custom Animated Medical SVG Illustration Container */}
            <div className="py-6 flex items-center justify-center">
              <div className="relative w-full max-w-[320px] h-[200px] bg-emerald-900/40 rounded-3xl border border-emerald-500/20 backdrop-blur-xl flex items-center justify-center shadow-inner overflow-hidden p-4">
                {/* Floating Pulse Animation SVG */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 300 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid lines */}
                  <path
                    d="M0 30H300M0 75H300M0 120H300"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />

                  {/* Pulsing EKG Line */}
                  <motion.path
                    d="M10 75H70L90 40L110 110L135 60L150 90L170 75H290"
                    stroke="#34d399"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Floating Medical Cross Icon Badge */}
                  <motion.g
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <circle
                      cx="230"
                      cy="45"
                      r="20"
                      fill="#047857"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M230 35V55M220 45H240"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </motion.g>

                  {/* Floating Heart Icon Badge */}
                  <motion.g
                    animate={{ y: [4, -4, 4] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <circle
                      cx="70"
                      cy="115"
                      r="16"
                      fill="#047857"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M70 122C70 122 62 114 62 109C62 106.5 64 104.5 66.5 104.5C68 104.5 69.3 105.5 70 106.8C70.7 105.5 72 104.5 73.5 104.5C76 104.5 78 106.5 78 109C78 114 70 122 70 122Z"
                      fill="#f43f5e"
                    />
                  </motion.g>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Pagination Dots / Feature Indicators */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-emerald-200/70">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="w-2 h-1.5 bg-white/30 rounded-full"></span>
              <span className="w-2 h-1.5 bg-white/30 rounded-full"></span>
            </div>
            <span className="flex items-center gap-1 font-semibold">
              <FaShieldAlt /> Verified Doctors
            </span>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              {state === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1">
              {state === "Sign Up"
                ? "Please fill in your details to get started."
                : "Please enter your credentials to access your portal."}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <AnimatePresence mode="wait">
              {state === "Sign Up" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <CustomInput
                    label="Full Name"
                    icon={<FaUser />}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. / Patient Name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <CustomInput
              label="Email Address"
              icon={<FaEnvelope />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <div className="relative">
              <CustomInput
                label="Password"
                icon={<FaLock />}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 bottom-3.5 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <AnimatePresence>
              {state === "Sign Up" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <CustomInput
                      label="Confirm Password"
                      icon={<FaCheckCircle />}
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                    />
                    {confirmPassword && password === confirmPassword && (
                      <FaCheckCircle
                        className="absolute right-5 bottom-3.5 text-emerald-500"
                        size={18}
                      />
                    )}
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">
                      Gender
                    </label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${gender === g ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {state === "Sign Up" ? "Create Account" : "Sign In"}
                  <FaArrowRight className="text-xs opacity-70" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setState(state === "Sign Up" ? "Login" : "Sign Up");
                setShowPassword(false);
              }}
              className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors duration-300"
            >
              {state === "Sign Up"
                ? "Already have an account? Sign In"
                : "Don't have an account? Create an Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component for Inputs ---
const CustomInput = ({ label, icon, type, value, onChange, placeholder }) => (
  <div className="group flex flex-col">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-300">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-300"
      />
    </div>
  </div>
);

export default Login;
