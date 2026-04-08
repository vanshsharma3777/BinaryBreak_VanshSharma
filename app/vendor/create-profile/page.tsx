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
  ArrowLeft,
  Store,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

export default function CreateVendorProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    shopName: '',
    address: '',
    mobileNumber: '',
    age: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, [field]: value });
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
    const { ownerName, shopName, address, mobileNumber, age } = formData;
    
    if (!ownerName || !shopName || !address || !mobileNumber || !age) {
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
      const res = await axios.post('/api/vendor/create-profile', formData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Vendor profile created!");
        router.replace('/vendor/profile');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 405) {
          toast.error("Vendor profile already exists");
      } else {
          toast.error("Something went wrong");
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

      <div className="relative p-6 flex flex-col items-center justify-center min-h-screen py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />

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
              <h1 className="text-4xl font-black mb-3 tracking-tighter text-white uppercase">
                Vendor <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Registration</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Join the marketplace and showcase your inventory.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Shop Entity Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="e.g. Apex Construction Supplies"
                      value={formData.shopName}
                      onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Owner Full Name</label>
                  <div className="relative group">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="John Doe"
                      value={formData.ownerName}
                      onChange={(e) => handleTextChange(e, 'ownerName')}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Primary Contact</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white font-mono placeholder:text-zinc-700"
                      placeholder="10 digit number"
                      value={formData.mobileNumber}
                      onChange={(e) => handleNumberInput(e, 'mobileNumber', 10)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Owner Age</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 w-5 h-5 transition-colors" />
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700"
                      placeholder="30"
                      value={formData.age}
                      onChange={(e) => handleNumberInput(e, 'age', 2)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Store / Shop Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-zinc-600 group-focus-within:text-emerald-400 w-5 h-5 transition-colors" />
                  <textarea
                    rows={3}
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all text-white resize-none leading-relaxed placeholder:text-zinc-700"
                    placeholder="Unit No, Building Name, Market, City, Pincode"
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
                  <>Finalize Vendor Profile <Save size={18} /></>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}