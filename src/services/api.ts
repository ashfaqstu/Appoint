// Mock API Service for Appoint Frontend

export interface User {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'bn';
  profile?: {
    age?: string;
    gender?: string;
    bloodType?: string;
    emergencyContact?: string;
    allergies?: string;
    chronicConditions?: string;
  };
}

export interface Clinic {
  id: string;
  name: string;
  distance: string;
  rating: number;
  availability: string;
  tradeoffs: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicName: string;
  distance: string;
  rating: number;
  availableSlots: string[];
  tradeoff: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

export interface SymptomLog {
  id: string;
  date: string;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high';
  notes: string;
}

export interface CommunicationThread {
  id: string;
  date: string;
  summary: string;
  outcome: string;
}

const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en',
};

const MOCK_CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'HeartCare Center',
    distance: '2.5 km',
    rating: 4.8,
    availability: 'High',
    tradeoffs: 'Slightly further, but top-rated specialists.'
  },
  {
    id: 'c2',
    name: 'City Health Clinic',
    distance: '1.2 km',
    rating: 4.5,
    availability: 'Medium',
    tradeoffs: 'Closer, but fewer specialists available today.'
  }
];

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    clinicName: 'HeartCare Center',
    distance: '2.5 km',
    rating: 4.8,
    availableSlots: ['10:00 AM', '02:30 PM'],
    tradeoff: 'Top-rated specialist, slightly further away.',
  },
  {
    id: 'd2',
    name: 'Dr. Ahmed Khan',
    specialty: 'General Physician',
    clinicName: 'City Health Clinic',
    distance: '1.2 km',
    rating: 4.5,
    availableSlots: ['09:00 AM', '11:15 AM', '04:00 PM'],
    tradeoff: 'Closer to you, available sooner.',
  },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    clinicName: 'HeartCare Center',
    date: '2026-03-15',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'a2',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Dermatologist',
    clinicName: 'Skin Wellness Clinic',
    date: '2026-02-10',
    time: '03:00 PM',
    status: 'past',
  },
];

const MOCK_SYMPTOM_LOGS: SymptomLog[] = [
  {
    id: 's1',
    date: '2026-03-12',
    symptoms: ['Mild chest pain', 'Shortness of breath'],
    severity: 'medium',
    notes: 'Occurred after light exercise.'
  },
  {
    id: 's2',
    date: '2026-02-05',
    symptoms: ['Skin rash', 'Itching'],
    severity: 'low',
    notes: 'On left arm, lasted 2 days.'
  }
];

const MOCK_THREADS: CommunicationThread[] = [
  {
    id: 't1',
    date: '2026-03-12',
    summary: 'Discussed chest pain symptoms. AI recommended Cardiologist.',
    outcome: 'Booked appointment with Dr. Sarah Jenkins.'
  },
  {
    id: 't2',
    date: '2026-02-05',
    summary: 'Reported skin rash. AI analyzed via camera.',
    outcome: 'Booked appointment with Dr. Emily Chen.'
  }
];

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
      return new Promise((resolve) => setTimeout(() => resolve({ token: 'mock-jwt-token', user: MOCK_USER }), 1000));
    },
    register: async (name: string, email: string, password: string, language: 'en' | 'bn'): Promise<{ token: string; user: User }> => {
      return new Promise((resolve) => setTimeout(() => resolve({ token: 'mock-jwt-token', user: { ...MOCK_USER, name, email, language } }), 1000));
    },
    me: async (): Promise<{ user: User }> => {
      return new Promise((resolve) => setTimeout(() => resolve({ user: MOCK_USER }), 500));
    },
    updateProfile: async (profileData: any): Promise<{ user: User }> => {
      // In a real app, this would send a PATCH request to the backend
      MOCK_USER.profile = { ...MOCK_USER.profile, ...profileData };
      return new Promise((resolve) => setTimeout(() => resolve({ user: MOCK_USER }), 500));
    },
  },
  agent: {
    chat: async (message: string, language: 'en' | 'bn'): Promise<{ reply: string; isEmergency: boolean; recommendedDoctors?: Doctor[] }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isEmergency = message.toLowerCase().includes('chest pain') || message.toLowerCase().includes('stroke');
          if (isEmergency) {
            resolve({
              reply: language === 'en' ? 'Warning: These symptoms indicate a possible emergency. Please go to the nearest hospital immediately or call emergency services.' : 'সতর্কতা: এই লক্ষণগুলি একটি সম্ভাব্য জরুরি অবস্থা নির্দেশ করে। অনুগ্রহ করে অবিলম্বে নিকটস্থ হাসপাতালে যান বা জরুরি পরিষেবাগুলিতে কল করুন।',
              isEmergency: true,
            });
          } else if (message.toLowerCase().includes('heart') || message.toLowerCase().includes('chest')) {
            resolve({
              reply: language === 'en' ? 'Based on your symptoms, I recommend seeing a Cardiologist. Here are some options nearby:' : 'আপনার লক্ষণগুলির উপর ভিত্তি করে, আমি একজন কার্ডিওলজিস্ট দেখার পরামর্শ দিচ্ছি। এখানে কাছাকাছি কিছু বিকল্প আছে:',
              isEmergency: false,
              recommendedDoctors: [MOCK_DOCTORS[0]],
            });
          } else {
            resolve({
              reply: language === 'en' ? 'I understand. Could you tell me how long you have been experiencing these symptoms?' : 'আমি বুঝতে পেরেছি। আপনি কতদিন ধরে এই লক্ষণগুলি অনুভব করছেন তা কি আমাকে বলতে পারেন?',
              isEmergency: false,
            });
          }
        }, 1500);
      });
    },
  },
  appointments: {
    get: async (): Promise<Appointment[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_APPOINTMENTS), 800));
    },
    book: async (doctorId: string, date: string, time: string): Promise<{ success: boolean; appointment: Appointment }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const doctor = MOCK_DOCTORS.find(d => d.id === doctorId) || MOCK_DOCTORS[0];
          resolve({
            success: true,
            appointment: {
              id: `a${Date.now()}`,
              doctorName: doctor.name,
              specialty: doctor.specialty,
              clinicName: doctor.clinicName,
              date,
              time,
              status: 'upcoming',
            },
          });
        }, 1500);
      });
    },
  },
  doctors: {
    search: async (specialty: string): Promise<Doctor[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = MOCK_DOCTORS.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
          resolve(filtered.length > 0 ? filtered : MOCK_DOCTORS);
        }, 800);
      });
    }
  },
  history: {
    getSymptomLogs: async (): Promise<SymptomLog[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_SYMPTOM_LOGS), 600));
    },
    getCommunicationThreads: async (): Promise<CommunicationThread[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_THREADS), 600));
    }
  },
  clinics: {
    search: async (specialty?: string): Promise<Clinic[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_CLINICS), 600));
    }
  }
};
