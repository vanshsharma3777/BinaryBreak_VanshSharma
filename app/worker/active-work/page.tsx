'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, Calendar, Clock, ImageIcon, MapPin, Maximize2, Navigation, Phone, User, X, Map } from 'lucide-react';
import axios from "axios";
import { Loader } from '../../../components/loader';
import { useRouter } from "next/navigation";
import WorkerHeader from "@/components/workerHeader";

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2) + " km";
};

export default function ActiveWorkPage() {
    const router = useRouter();
    const [activeWorks, setActiveWorks] = useState<any[]>([]);
    const [workerDetails, setWorkerDetails] = useState<{ lat: number, lan: number, occupation: string } | null>(null);
    const [selectedWork, setSelectedWork] = useState<any | null>(null);
    const [filterByOccupation, setFilterByOccupation] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workerRes, workRes] = await Promise.all([
                    axios.get('/api/worker/details'),
                    axios.get('/api/all-work')
                ]);
                console.log(workRes)
                console.log(workRes)
                if (workerRes.data.success && (workRes.status === 201 || workerRes.status === 201)) {
                    router.replace('/worker/create-profile');
                }
                if (workerRes.data.success) {
                    setWorkerDetails(workerRes.data.userDetails);
                }
                if (workRes.data.success) {
                    const active = workRes.data.allWork.filter((w: any) => w.isActive);
                    setActiveWorks(active);
                     
                }
            } catch (error) {
                if(axios.isAxiosError(error) && error.response?.status === 402){
                    router.replace('/worker/create-profile');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const displayWorks = activeWorks.filter((work) => {
        if (!filterByOccupation || !workerDetails?.occupation) return true;
        return work.title.toLowerCase().includes(workerDetails.occupation.toLowerCase());
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30">
            <WorkerHeader tab="active" />

            <main className="max-w-4xl mx-auto p-6 py-12">
                <AnimatePresence mode="wait">
                    {!selectedWork ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter">
                                        Live <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Opportunities</span>
                                    </h1>
                                    <p className="text-zinc-500 text-sm font-medium tracking-tight mt-1">
                                        {workerDetails ? `Sourcing tasks for ${workerDetails.occupation}` : "Available tasks in your perimeter"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 pl-4 rounded-2xl border border-zinc-800">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        {filterByOccupation ? "Smart Match" : "Global Feed"}
                                    </span>
                                    <button
                                        onClick={() => setFilterByOccupation(!filterByOccupation)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${filterByOccupation ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                    >
                                        <motion.div
                                            animate={{ x: filterByOccupation ? 26 : 4 }}
                                            className="w-4 h-4 bg-white rounded-full absolute top-1"
                                        />
                                    </button>
                                </div>
                            </div>

                            {displayWorks.length === 0 ? (
                                <div className="text-center py-24 border border-zinc-800 rounded-[3rem] bg-zinc-950/40 backdrop-blur-sm">
                                    <Briefcase className="text-zinc-800 mx-auto mb-6" size={48} />
                                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Perimeter clear</h3>
                                    <p className="text-zinc-500 text-xs font-medium max-w-xs mx-auto mb-8 uppercase tracking-widest leading-loose">
                                        {filterByOccupation 
                                            ? `No active requests for "${workerDetails?.occupation}" at this moment.`
                                            : "System is currently idle. No new tasks posted."}
                                    </p>
                                    {filterByOccupation && (
                                        <button
                                            onClick={() => setFilterByOccupation(false)}
                                            className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all"
                                        >
                                            View Global Feed
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {displayWorks.map((work, index) => (
                                        <WorkCard
                                            key={work.id || index}
                                            work={work}
                                            distance={workerDetails ? getDistance(workerDetails.lat, workerDetails.lan, work.lat, work.lng) : "N/A"}
                                            onViewDetails={() => setSelectedWork(work)}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setSelectedWork(null)}
                                className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Return to Feed
                            </button>
                            <WorkDetailsView work={selectedWork} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function WorkCard({ work, distance, onViewDetails }: any) {
    const formatExactDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timePart = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        return { datePart, timePart };
    };

    const { datePart, timePart } = formatExactDateTime(work.createdAt);

    return (
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        {work.title}
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium line-clamp-1 tracking-tight">
                        {work.description}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 text-blue-400 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2">
                    <Navigation size={12} className="fill-blue-400/20" /> {distance}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={14} className="text-zinc-600" />
                    <span className="truncate max-w-[200px]">{work?.address || "On-Site"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                        <Calendar size={12} className="text-blue-500" />
                        <span>{datePart}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                        <Clock size={12} className="text-blue-500" />
                        <span>{timePart}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onViewDetails}
                className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-zinc-200"
            >
                Review Requirements
                <ArrowRight size={14} />
            </button>
        </div>
    );
}

function WorkDetailsView({ work }: any) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImg(null)}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md"
                    >
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            src={selectedImg}
                            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-zinc-800"
                            alt="Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-10 border-b border-zinc-900 bg-gradient-to-br from-blue-500/5 to-transparent">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6 inline-block">
                    Task Specification
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">{work.title}</h2>
            </div>

            <div className="p-10 space-y-12">
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Requirement Brief</h3>
                    <p className="text-zinc-300 text-lg md:text-xl font-medium leading-relaxed">{work.description}</p>
                </div>

                {work.photo && work.photo.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ImageIcon size={14} /> Documentation ({work.photo.length})
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                            {work.photo.map((imgUrl: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImg(imgUrl)}
                                    className="relative min-w-[200px] h-32 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 group"
                                >
                                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                        <Maximize2 className="text-white" size={20} />
                                    </div>
                                    <img src={imgUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Work item" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/30 rounded-[2rem] p-8 border border-zinc-800">
                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-8">Contractor Profile</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400"><User size={20} /></div>
                                <div>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black">Full Name</p>
                                    <p className="font-bold text-white uppercase tracking-tight">{work.user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400"><Phone size={20} /></div>
                                <div>
                                    <p className="text-[9px] text-zinc-600 uppercase font-black">Direct Contact</p>
                                    <p className="font-mono font-bold text-white tracking-widest">{work.user?.mobileNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/30 rounded-[2rem] p-8 border border-zinc-800 flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-8">Logistics</h3>
                            <div className="flex gap-4">
                                <MapPin className="text-zinc-600 shrink-0" size={20} />
                                <p className="text-zinc-400 text-xs font-medium leading-relaxed">{work?.address}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(`https://www.google.com/maps?q=${work.lat},${work.lng}`)}
                            className="mt-10 w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
                        >
                            Open Navigation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}