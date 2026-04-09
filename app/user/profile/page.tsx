'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '../../../components/loader'
import UserHeader from "../../../components/userheader";
import {
  Mail,
  MapPin,
  Phone,
  Edit3,
  ShieldCheck,
  Building2,
  HardHat,
  ChevronRight,
  LayoutGrid,
  Map
} from 'lucide-react';

export default function UserProfilePage() {
  interface UserDetails {
    name: string,
    address: string,
    mobileNumber: string
    lat: number
    lng: number,
  }
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loader, setLoader] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    async function getResponse() {
      setLoader(true)
      if (status === 'unauthenticated') {
        router.replace('/signin')
      } else if (status === 'authenticated') {
        try {
          const res = await axios.get(`/api/user/details`)
          if(!res.data.success) {
            router.replace('/user/create-profile')
            return
          } 
          setUserDetails(res.data.userDetails)
        } catch (error) {
          console.error(error)
        } finally {
          setLoader(false)
        }
      }
    }
    getResponse()
  }, [router, status])

  if (status === 'loading' || loader) return <Loader />

  return (
    <div className="bg-[#030303] min-h-screen w-full text-white selection:bg-blue-500/30">
      <UserHeader tab={"profile"} />

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="grid grid-cols-12 gap-8 relative z-10">
                    <div className="col-span-12 lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full blur-lg opacity-20" />
                <img
                  src={session?.user?.image || '/pro.png'}
                  alt="Profile"
                  className="relative w-full h-full rounded-full object-cover border-4 border-zinc-900 bg-zinc-900"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-xl border-4 border-zinc-950">
                  <ShieldCheck size={18} />
                </div>
              </div>
              
              <h2 className="text-3xl font-black tracking-tighter mb-1">
                {userDetails?.name?.split(' ')[0] || "User"}
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">Personal Account</p>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/user/update-profile')}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
              >
                Edit Profile
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Switch Workspace</p>
              <div className="space-y-3">
                <RoleTile icon={<HardHat size={18}/>} label="Worker" path="/worker/profile" />
                <RoleTile icon={<Building2 size={18}/>} label="Vendor" path="/vendor/profile" />
              </div>
            </motion.div>
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20"
              >
                <Mail className="text-blue-400 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Registered Email</p>
                <p className="text-lg font-bold text-white truncate">{session?.user?.email}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20"
              >
                <Phone className="text-emerald-400 mb-4" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Contact Number</p>
                <p className="text-lg font-bold text-white tracking-widest">{userDetails?.mobileNumber || "Not Provided"}</p>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-10 rounded-[2.5rem] bg-zinc-950 border border-zinc-800 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Map size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-zinc-900 rounded-xl text-zinc-400">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Service Location</h3>
                </div>
                
                <p className="text-2xl md:text-3xl font-bold text-zinc-200 leading-tight max-w-lg">
                  {userDetails?.address  || "No address saved"}
                </p>

                <div className="mt-10 flex gap-4">
                   <div className="px-4 py-2 bg-zinc-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-500">
                     Active Region
                   </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <LayoutGrid className="text-zinc-600" size={32} />
                <div>
                  <p className="text-sm font-bold">Profile Visibility</p>
                  <p className="text-xs text-zinc-500 font-medium">Your profile is visible to all registered workers.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified & Live</span>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

function RoleTile({ icon, label, path }: { icon: React.ReactNode, label: string, path: string }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push(path)}
      className="w-full flex items-center justify-between p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 transition-all group"
    >
      <div className="flex items-center gap-4 text-zinc-400 group-hover:text-white transition-colors">
        {icon}
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </button>
  );
}