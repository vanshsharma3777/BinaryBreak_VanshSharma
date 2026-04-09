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
    Store,
    Calendar,
    UserCog,
    Briefcase,
    Users,
    UserCheck,
    ChevronRight,
    Map
} from 'lucide-react';
import VendorHeader from "@/components/vendorHeader";

export default function VendorProfilePage() {
    interface VendorDetails {
        name: string;
        shopName: string;
        address: string;
        mobileNumber: string;
        age: string;
    }

    const router = useRouter();
    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(false);
    const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);

    useEffect(() => {
        async function getResponse() {
            if (status === 'unauthenticated') {
                router.replace('/signin');
            } else if (status === 'authenticated') {
                try {
                    setLoader(true);
                    const res = await axios.get(`/api/vendor/details`);
                    console.log("res" , res.data)
                    if (res.data.success === false || !res.data.userDetails) {
                        router.replace('/vendor/create-profile');
                        return;
                    }
                    setVendorDetails(res.data.userDetails);
                    console.log(res.data)
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        router.replace('/vendor/create-profile');
                    }
                } finally {
                    setLoader(false);
                }
            }
        }
        getResponse();
    }, [router, status]);

    if (status === 'loading' || loader) return <Loader />;

    return (
        <div className="bg-[#030303] min-h-screen w-full text-white selection:bg-emerald-500/30">
            <VendorHeader tab={"profile"} />

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
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full blur-lg opacity-20" />
                                <div className="relative w-full h-full rounded-full p-[3px] bg-zinc-800">
                                    <img
                                        src={session?.user?.image || '/pro.png'}
                                        alt="Vendor"
                                        className="w-full h-full rounded-full object-cover bg-zinc-900"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-600 p-2 rounded-xl border-4 border-zinc-950">
                                    <ShieldCheck size={18} />
                                </div>
                            </div>
                            
                            <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase line-clamp-1">
                                {vendorDetails?.shopName || "Enterprise"}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Storefront Live</span>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push('/vendor/update-profile')}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
                            >
                                Update Store Details
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Quick Switch</p>
                            <div className="space-y-3">
                                <RoleTile icon={<UserCog size={18}/>} label="User Mode" path="/user/profile" />
                                <RoleTile icon={<Briefcase size={18}/>} label="Worker Mode" path="/worker/profile" />
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20"
                            >
                                <UserCheck className="text-emerald-400 mb-4" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Owner / Manager</p>
                                <p className="text-lg font-bold text-white uppercase tracking-tight">{vendorDetails?.name}</p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20"
                            >
                                <Phone className="text-cyan-400 mb-4" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Business Contact</p>
                                <p className="text-lg font-bold text-white tracking-[0.1em]">{vendorDetails?.mobileNumber}</p>
                            </motion.div>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-10 rounded-[3rem] bg-zinc-950 border border-zinc-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Map size={140} />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-zinc-900 rounded-xl text-zinc-400">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Establishment Address</h3>
                                </div>
                                
                                <p className="text-2xl md:text-3xl font-bold text-zinc-200 leading-tight max-w-xl uppercase tracking-tighter">
                                    {vendorDetails?.address || "Location not registered"}
                                </p>

                                <div className="mt-10 flex gap-4">
                                   <div className="px-4 py-2 bg-emerald-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
                                     Official Premises
                                   </div>
                                   <div className="px-4 py-2 bg-zinc-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                     {vendorDetails?.age} Yrs Experience
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
                                <Store className="text-zinc-600" size={32} />
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-tight">Marketplace Visibility</p>
                                    <p className="text-xs text-zinc-500 font-medium max-w-sm">Your inventory and services are currently visible to all contractors and users.</p>
                                </div>
                            </div>
                            <InfoTile label="Account Type" value="Verified Vendor" />
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoTile({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
            <p className="text-xs font-bold text-white uppercase">{value}</p>
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