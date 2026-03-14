import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, Appointment } from '../services/api';
import { Card, CardContent } from '../components/ui/Card';
import { Calendar, Clock, MapPin, Mic, LogOut, Activity, History } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptData = await api.appointments.get();
        setAppointments(aptData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const nextAppointment = upcoming.length > 0 ? upcoming[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="min-h-screen bg-[#F8F9FA] pb-32 font-sans text-slate-800 flex flex-col"
    >
      {/* Header */}
      <motion.header 
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
        className="px-6 pt-12 pb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {user?.language === 'bn' ? 'শুভ সকাল,' : 'Good morning,'} <br />
            <span className="text-emerald-600">{user?.name}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/history')} className="p-3 bg-white shadow-sm rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
            <History className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="p-3 bg-white shadow-sm rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <main className="flex-1 px-6 flex flex-col justify-center items-center space-y-12">
        {/* The Focus Area (Center) - Agent Orb */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mt-8">
          <motion.button
            onClick={() => navigate('/agent')}
            className="relative w-48 h-48 rounded-full flex items-center justify-center focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glowing background layers */}
            <motion.div
              layoutId="ai-orb-glow-1"
              className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              layoutId="ai-orb-glow-2"
              className="absolute inset-4 rounded-full bg-blue-500/30 blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            
            {/* Core Orb */}
            <motion.div 
              layoutId="ai-orb-core"
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center border-4 border-white/20"
            >
              <motion.div layoutId="ai-orb-icon">
                <Mic className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
          </motion.button>
          
          <motion.p 
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="text-center text-slate-500 mt-8 text-lg max-w-[250px] leading-relaxed"
          >
            {user?.language === 'bn' 
              ? 'আপনার লক্ষণগুলি বর্ণনা করতে বা একটি অ্যাপয়েন্টমেন্ট বুক করতে অর্বটিতে আলতো চাপুন।' 
              : 'Tap the orb to describe your symptoms or book an appointment.'}
          </motion.p>
        </div>

        {/* The "Up Next" Card (Bottom) */}
        <motion.div 
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
          className="w-full max-w-md mx-auto mt-auto mb-8"
        >
          {isLoading ? (
            <div className="animate-pulse h-32 bg-white rounded-3xl shadow-sm"></div>
          ) : nextAppointment ? (
            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
              <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100/50 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-semibold text-sm uppercase tracking-wide">
                  {user?.language === 'bn' ? 'আসন্ন অ্যাপয়েন্টমেন্ট' : 'Up Next'}
                </span>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{nextAppointment.doctorName}</h3>
                <p className="text-emerald-600 font-medium mb-4">{nextAppointment.specialty}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-5 h-5 mr-3 text-slate-400" />
                    <span className="font-medium">{nextAppointment.date} at {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                    <span>{nextAppointment.clinicName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Activity className="w-10 h-10 mx-auto mb-4 text-emerald-400" />
                <p className="text-lg font-medium text-slate-700">
                  {user?.language === 'bn' 
                    ? 'আপনার স্বাস্থ্য ট্র্যাকে আছে। আজ আপনি কেমন অনুভব করছেন?' 
                    : 'Your health is on track. How are you feeling today?'}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
