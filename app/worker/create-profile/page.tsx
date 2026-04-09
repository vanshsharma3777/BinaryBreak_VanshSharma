"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  User,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Briefcase,
  IndianRupee,
  Calendar,
  TimerReset,
  Bike,
  Hash,
  CreditCard
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function CreateWorkerProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: '',
    occupation: '',
    hourlyWage: '',
    experience: '',
    dailyWage: '',
    age: '',
    vehicleType: '',
    vehicleNumber: '',
    drivingLicense: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength?: number) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      if (maxLength && value.length > maxLength) return;
      setFormData({ ...formData, [field]: value });
    }
  };

  if (status === 'loading') return <Loader />;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, mobileNumber, occupation, dailyWage, age, experience, hourlyWage, vehicleType, vehicleNumber, drivingLicense } = formData;
    if (occupation === "Agent") {
      if (!vehicleType) {
        toast.error("Please select a vehicle type");
        return;
      }
      if (vehicleType !== "Cycle") {
        if (!vehicleNumber || !drivingLicense) {
          toast.error("Vehicle Number and License are required for motorized vehicles");
          return;
        }
      }
    }
    if (!name || !address || !mobileNumber || !occupation || !dailyWage || !experience || !hourlyWage || !age) {
      toast.error("Please fill all fields");
      return;
    }

    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (parseInt(age) < 18 || parseInt(age) > 100) {
      toast.error("Please enter a valid age (18-100)");
      return;
    }

    try {
      setLoading(true);
      console.log(occupation)
      const res = await axios.post('/api/worker/create-profile', formData);
      console.log(res.data)
      if (res.status === 200 || res.status === 201) {
        toast.success("Worker profile created!");
        router.replace('/worker/profile');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 405) {
        toast.error("Profile already exists");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-blue-500/30">
      <Toaster
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }}
      />

      <div className="relative p-6 flex flex-col items-center justify-center min-h-screen py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Go Back</span>
          </button>

          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-12">
              <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
                Worker Registration
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Set up your professional identity and wage expectations.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="e.g. Alex Smith"
                      value={formData.name}
                      onChange={handleNameChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-mono placeholder:text-zinc-700"
                      placeholder="10 Digit Number"
                      value={formData.mobileNumber}
                      onChange={(e) => handleNumberInput(e, 'mobileNumber', 10)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">
                    Occupation
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors z-10 pointer-events-none" />

                    <select
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-10 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-zinc-400 appearance-none cursor-pointer font-medium selection:bg-zinc-800"
                      style={{ color: formData.occupation ? '#d4d4d8' : '#52525b' }}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    >
                      <option value="" disabled className="bg-[#030303] text-zinc-700">Select </option>
                      <option value="Plumber" className="bg-[#030303] text-zinc-300">Plumber</option>
                      <option value="Carpenter" className="bg-[#030303] text-zinc-300">Carpenter</option>
                      <option value="Electrician" className="bg-[#030303] text-zinc-300">Electrician</option>
                      <option value="Painter" className="bg-[#030303] text-zinc-300">Painting & Polishing</option>
                      <option value="Welder" className="bg-[#030303] text-zinc-300">Welding & Fabrication</option> text-zinc-300
                      <option value="Tailor" className="bg-[#030303] text-zinc-300">Tailor / Stitching</option>
                      <option value="Tutor" className="bg-[#030303] text-zinc-300">Home Tutor</option>
                      <option value="Mason" className="bg-[#030303] text-zinc-300">Mason (Mistri)</option>
                      <option value="Mechanic" className="bg-[#030303] text-zinc-300">Vehicle Mechanic</option>
                      <option value="Cleaning" className="bg-[#030303] text-zinc-300">House Cleaning</option>
                      <option value="Gardener" className="bg-[#030303] text-zinc-300">Gardener</option>
                      <option value="Chef" className="bg-[#030303] text-zinc-300">Cook / Chef</option>
                      <option value="Barber" className="bg-[#030303] text-zinc-300">Barber / Salon</option>
                      <option value="Agent" className="bg-[#030303] text-zinc-300">Delivery Agent</option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-cyan-400 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Age</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleNumberInput(e, 'age', 2)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Experience (Years)</label>
                  <div className="relative group">
                    <TimerReset className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="5"
                      value={formData.experience}
                      onChange={(e) => handleNumberInput(e, 'experience', 2)}
                    />
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {formData.occupation === "Agent" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-4 border-t border-zinc-900"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 ml-1">Vehicle Type</label>
                        <div className="relative group">
                          <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors z-10 pointer-events-none" />
                          <select
                            className="w-full bg-zinc-900/40 border border-emerald-900/30 rounded-xl pl-12 pr-10 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all text-zinc-400 appearance-none cursor-pointer font-medium"
                            value={formData.vehicleType}
                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                          >
                            <option value="" disabled className="bg-[#030303] text-zinc-700">Select Mode</option>
                            <option value="Cycle" className="bg-[#030303]">Cycle</option>
                            <option value="Bike" className="bg-[#030303]">Bike / Motorcycle</option>
                            <option value="Scooter" className="bg-[#030303]">Scooter</option>
                            <option value="Car" className="bg-[#030303]">Mini-Van / Car</option>
                          </select>
                        </div>
                      </div>
                      {formData.vehicleType && formData.vehicleType !== "Cycle" && (
                        <>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Vehicle Number</label>
                            <div className="relative group">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                              <input
                                type="text"
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                                placeholder="UP 32 XX 0000"
                                value={formData.vehicleNumber}
                                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                              />
                            </div>
                          </motion.div>

                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">DL Number</label>
                            <div className="relative group">
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                              <input
                                type="text"
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                                placeholder="License ID"
                                value={formData.drivingLicense}
                                onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value.toUpperCase() })}
                              />
                            </div>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Daily Wage (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-bold placeholder:text-zinc-700"
                      placeholder="800"
                      value={formData.dailyWage}
                      onChange={(e) => handleNumberInput(e, 'dailyWage', 5)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Hourly Rate (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-bold placeholder:text-zinc-700"
                      placeholder="150"
                      value={formData.hourlyWage}
                      onChange={(e) => handleNumberInput(e, 'hourlyWage', 5)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Work Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                  <textarea
                    rows={3}
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700 resize-none leading-relaxed"
                    placeholder="Area, Landmark, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-blue-600 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Complete Registration <Save size={18} /></>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}