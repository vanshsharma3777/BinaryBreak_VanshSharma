'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from '@/components/loader';
import {
    User,
    Mail,
    MapPin,
    Phone,
    Edit3,
    ShieldCheck,
    Briefcase,
    IndianRupee,
    Calendar,
    UserCog,
    Building2,
    Users,
    TimerReset,
    ChevronRight,
    Circle
} from 'lucide-react';
import WorkerHeader from "@/components/workerHeader";

export default function WorkerProfilePage() {
    interface WorkerDetails {
        name: string;
        address: string;
        mobileNumber: string;
        hourlyWages: number;
        experience: number;
        occupation: string;
        dailyWage: string;
        age: string;
    }

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(false);
    const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(null);

    useEffect(() => {
        async function getResponse() {
            if (status === 'unauthenticated') {
                router.replace('/');
            } else if (status === 'authenticated') {
                try {
                    setLoader(true);
                    const res = await axios.get(`/api/worker/details`);
                    console.log(res.data)
                    if (res.data.success === false && res.status === 201) {
                        console.log('hello')
                        router.replace('/worker/create-profile');
                        return;
                    }
                    setWorkerDetails(res.data.userDetails);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        router.replace('/worker/create-profile');
                    }
                } finally {
                    setLoader(false);
                }
            }
        }
        getResponse();
    }, [router, status]);

    const capitalName = (str: string) => {
        return str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") : "Worker";
    };

    if (status === 'loading' || loader) return <Loader />;

    return (
        <div className="bg-[#030303] min-h-screen w-full text-white selection:bg-blue-500/30">
            <WorkerHeader tab={"profile"} />

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
                {/* Visual Grid for Style */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="grid grid-cols-12 gap-8 relative z-10">
                    
                    {/* SIDEBAR: Profile Card & Role Switcher */}
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
                            
                            <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase">
                                {workerDetails?.name?.split(' ')[0] || "Worker"}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Available Now</span>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push('/worker/update-profile')}
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
                                <RoleTile icon={<UserCog size={18}/>} label="User" path="/user/profile" />
                                <RoleTile icon={<Building2 size={18}/>} label="Vendor" path="/vendor/profile" />
                            </div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT: Professional Stats & Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* Dynamic Stat Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                icon={<Briefcase size={20}/>} 
                                label="Occupation" 
                                value={workerDetails?.occupation || "Not Set"} 
                                color="blue" 
                            />
                            <StatCard 
                                icon={<IndianRupee size={20}/>} 
                                label="Daily Rate" 
                                value={`₹${workerDetails?.dailyWage}`} 
                                color="emerald" 
                            />
                            <StatCard 
                                icon={<TimerReset size={20}/>} 
                                label="Experience" 
                                value={`${workerDetails?.experience} Yrs`} 
                                color="purple" 
                            />
                        </div>

                        {/* Large Info Block */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-10 rounded-[2.5rem] bg-zinc-950 border border-zinc-800"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">Contractual Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                                <DetailItem icon={<Phone size={18}/>} label="Contact" value={workerDetails?.mobileNumber || "N/A"} />
                                <DetailItem icon={<Mail size={18}/>} label="Official Email" value={session?.user?.email || "N/A"} />
                                <DetailItem icon={<Calendar size={18}/>} label="Age" value={`${workerDetails?.age} Years`} />
                                <DetailItem icon={<IndianRupee size={18}/>} label="Hourly Rate" value={`₹${workerDetails?.hourlyWages}`} />
                                <div className="md:col-span-2">
                                    <DetailItem icon={<MapPin size={18}/>} label="Base Location" value={workerDetails?.address || "Location not updated"} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Status Message */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex items-center gap-6"
                        >
                            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Active for Hire</p>
                                <p className="text-xs text-zinc-500 font-medium">Your profile is currently live. Contractors can view your rates and occupation.</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-400",
        emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400",
        purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-400"
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-[2.5rem] bg-gradient-to-br border ${colorClasses[color]}`}
        >
            <div className="mb-4 opacity-80">{icon}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
            <p className="text-lg font-bold text-white truncate uppercase">{value}</p>
        </motion.div>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-5 group">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-white transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{label}</p>
                <p className="text-sm font-bold text-zinc-200 tracking-tight leading-relaxed">{value}</p>
            </div>
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