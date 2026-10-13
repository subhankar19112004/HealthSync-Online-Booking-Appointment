import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import {
  FaUserMd,
  FaCalendarCheck,
  FaUsers,
  FaWallet,
  FaDownload,
  FaSync,
  FaCalendarAlt,
  FaHistory,
  FaFileInvoice,
  FaShieldAlt,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isAnalog, setIsAnalog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortType, setSortType] = useState("latest");

  const aToken = localStorage.getItem("aToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- PDF PRINT LOGIC ---
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "QuickCare_Executive_Report",
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
          headers: { aToken },
        });
        if (data.success) setDashboardData(data.dashData);
      } catch (e) {
        toast.error("Server Sync Failed");
      }
    };
    if (aToken) fetchData();
  }, [aToken, backendUrl, aToken]);

  // --- QUICK DATE FILTERS ---
  const setQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    toast.info(`Filtered for last ${days === 0 ? "24 Hours" : days + " Days"}`);
  };

  if (!dashboardData)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <ClipLoader color="#059669" size={40} />
      </div>
    );

  const filteredAppointments = dashboardData.latestAppointments
    .filter((item) => {
      if (!startDate || !endDate) return true;
      const itemDate = new Date(item.slotDate.split("-").reverse().join("-"));
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    })
    .sort((a, b) => {
      if (sortType === "high-value") return b.amount - a.amount;
      return (
        new Date(b.slotDate.split("-").reverse().join("-")) -
        new Date(a.slotDate.split("-").reverse().join("-"))
      );
    });

  return (
    <div className="h-screen w-full bg-gray-50/50 flex flex-col overflow-hidden font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="px-6 md:px-10 py-5 flex justify-between items-center bg-white border-b border-gray-100 shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
            Quick<span className="text-emerald-600">Care</span>{" "}
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 hidden sm:inline-block">
              Admin Portal
            </span>
          </h1>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200/60">
            <button
              onClick={() => setIsAnalog(!isAnalog)}
              className="bg-white p-2 rounded-xl shadow-sm text-emerald-600 active:scale-90 transition-all hover:bg-emerald-50"
            >
              <FaSync size={12} />
            </button>
            {isAnalog ? (
              <AnalogClock date={time} />
            ) : (
              <div className="leading-none px-2">
                <p className="text-base md:text-lg font-black text-gray-800 tabular-nums">
                  {time.toLocaleTimeString()}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                  Real-time Node
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <main
        className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 py-8 custom-scrollbar scroll-smooth"
        ref={contentRef}
      >
        {/* FILTERS AREA */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 px-3 border-r border-gray-100">
              <FaCalendarAlt className="text-emerald-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none cursor-pointer text-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 px-3">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none cursor-pointer text-gray-700"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortType("latest")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${sortType === "latest" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white text-gray-500 border border-gray-200/60 hover:bg-gray-50"}`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortType("high-value")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${sortType === "high-value" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white text-gray-500 border border-gray-200/60 hover:bg-gray-50"}`}
            >
              High Value
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<FaUserMd />}
            label="Specialists"
            value={dashboardData.doctors}
          />
          <StatCard
            icon={<FaCalendarCheck />}
            label="Appointments"
            value={dashboardData.appointments}
          />
          <StatCard
            icon={<FaUsers />}
            label="Registered Users"
            value={dashboardData.users}
          />
          <StatCard
            icon={<FaWallet />}
            label="Net Revenue"
            value={`₹${dashboardData.revenue.toLocaleString()}`}
            isBold
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Revenue Flow (Annual)
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                +14% this month
              </span>
            </div>
            <div className="h-[320px]">
              <Line
                data={getLineData(dashboardData.feesByMonth)}
                options={lineOptions}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-6">
              System Efficiency
            </h3>
            <div className="h-48 w-48 relative flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  cutout: "82%",
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-black">98%</p>
                <p className="text-[10px] font-bold opacity-75 uppercase tracking-wider">
                  Optimal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEDGER SECTION */}
        <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FaHistory className="text-emerald-600" /> Transaction Ledger
            </h3>
            <span className="text-xs font-bold text-gray-500">
              {filteredAppointments.length} Transactions Found
            </span>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((item, index) => (
                  <ActivityRow key={index} item={item} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm font-semibold">
                  No transactions found for the selected date range.
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- FINANCIAL STATEMENT CENTER --- */}
        <section className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FaFileInvoice size={140} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <FaShieldAlt /> Secure Reporting
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Financial Statement Center
            </h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Generate high-fidelity PDF reports for audits and financial
              review. Select a duration below for quick export.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setQuickFilter(0)}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all"
                >
                  Last 24h
                </button>
                <button
                  onClick={() => setQuickFilter(10)}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all"
                >
                  10 Days
                </button>
                <button
                  onClick={() => setQuickFilter(30)}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all"
                >
                  30 Days
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
              >
                <FaDownload /> Download PDF Statement
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatCard = ({ icon, label, value, isBold }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[2rem] border transition-all ${
      isBold
        ? "bg-gradient-to-br from-emerald-900 to-teal-900 text-white shadow-xl border-emerald-700/50"
        : "bg-white text-gray-500 border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-500/20"
    }`}
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-lg ${
        isBold
          ? "bg-white/10 text-emerald-300"
          : "bg-emerald-50 text-emerald-600"
      }`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">
      {label}
    </p>
    <h3
      className={`text-2xl sm:text-3xl font-black tracking-tight ${isBold ? "text-white" : "text-gray-900"}`}
    >
      {value}
    </h3>
  </motion.div>
);

