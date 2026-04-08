'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'
import { Loader } from '../../../components/loader'
import {
  Briefcase,
  ChevronRight,
  MapPin,
  User,
  ShieldCheck,
  Timer
} from 'lucide-react';
import UserHeader from "@/components/userheader";
import { getRoadDistance, getUserCoordinates } from "@/lib/getDistanceBetwenPoints";

export default function UserProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loader, setLoader] = useState(false)
  const [workerDetails, setWorkerDetails] = useState<any[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    async function getInitialData() {
      if (status !== 'authenticated') return;

      try {
        setLoader(true);
        const res = await axios.get(`/api/all-worker&vendor`);
        const workers = res.data.allWorker || [];

        // Set workers immediately so UI renders, but with distance in loading state
        setWorkerDetails(workers.map((w: any) => ({ ...w, travelLoading: true })));
        setLoader(false);

        // Get live location
        const uCoords = await getUserCoordinates();
        setUserCoords(uCoords);
        
        // Background calculation
        calculateDistances(uCoords, workers);

      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    }

    const calculateDistances = async (uCoords: any, workers: any[]) => {
      const updatedWorkers = await Promise.all(
        workers.map(async (worker) => {
          try {
            const travelData = await getRoadDistance(
              uCoords.lat,
              uCoords.lng,
              worker.lat,
              worker.lan
            );
            return { ...worker, ...travelData, travelLoading: false };
          } catch (e) {
            return { ...worker, distance: "N/A", duration: "N/A", travelLoading: false };
          }
        })
      );
      setWorkerDetails(updatedWorkers);
    };

    getInitialData();
  }, [status]);

  if (status === 'loading' || loader) return <Loader />

  if (status === "authenticated") {
    return (
      <div className="w-full min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-blue-500/30">
        <UserHeader tab={"workers"} />

        <div className="p-6 md:p-12 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.03),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <header className="mb-14">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-zinc-500 font-black tracking-[0.3em] text-[10px] uppercase mb-4"
              >
                <Briefcase size={14} className="text-blue-400" /> Human Capital & Services
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tighter"
              >
                Verified <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Professionals</span>
              </motion.h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workerDetails.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="h-full bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-6 transition-all duration-300 hover:border-blue-500/50 shadow-2xl flex flex-col">

                    <div className="relative mb-6 flex justify-center">
                      <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500" />
                      <div className="relative w-24 h-24 rounded-full p-[2px] bg-zinc-800">
                        <img
                          src={worker.photo || '/pro.png'}
                          alt={worker.name}
                          className="w-full h-full rounded-full bg-zinc-900 object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full border-4 border-[#030303] shadow-lg">
                          <ShieldCheck size={12} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-black text-white mb-1 tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                        {worker.occupation}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        <User size={10} /> {worker.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-zinc-900/50 rounded-2xl p-3 text-center border border-zinc-800">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1">Experience</p>
                        <p className="text-white text-xs font-bold">{worker.experience} Yrs</p>
                      </div>
                      
                      {/* Distance Badge with "Calculating" state */}
                      <div className="bg-zinc-900/50 rounded-2xl p-3 text-center border border-zinc-800 flex flex-col items-center justify-center min-h-[50px]">
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1">Commute</p>
                        {worker.travelLoading ? (
                          <div className="flex items-center gap-1">
                             <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                             <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <p className="text-emerald-500 text-xs font-bold leading-none">{worker.distance}</p>
                            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-tighter mt-0.5">{worker.duration}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-5 border-t border-zinc-900 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase text-zinc-600 font-black tracking-widest">Daily Rate</p>
                        <p className="text-xl font-black text-white tracking-tighter">₹{worker.dailyWage}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                        <ChevronRight size={20} />
                      </div>
                    </div>
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