"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  User,
  MapPin,
  Phone,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function CreateProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobileNumber: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d*$/.test(value) && value.length <= 10)) {
      setFormData({ ...formData, mobileNumber: value });
    }
  };

  if (status === 'loading') return <Loader />;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.mobileNumber.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/user/create-profile', formData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Profile created successfully!");
        router.replace('/user/profile');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 405) {
        toast.error("Profile already exists.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-emerald-500/30">
      <Toaster 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
        }} 
      />

      <div className="relative p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Go Back</span>
          </button>

          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-10">
              <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
                Complete Your Profile
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Please provide your authentic details for verification.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Contact Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Enter 10 digit number"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700 font-medium"
                    value={formData.mobileNumber}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 ml-1">Service Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-emerald-400 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Unit, Street, City, ZIP..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700 resize-none leading-relaxed"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: '#10b981' }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-emerald-600 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Save & Proceed <Save size={18} />
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