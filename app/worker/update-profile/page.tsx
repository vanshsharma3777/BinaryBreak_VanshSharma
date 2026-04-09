"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  User,
  MapPin,
  Briefcase,
  IndianRupee,
  Save,
  ArrowLeft,
  Phone,
  Bike,
  CreditCard,
  Hash
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';
import getLatitudeLongitude from '@/lib/getLatitudeLongitude';
import WorkerHeader from '@/components/workerHeader';

export default function WorkerProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    occupation: '',
    lat: 0.0,
    lng: 0.0,
    mobileNumber: '',
    dailyWage: '',
    vehicleType: '', // Dynamic Fields
    vehicleNumber: '',
    drivingLicense: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
      return;
    }

    const fetchInitialData = async () => {
      if (status === 'authenticated') {
        try {
          const res = await axios.get('/api/worker/details');
          if (res.data.success) {
            const data = res.data.userDetails;
           

            setFormData({
              name: data.name ?? '',             // Use ?? '' to catch null
              address: data.address ?? '',       // This is likely the culprit
              occupation: data.occupation ?? '',
              lat: data.lat ?? 0,
              lng: data.lng ?? 0,
              mobileNumber: data.mobileNumber ?? '',
              dailyWage: data.dailyWage?.toString() ?? '',
              vehicleType: data.vehicleType ?? '',
              vehicleNumber: data.vehicleNumber ?? '',
              drivingLicense: data.drivingLicense ?? ''
            });
          }
        } catch (error) {
          console.error("Failed to fetch worker details");
        }
      }
    };
    fetchInitialData();
  }, [status, router]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, limit: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= limit) {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (status === 'loading') return <Loader />;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const location = await getLatitudeLongitude(formData.address);
      const updatedData = {
        ...formData,
        lat: location?.lat ?? formData.lat,
        lng: location?.lng ?? formData.lng
      };

      const res = await axios.put('/api/worker/update-profile', updatedData);

      if (res.status === 200 || res.status === 201) {
        toast.success("Profile updated successfully!");
        router.replace('/worker/profile');
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-blue-500/30">
      <WorkerHeader tab='update' />
      <Toaster
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }}
      />

      <div className="relative p-6 flex flex-col items-center justify-center py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.02),transparent_70%)] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl z-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
          </button>

          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-12">
              <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
                Update <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Profile</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Modify your skills or contact details.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Occupation Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Primary Occupation</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors z-10 pointer-events-none" />
                  <select
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-10 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all appearance-none cursor-pointer font-medium"
                    style={{ color: formData.occupation ? '#d4d4d8' : '#52525b' }}
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  >
                    <option value="" disabled className="bg-[#030303] text-zinc-700">Select Category</option>
                    <option value="Plumber" className="bg-[#030303] text-zinc-300">Plumber</option>
                    <option value="Carpenter" className="bg-[#030303] text-zinc-300">Carpenter</option>
                    <option value="Electrician" className="bg-[#030303] text-zinc-300">Electrician</option>
                    <option value="Painter" className="bg-[#030303] text-zinc-300">Painting & Polishing</option>
                    <option value="Welder" className="bg-[#030303] text-zinc-300">Welding & Fabrication</option>
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
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>

              {/* Dynamic Agent Logic */}
              <AnimatePresence>
                {formData.occupation === "Agent" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 pt-4 border-t border-zinc-900 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 ml-1">Vehicle Type</label>
                        <div className="relative group">
                          <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10 pointer-events-none" />
                          <select
                            className="w-full bg-zinc-900/40 border border-emerald-900/30 rounded-xl pl-12 pr-10 py-4 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all text-zinc-400 appearance-none cursor-pointer font-medium"
                            value={formData.vehicleType}
                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                          >
                            <option value="" disabled className="bg-[#030303]">Select Mode</option>
                            <option value="Cycle" className="bg-[#030303]">Cycle</option>
                            <option value="Bike" className="bg-[#030303]">Bike / Motorcycle</option>
                            <option value="Scooter" className="bg-[#030303]">Scooter</option>
                          </select>
                        </div>
                      </div>

                      {formData.vehicleType && formData.vehicleType !== "Cycle" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Vehicle Number</label>
                          <div className="relative group">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                            <input
                              type="text"
                              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                              placeholder="UP 32 XX 0000"
                              value={formData.vehicleNumber}
                              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                    <input type="text" className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:bg-zinc-900 text-white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Daily Wage (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input type="text" className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:bg-zinc-900 text-white font-bold" value={formData.dailyWage} onChange={(e) => handleNumericChange(e, 'dailyWage', 5)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Work Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <textarea rows={3} className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:bg-zinc-900 text-white resize-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: '#10b981' }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-emerald-600 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Save Updates <Save size={18} /></>}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}