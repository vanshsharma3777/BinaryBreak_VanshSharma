'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '../../../components/loader'
import { motion } from 'framer-motion'
import { 
  Store, 
  UserCircle, 
  MapPin, 
  PhoneCall, 
  ArrowUpRight,
  Truck,
  Star
} from 'lucide-react';
import UserHeader from "@/components/userheader";

interface VendorDetails {
  mobileNumber: string;
  address: string;
  id: string;
  shopName: string;
  role: string;
  rating: number;
  age: number;
  name: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loader, setLoader] = useState(false)
  const [vendorDetails, setVendorDetails] = useState<VendorDetails[]>([])

  useEffect(() => {
    async function getResponse() {
      if (status === 'unauthenticated') {
        router.replace('/signin');
        return;
      }
      if (status === 'authenticated') {
        try {
          setLoader(true);
          const res = await axios.get(`/api/all-worker&vendor`);
          if(!res.data.success && res.status === 201){
            router.replace('/user/create-profile')
          }
          if(!res.data.success && res.data.status === 404){
            router.push('/signin')
          }
          setVendorDetails(res.data.allVendor || []);   
        } catch (err) {
          console.error("API error:", err);
        } finally {
          setLoader(false);
        }
      }
    }
    getResponse();
  }, [status, router]);

  if (status === 'loading' || loader) return <Loader />;

  if (status === "authenticated") {
    return (
      <div className="w-full min-h-screen bg-[#030303] overflow-x-hidden selection:bg-emerald-500/30">   
        <UserHeader tab={"vendors"} />

        <div className="p-6 md:p-12 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <header className="mb-14">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-zinc-500 font-black tracking-[0.3em] text-[10px] uppercase mb-4"
              >
                <Truck size={14} className="text-emerald-500" /> Supply & Logistics
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-white tracking-tighter"
              >
                Partner <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Vendors</span>
              </motion.h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorDetails.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => router.push(`/vendor/detail/`)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-full p-7 rounded-[2rem] bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800/50 group-hover:border-emerald-500/50 transition-all duration-300 shadow-2xl">
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <Store size={22} />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-white">{vendor.rating || "4.5"}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-1 tracking-tight">
                        {vendor.shopName}
                      </h2>
                      <div className="flex items-center gap-2 text-zinc-500 mt-1">
                        <UserCircle size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{vendor.name}</span>
                      </div>
                    </div>

                    <div className="space-y-3 py-5 border-t border-zinc-900">
                      <div className="flex items-start gap-3 text-zinc-400">
                        <MapPin size={16} className="shrink-0 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        <p className="text-xs font-medium leading-relaxed line-clamp-2">{vendor.address}</p>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        <PhoneCall size={16} className="shrink-0 text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                        <p className="text-xs font-bold tracking-widest">{vendor.mobileNumber}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="px-3 py-1 rounded-lg bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {vendor.age} Years Exp
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Subtle Brand Glow on Hover */}
                    <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}