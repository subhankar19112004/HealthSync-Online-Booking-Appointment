import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { useReactToPrint } from 'react-to-print';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, ArcElement, Filler 
} from 'chart.js';
import { 
  FaUserMd, FaCalendarCheck, FaUsers, FaWallet, FaDownload, 
  FaSync, FaCalendarAlt, FaHistory, FaClock, FaFileInvoice
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isAnalog, setIsAnalog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortType, setSortType] = useState('latest');
  
  const aToken = localStorage.getItem('aToken');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- NEW PDF PRINT LOGIC (V3 FIX) ---
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "HealthSync_Executive_Report",
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { headers: { aToken } });
        if (data.success) setDashboardData(data.dashData);
      } catch (e) { toast.error('Server Sync Failed'); }
    };
    if (aToken) fetchData();
  }, [aToken]);

  // --- QUICK DATE FILTERS ---
  const setQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    toast.info(`Filtered for last ${days === 0 ? '24 Hours' : days + ' Days'}`);
  };

  if (!dashboardData) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F0F5FF]">
      <ClipLoader color="#4F46E5" size={40} />
    </div>
  );

  const filteredAppointments = dashboardData.latestAppointments.filter(item => {
    if (!startDate || !endDate) return true;
    const itemDate = new Date(item.slotDate.split('-').reverse().join('-'));
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  }).sort((a, b) => {
    if (sortType === 'high-value') return b.amount - a.amount;
    return new Date(b.slotDate.split('-').reverse().join('-')) - new Date(a.slotDate.split('-').reverse().join('-'));
  });

  return (
    <div className="h-screen w-full bg-[#F0F5FF] flex flex-col overflow-hidden font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <header className="px-10 py-6 flex justify-between items-center bg-white border-b border-indigo-100 shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Health<span className="text-indigo-600">Sync</span></h1>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <button onClick={() => setIsAnalog(!isAnalog)} className="bg-white p-2 rounded-xl shadow-sm text-indigo-600 active:scale-90 transition-all">
                    <FaSync size={12} />
                </button>
                {isAnalog ? <AnalogClock date={time} /> : (
                    <div className="leading-none px-2">
                        <p className="text-xl font-black text-slate-800 tabular-nums">{time.toLocaleTimeString()}</p>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Real-time Node</p>
                    </div>
                )}
            </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar scroll-smooth" ref={contentRef}>
        
        {/* FILTERS AREA */}
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 px-4 border-r">
                    <FaCalendarAlt className="text-indigo-300" />
                    <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="text-xs font-bold bg-transparent outline-none cursor-pointer" />
                </div>
                <div className="flex items-center gap-2 px-4">
                    <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="text-xs font-bold bg-transparent outline-none cursor-pointer" />
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setSortType('latest')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${sortType === 'latest' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>Newest</button>
                <button onClick={() => setSortType('high-value')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${sortType === 'high-value' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>High Value</button>
            </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <StatCard icon={<FaUserMd />} label="Specialists" value={dashboardData.doctors} />
          <StatCard icon={<FaCalendarCheck />} label="Appointments" value={dashboardData.appointments} />
          <StatCard icon={<FaUsers />} label="Registered" value={dashboardData.users} />
          <StatCard icon={<FaWallet />} label="Net Revenue" value={`₹${dashboardData.revenue.toLocaleString()}`} isBold />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-indigo-50">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Revenue Flow</h3>
             <div className="h-[350px]">
                <Line data={getLineData(dashboardData.feesByMonth)} options={lineOptions} />
             </div>
          </div>
          <div className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-10">Efficiency</h3>
            <div className="h-60 w-60 relative">
                <Doughnut data={doughnutData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <p className="text-4xl font-black">98%</p>
                    <p className="text-[10px] font-bold opacity-60 uppercase">Optimal</p>
                </div>
            </div>
          </div>
        </div>

        {/* LEDGER */}
        <section className="bg-white rounded-[3rem] p-12 border border-indigo-50 shadow-sm mb-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2"><FaHistory /> Transaction Ledger</h3>
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {filteredAppointments.map((item, index) => (
                <ActivityRow key={index} item={item} />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* --- BOTTOM STATEMENT CENTER --- */}
        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><FaFileInvoice size={150} /></div>
            <div className="relative z-10">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Financial Statement Center</h3>
                <p className="text-slate-400 text-sm mb-8 max-w-md">Generate high-fidelity PDF reports for audits and financial review. Select a duration below for quick-export.</p>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10">
                        <button onClick={() => setQuickFilter(0)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-slate-900 transition-all">Last 24h</button>
                        <button onClick={() => setQuickFilter(10)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-slate-900 transition-all">10 Days</button>
                        <button onClick={() => setQuickFilter(30)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-slate-900 transition-all">30 Days</button>
                    </div>
                    
                    <button 
                        onClick={handlePrint}
                        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
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

// --- BRIGHT COMPONENTS ---
const StatCard = ({ icon, label, value, isBold }) => (
  <motion.div whileHover={{ y: -10 }} className={`p-10 rounded-[2.5rem] border transition-all ${isBold ? 'bg-slate-800 text-white shadow-2xl' : 'bg-white text-slate-400 border-indigo-50 shadow-sm hover:shadow-xl'}`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isBold ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{icon}</div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
    <h2 className={`text-3xl font-black ${isBold ? 'text-white' : 'text-slate-800'}`}>{value}</h2>
  </motion.div>
);

const ActivityRow = ({ item }) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-xl transition-all">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 rounded-3xl border-4 border-white shadow-lg overflow-hidden shrink-0"><img src={item.userData.image} className="w-full h-full object-cover" alt="" /></div>
      <div>
        <p className="text-lg font-black text-slate-800">{item.userData.name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1"><span className="text-indigo-500">{item.slotDate}</span> <span>•</span> <span>{item.slotTime}</span></p>
      </div>
    </div>
    <div className="text-right">
        <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Fee Collected</p>
        <p className="text-2xl font-black text-slate-900">₹{item.amount}</p>
    </div>
  </motion.div>
);

const AnalogClock = ({ date }) => (
    <div className="w-10 h-10 rounded-full border-2 border-indigo-600 relative">
        <div className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-slate-800 origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${(date.getHours() % 12) * 30 + date.getMinutes() * 0.5}deg)` }} />
        <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-indigo-400 origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${date.getMinutes() * 6}deg)` }} />
        <div className="absolute top-1/2 left-1/2 w-[1px] h-4 bg-rose-500 origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${date.getSeconds() * 6}deg)` }} />
    </div>
);

// --- CHARTS CONFIG ---
const getLineData = (data) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{ data, fill: true, borderColor: '#4F46E5', backgroundColor: 'rgba(79, 70, 229, 0.03)', tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff', borderWidth: 4 }]
});
const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { weight: 'bold' }, color: '#94a3b8' } } } };
const doughnutData = { datasets: [{ data: [98, 2], backgroundColor: ['#fff', 'rgba(255,255,255,0.1)'], borderWidth: 0 }] };

export default Dashboard;