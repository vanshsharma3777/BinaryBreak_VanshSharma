"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles,
  Package,
  Cpu
} from 'lucide-react';
import VendorHeader from '@/components/vendorHeader';

export default function VendorProductsComingSoon() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-hidden flex flex-col selection:bg-emerald-500/30">
      <VendorHeader tab="products" />

      <main className="flex-1 relative flex items-center justify-center p-6">
        {/* Background Patterns consistent with Profile Pages */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl w-full text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimalist Animated Indicator */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-400 shadow-2xl relative overflow-hidden group">
                  <Package size={36} className="group-hover:text-emerald-400 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute -top-2 -left-2 text-zinc-800"
                >
                  <Cpu size={24} />
                </motion.div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none">
              COMING <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">SOON</span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-14">
              <div className="h-[1px] w-12 bg-zinc-900" />
              <p className="text-zinc-500 font-black tracking-[0.5em] uppercase text-[9px] md:text-[11px]">
                Product Inventory Ecosystem
              </p>
              <div className="h-[1px] w-12 bg-zinc-900" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/vendor/profile')}
                className="group px-10 py-5 bg-white text-black rounded-2xl flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-white/5"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Profile Overview
              </motion.button>

              <div className="flex items-center gap-3 px-8 py-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Module Synchronizing</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Radial Flare */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
}