'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    PlusCircle,
    Image as ImageIcon,
    Send,
    X,
    AlertCircle,
    Briefcase,
} from 'lucide-react';
import getLatitudeLongitude from "@/lib/getLatitudeLongitude";
import { Loader } from "@/components/loader";
import UserHeader from "@/components/userheader";

interface UserDetails {
    name: string,
    address: string,
    mobileNumber: string
    lat: number
    lng: number
}

export default function Dashboard() {
    const role = 'user'
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [] as File[],
        address: '',
        lat: 0.0,
        lng: 0.0,
        isActive: true,
    });
    useEffect(() => {
        async function getResponse() {
            if (status === 'unauthenticated') {
                router.replace('/')
            } else if (status === 'authenticated') {
                try {
                    const res = await axios.get(`/api/${role}/details`)
                    if (!res.data.success) {
                        router.replace('/user/create-profile')
                        return
                    }
                    setUserDetails(res.data.userDetails)
                } catch (err) {
                    console.error("API error:", err)
                }
            }
        }
        getResponse()
    }, [router, role, status])

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateAndConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.address) {
            toast.error("Please fill all required fields", {
                style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' }
            });
            return;
        }
        setShowConfirm(true);
    };

    const submitWork = async () => {
        setLoading(true);
        setShowConfirm(false);
        try {
            const location = await getLatitudeLongitude(formData.address)
            const finalData = {
                ...formData,
                lat: location?.lat ?? 0,
                lng: location?.lng ?? 0
            }
            await axios.post('/api/work', finalData)
            toast.success("Work posted successfully!", {
                icon: '🚀',
                style: { background: '#064e3b', color: '#fff', border: '1px solid #10b981' }
            })
            router.replace('/user/get-work')
        } catch (err) {
            toast.error("Failed to post work")
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <Loader />;

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <UserHeader tab={"create"} />
            <Toaster position="top-center" />

            <div className="relative p-6 flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.03),transparent_50%)] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl z-10"
                >
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
                            <PlusCircle size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter">
                                Post New Work
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium tracking-tight">Broadcast your requirement to local professionals</p>
                        </div>
                    </div>

                    <form onSubmit={validateAndConfirm} className="space-y-7">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">
                                Type of Work Needed
                            </label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors z-10 pointer-events-none" />

                                <select
                                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-12 pr-10 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all appearance-none cursor-pointer font-medium selection:bg-zinc-800"
                                    style={{ color: formData.title ? '#d4d4d8' : '#52525b' }}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                >
                                    <option value="" disabled className="bg-[#030303] text-zinc-700">Select Service Required</option>
                                    <option value="Plumber" className="bg-[#030303] text-zinc-300">Plumber (Plumbing Work)</option>
                                    <option value="Carpenter" className="bg-[#030303] text-zinc-300">Carpenter (Woodwork)</option>
                                    <option value="Electrician" className="bg-[#030303] text-zinc-300">Electrician (Wiring/Repairs)</option>
                                    <option value="Painter" className="bg-[#030303] text-zinc-300">Painter (Painting & Polishing)</option>
                                    <option value="Welder" className="bg-[#030303] text-zinc-300">Welder (Metal Fabrication)</option>
                                    <option value="Tailor" className="bg-[#030303] text-zinc-300">Tailor (Stitching/Alterations)</option>
                                    <option value="Tutor" className="bg-[#030303] text-zinc-300">Home Tutor (Education)</option>
                                    <option value="Mason" className="bg-[#030303] text-zinc-300">Mason (Construction/Mistri)</option>
                                    <option value="Mechanic" className="bg-[#030303] text-zinc-300">Vehicle Mechanic</option>
                                    <option value="Cleaning" className="bg-[#030303] text-zinc-300">House Cleaning Service</option>
                                    <option value="Gardener" className="bg-[#030303] text-zinc-300">Gardener</option>
                                    <option value="Chef" className="bg-[#030303] text-zinc-300">Cook / Chef</option>
                                    <option value="Barber" className="bg-[#030303] text-zinc-300">Barber (Home Service)</option>
                                    <option value="Agent" className="bg-[#030303] text-zinc-300">Delivery Agent</option>
                                </select>

                                {/* Custom Chevron Icon */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-400 transition-colors">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Detailed Description</label>
                            <textarea
                                rows={4}
                                placeholder="Explain the task clearly (English or Hindi)..."
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700 resize-none leading-relaxed"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Site Address</label>
                            <textarea
                                rows={2}
                                placeholder="Where exactly is the work located?"
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-700 resize-none"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Visual Reference (Optional)</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-zinc-800/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/30 transition-all duration-300"
                            >
                                <ImageIcon className="text-zinc-700 group-hover:text-zinc-400 mb-2 transition-colors" size={32} />
                                <p className="text-zinc-600 group-hover:text-zinc-400 text-xs font-bold uppercase tracking-widest">Upload Photos</p>
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {formData.images.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {formData.images.map((file, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 group/img">
                                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="preview" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, backgroundColor: '#2563eb' }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish Work"} <Send size={18} />
                        </motion.button>
                    </form>
                </motion.div>

                <AnimatePresence>
                    {showConfirm && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowConfirm(false)}
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center"
                            >
                                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-3 uppercase">Confirm Posting</h2>
                                <p className="text-zinc-500 mb-8 text-xs font-medium leading-relaxed tracking-wide">
                                    Your request will be sent to verified professionals in your proximity. Ensure address details are correct.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 px-4 py-4 rounded-xl border border-zinc-800 font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={submitWork}
                                        className="flex-1 px-4 py-4 rounded-xl bg-blue-600 font-bold text-[10px] uppercase tracking-widest text-white shadow-lg shadow-blue-900/20"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}