const ActivityRow = ({ item }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gray-50/50 hover:bg-emerald-50/30 border border-gray-100 hover:border-emerald-200/60 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-md overflow-hidden shrink-0 bg-emerald-50">
        <img
          src={item.userData.image}
          className="w-full h-full object-cover"
          alt={item.userData.name}
        />
      </div>
      <div>
        <p className="text-sm sm:text-base font-bold text-gray-900">
          {item.userData.name}
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 flex items-center gap-2">
          <span className="text-emerald-600">{item.slotDate}</span>
          <span>•</span>
          <span>{item.slotTime}</span>
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        Fee Collected
      </p>
      <p className="text-lg sm:text-xl font-black text-gray-900">
        ₹{item.amount}
      </p>
    </div>
  </motion.div>
);

const AnalogClock = ({ date }) => (
  <div className="w-10 h-10 rounded-full border-2 border-emerald-600 relative bg-emerald-50">
    <div
      className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-gray-800 origin-bottom rounded-full"
      style={{
        transform: `translate(-50%, -100%) rotate(${(date.getHours() % 12) * 30 + date.getMinutes() * 0.5}deg)`,
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-emerald-500 origin-bottom rounded-full"
      style={{
        transform: `translate(-50%, -100%) rotate(${date.getMinutes() * 6}deg)`,
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-[1px] h-4 bg-rose-500 origin-bottom rounded-full"
      style={{
        transform: `translate(-50%, -100%) rotate(${date.getSeconds() * 6}deg)`,
      }}
    />
  </div>
);

// --- CHARTS CONFIG ---
const getLineData = (data) => ({
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      data,
      fill: true,
      borderColor: "#059669",
      backgroundColor: "rgba(5, 150, 105, 0.05)",
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#059669",
      pointBorderWidth: 2,
      borderWidth: 3,
    },
  ],
});

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { display: false },
    x: {
      grid: { display: false },
      ticks: { font: { weight: "bold", size: 10 }, color: "#9ca3af" },
    },
  },
};

const doughnutData = {
  datasets: [
    {
      data: [98, 2],
      backgroundColor: ["#ffffff", "rgba(255,255,255,0.15)"],
      borderWidth: 0,
    },
  ],
};

export default Dashboard;
