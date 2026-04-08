"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Phone
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
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    const fetchInitialData = async () => {
      if (status === 'authenticated') {
        try {
          const res = await axios.get('/api/worker/details');
          if (res.data.success) {
            setFormData({
              name: res.data.userDetails.name || '',
              address: res.data.userDetails.address || '',
              occupation: res.data.userDetails.occupation || '',
              lat: res.data.userDetails.lat || 0,
              lng: res.data.userDetails.lng || 0,
              mobileNumber: res.data.userDetails.mobileNumber || '',
              dailyWage: res.data.userDetails.dailyWage?.toString() || '',
            });
          }
        } catch (error) {
          console.error("Failed to fetch worker details");
        }
      }
    };
    fetchInitialData();
  }, [status, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

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
    const { name, address, occupation, dailyWage, mobileNumber } = formData;
    
    if (!name.trim() || !address.trim() || !occupation.trim() || !dailyWage || !mobileNumber) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
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
      if (axios.isAxiosError(error) && error.response?.status === 402) {
        router.replace("/worker/create-profile");
      } else {
        toast.error("Failed to update profile.");
      }
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
          </button>

          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-12">
              <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
                Update <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Profile</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Keep your professional credentials up to date.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Primary Occupation</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electrician"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Daily Wage (₹)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="800"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-bold"
                      value={formData.dailyWage}
                      onChange={(e) => handleNumericChange(e, 'dailyWage', 5)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Contact Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="10 digit number"
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-mono"
                    value={formData.mobileNumber}
                    onChange={(e) => handleNumericChange(e, 'mobileNumber', 10)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Service Area / Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter your village/city and area..."
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white resize-none leading-relaxed"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: '#10b981' }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-emerald-600 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Changes <Save size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}