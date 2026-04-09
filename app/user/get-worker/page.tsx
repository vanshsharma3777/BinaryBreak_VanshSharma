'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion'
import { Loader } from '../../../components/loader'
import {
  Briefcase,
  ChevronRight,
  User,
  ShieldCheck,
  Truck,
  Wrench,
  Phone,
  X,
  Navigation,
  Timer
} from 'lucide-react';
import UserHeader from "@/components/userheader";
import { getRoadDistance, getUserCoordinates } from "@/lib/getDistanceBetwenPoints";

export default function UserProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loader, setLoader] = useState(false)
  const [workerDetails, setWorkerDetails] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'skilled' | 'delivery'>('skilled');
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  

  // Define distance logic outside useEffect to keep code clean
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

          return {
            ...worker,
            distance: travelData.distance, // e.g., "5.2 km"
            duration: travelData.duration, // e.g., "14 mins"
            travelLoading: false
          };
        } catch (e) {
          return {
            ...worker,
            distance: "N/A",
            duration: "N/A",
            travelLoading: false
          };
        }
      })
    );

    // --- SORTING LOGIC: Closest First ---
    const sortedWorkers = updatedWorkers.sort((a, b) => {
      if (a.distance === "N/A") return 1;
      if (b.distance === "N/A") return -1;

      const distA = parseFloat(a.distance.replace(/[^\d.]/g, ''));
      const distB = parseFloat(b.distance.replace(/[^\d.]/g, ''));

      return distA - distB;
    });

    setWorkerDetails(sortedWorkers);
  };

  useEffect(() => {
    async function getInitialData() {
      if (status !== 'authenticated') return;

      try {
        setLoader(true);
        const res = await axios.get(`/api/all-worker&vendor`);
        const workers = res.data.allWorker || [];

        // Render skeletons immediately
        setWorkerDetails(workers.map((w: any) => ({ ...w, travelLoading: true })));
        setLoader(false);

        // Start background distance processing
        const uCoords = await getUserCoordinates();
        calculateDistances(uCoords, workers);
      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    }
    getInitialData();
  }, [status]);

  const filteredWorkers = useMemo(() => {
    if (activeTab === 'delivery') {
      return workerDetails.filter(w => w.occupation === 'Agent');
    }
    return workerDetails.filter(w => w.occupation !== 'Agent');
  }, [workerDetails, activeTab]);

  if (status === 'loading' || loader) return <Loader />

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-emerald-500/30">
      <UserHeader tab={"workers"} />

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-zinc-500 font-black tracking-[0.3em] text-[10px] uppercase mb-4">
              <ShieldCheck size={14} className="text-emerald-400" /> Professional Registry
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
              Verified <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Experts</span>
            </h1>
          </div>

          <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('skilled')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'skilled' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              <Wrench size={14} /> Skilled Labor
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'delivery' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              <Truck size={14} /> Delivery Fleet
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredWorkers.map((worker) => (
              <motion.div
                layout
                key={worker.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedWorker(worker)}
                className="group cursor-pointer bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-6 transition-all hover:border-blue-500/50 shadow-2xl flex flex-col h-full"
              >
                <div className="relative mb-6 flex justify-center">
                  <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative w-24 h-24 rounded-full p-[2px] bg-zinc-800 overflow-hidden">
                    {worker.photo ? (
                      <img
                        src={worker.photo}
                        className="w-full h-full rounded-full bg-zinc-900 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full">
                        <User size={32} className="text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-emerald-600 p-1.5 rounded-full border-4 border-[#030303] shadow-lg">
                      <ShieldCheck size={12} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors">{worker.name}</h3>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">{worker.occupation}</p>
                </div>

                <div className="mt-auto pt-5 border-t border-zinc-900 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] uppercase text-zinc-600 font-black tracking-[0.2em]">Live Distance</p>
                    {worker.travelLoading ? (
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
                      </div>
                    ) : (
                      <p className="text-xs font-black text-emerald-400 tracking-tighter uppercase">{worker.distance || "N/A"}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedWorker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedWorker(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[3rem] p-8 text-center shadow-2xl flex flex-col items-center">
              <button onClick={() => setSelectedWorker(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10"><X /></button>

              {/* Circular Container */}
              <div className="relative mb-6">
                {/* Radial Glow */}q
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-110 pointer-events-none" />

                {/* Circular Fallback */}
                <div className="relative w-32 h-32 rounded-full p-[2px] bg-zinc-800 shadow-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full">
                    <User size={48} className="text-zinc-700" />
                  </div>

                  {/* Verification Badge */}
                  <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-4 border-[#030303] shadow-lg">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{selectedWorker.name}</h2>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <ShieldCheck size={14} /> Verified {selectedWorker.occupation}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-600 text-[9px] font-black uppercase mb-1">Experience</p>
                  <p className="text-xs font-bold">{selectedWorker.experience} Years</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-600 text-[9px] font-black uppercase mb-1">Travel Time</p>
                  <p className="text-xs font-bold text-emerald-400">{selectedWorker.duration || "Calculating..."}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a href={`tel:${selectedWorker.mobileNumber}`} className="flex items-center justify-center gap-3 w-full py-5 px-8 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
                  <Phone size={18} /> Call Professional
                </a>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedWorker.lat},${selectedWorker.lan}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center justify-center gap-3 w-full py-5 px-8 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-zinc-800 hover:border-zinc-600 transition-all"
                >
                  <Navigation size={18} /> Get Directions
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}