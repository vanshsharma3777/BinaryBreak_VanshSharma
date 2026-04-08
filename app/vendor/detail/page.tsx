"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles,
  Package,
  Layers
} from 'lucide-react';
import VendorHeader from '@/components/vendorHeader';

export default function VendorProductsComingSoon() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white overflow-hidden flex flex-col selection:bg-emerald-500/30">
      <VendorHeader tab="products" />

      <main className="flex-1 relative flex items-center justify-center p-6">
        {/* Design System Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl w-full text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Visual Indicator */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-2xl relative">
                <Package size={32} />
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                   className="absolute -top-1 -right-1 text-zinc-700"
                >
                  <Sparkles size={20} />
                </motion.div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase">
              COMING <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">SOON</span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-[1px] w-8 bg-zinc-800" />
              <p className="text-zinc-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs">
                Product Inventory Intelligence
              </p>
              <div className="h-[1px] w-8 bg-zinc-800" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="group px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:border-zinc-600"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Return to Dashboard
              </motion.button>

              <div className="flex items-center gap-2 px-6 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                 <Layers size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">In Development</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Accent Background Card (Decorative) */}
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-zinc-900/20 border border-zinc-800/30 rounded-full blur-3xl pointer-events-none" />
      </main>
    </div>
  );
}