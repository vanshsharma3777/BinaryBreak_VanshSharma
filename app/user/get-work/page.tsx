'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    ChevronRight, 
    Plus, 
    Search,
    History,
    CheckCircle2,
    X,
    AlertCircle,
    RotateCcw
} from 'lucide-react';
import axios from "axios";
import { Loader } from '@/components/loader';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import UserHeader from "@/components/userheader";

export default function UserWorkHistory() {
    const router = useRouter();
    const { status } = useSession();
    const [works, setWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState<{show: boolean, workId: string | null, currentState: boolean}>({
        show: false,
        workId: null,
        currentState: true
    });

    const fetchUserWorks = async () => {
        if (status !== "authenticated") return;
        try {
            const res = await axios.get('/api/work');
            if (res.data.success) {
                const sorted = res.data.allWork.sort((a: any, b: any) => 
                    a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1
                );
                setWorks(sorted);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }
        fetchUserWorks();
    }, [status, router]);

    const handleToggleStatus = async () => {
        if (!confirmModal.workId) return;
        
        try {
            const res = await axios.put(`/api/work/${confirmModal.workId}`, {
                isActive: !confirmModal.currentState
            });

            if (res.data.success) {
                toast.success(!confirmModal.currentState ? "Project Re-activated" : "Project Marked Completed", {
                    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
                });
                setConfirmModal({ show: false, workId: null, currentState: true });
                await fetchUserWorks();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30">
            <Toaster position="top-center" />
            <UserHeader tab="history" />

            <main className="max-w-5xl mx-auto p-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                            Project Ledger
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Manage your posted requirements</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/user/create-work')}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em]"
                    >
                        <Plus size={14} /> New Project
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {works.map((work) => (
                            <WorkHistoryCard 
                                key={work.id} 
                                work={work} 
                                onAction={() => setConfirmModal({ show: true, workId: work.id, currentState: work.isActive })}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </main>

            {/* Premium Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ show: false, workId: null, currentState: true })}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-xl font-black tracking-tight uppercase mb-2">
                                {confirmModal.currentState ? "Mark as Complete?" : "Re-activate Project?"}
                            </h2>
                            <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8 uppercase tracking-widest">
                                {confirmModal.currentState 
                                    ? "This will hide the project from the active worker feed."
                                    : "This will make the project visible to workers again."}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ show: false, workId: null, currentState: true })}
                                    className="flex-1 px-4 py-4 rounded-xl border border-zinc-800 font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    className="flex-1 px-4 py-4 rounded-xl bg-emerald-600 font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-emerald-900/20"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function WorkHistoryCard({ work, onAction }: { work: any, onAction: () => void }) {
    const date = new Date(work.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short'
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group relative border rounded-3xl p-6 md:p-8 transition-all ${
                work.isActive 
                ? "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700" 
                : "bg-zinc-900/10 border-zinc-900 opacity-60 grayscale"
            }`}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            work.isActive 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}>
                            {work.isActive ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : null}
                            {work.isActive ? "Live" : "Archived"}
                        </div>
                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-tighter">{date}</span>
                    </div>
                    
                    <h2 className={`text-2xl font-black tracking-tighter uppercase transition-colors ${
                        work.isActive ? "text-white" : "text-zinc-600"
                    }`}>
                        {work.title}
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Perimeter</p>
                        <p className="text-zinc-400 text-xs font-bold uppercase truncate max-w-[120px]">
                            {work.address?.split(',')[0]}
                        </p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAction}
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                            work.isActive 
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500" 
                            : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-blue-600 hover:text-white hover:border-blue-500"
                        }`}
                    >
                        {work.isActive ? <ChevronRight size={20} /> : <RotateCcw size={18} />}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}