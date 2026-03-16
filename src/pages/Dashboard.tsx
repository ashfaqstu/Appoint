import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, Appointment } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Calendar, Clock, MapPin, User as UserIcon, History, ChevronRight, Activity, Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileToaster, setShowProfileToaster] = useState(false);
  const [showAppointmentToast, setShowAppointmentToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptData = await api.appointments.get();
        setAppointments(aptData);
        if (aptData.filter(a => a.status === 'upcoming').length > 0) {
          setShowAppointmentToast(true);
          // Hide after 6 seconds
          setTimeout(() => {
            setShowAppointmentToast(false);
          }, 6000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Check if new user for profile completion toaster
    if (localStorage.getItem('isNewUser') === 'true') {
      setShowProfileToaster(true);
      localStorage.removeItem('isNewUser');
    }
  }, []);

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const nextAppointment = upcoming.length > 0 ? upcoming[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative min-h-screen pb-32 font-sans text-slate-100 flex flex-col overflow-hidden bg-slate-950"
    >
      {/* 1. The "Aurora" Animated Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <motion.div
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-teal-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['5%', '-5%', '5%'],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px]"
        />
      </motion.div>

      {/* Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-center"
      >
        <button 
          onClick={() => navigate('/profile')} 
          className="p-3 bg-white/10 backdrop-blur-md border border-white/10 shadow-sm rounded-full text-slate-200 hover:bg-white/20 transition-colors"
        >
          <UserIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => navigate('/history')} 
          className="p-3 bg-white/10 backdrop-blur-md border border-white/10 shadow-sm rounded-full text-slate-200 hover:bg-white/20 transition-colors"
        >
          <History className="w-5 h-5" />
        </button>
      </motion.header>

      <main className="relative z-10 flex-1 px-6 flex flex-col justify-center items-center space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
          <h1 className="text-3xl font-semibold text-white text-center">
            {user?.language === 'bn' ? 'শুভ সকাল,' : 'Good morning,'} <br />
            <span className="text-cyan-400">{user?.name}</span>
          </h1>
        </motion.div>

        {/* The Focus Area (Center) - Living Agent Orb */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mt-8"
        >
          <button
            onClick={() => navigate('/agent')}
            className="relative w-48 h-48 rounded-full flex items-center justify-center focus:outline-none group"
          >
            {/* Concentric Ripples */}
            <motion.div
              layoutId="ai-orb-glow-1"
              className="absolute inset-0 rounded-full bg-cyan-400/20"
              animate={{
                scale: [1, 2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              layoutId="ai-orb-glow-2"
              className="absolute inset-0 rounded-full bg-indigo-500/20"
              animate={{
                scale: [1, 1.8],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1,
              }}
            />
            <motion.div
              layoutId="ai-orb-glow-3"
              className="absolute inset-0 rounded-full bg-cyan-300/20"
              animate={{
                scale: [1, 1.6],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 2,
              }}
            />
            
            {/* Inner Core */}
            <motion.div 
              layoutId="ai-orb-core"
              className="relative w-32 h-32 rounded-full shadow-[0_0_60px_rgba(6,182,212,0.5)] bg-[radial-gradient(circle_at_30%_30%,_#06b6d4_0%,_#3b82f6_50%,_#312e81_100%)] flex items-center justify-center border border-white/20 z-10 group-hover:scale-105 transition-transform duration-300"
            >
              <motion.div layoutId="ai-orb-icon">
                <Mic className="w-12 h-12 text-white drop-shadow-md" />
              </motion.div>
            </motion.div>
          </button>
          <p className="mt-12 text-slate-400 font-medium tracking-wide">
            {user?.language === 'bn' ? 'কথা বলতে ট্যাপ করুন' : 'Tap to speak'}
          </p>
        </motion.div>
      </main>

      {/* Disappearing Appointment Toast */}
      <AnimatePresence>
        {showAppointmentToast && nextAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md pointer-events-auto">
              <div className="p-4 flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-cyan-500/20 p-3 rounded-xl h-fit">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{nextAppointment.doctorName}</h4>
                    <p className="text-cyan-400 text-sm font-medium mb-2">{nextAppointment.specialty}</p>
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {nextAppointment.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {nextAppointment.clinicName}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAppointmentToast(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Progress Bar */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Completion Toaster */}
      <AnimatePresence>
        {showProfileToaster && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-4 right-4 z-50 flex justify-center"
          >
            <div className="bg-slate-800 rounded-2xl shadow-xl shadow-black/50 border border-slate-700 p-4 flex items-center justify-between w-full max-w-md">
              <div>
                <h4 className="font-bold text-white">Complete your profile</h4>
                <p className="text-sm text-slate-400">Add medical history for better AI assistance.</p>
              </div>
              <button 
                onClick={() => {
                  setShowProfileToaster(false);
                  navigate('/profile');
                }}
                className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1 hover:bg-cyan-500/30 transition-colors"
              >
                Go <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
