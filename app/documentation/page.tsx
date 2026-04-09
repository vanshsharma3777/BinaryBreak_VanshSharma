"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Map, 
  Database, 
  Code2, 
  ArrowRight,
  Workflow,
  Cpu
} from 'lucide-react';

export default function DocumentationPage() {
  const router = useRouter();

  const techStack = [
    { name: "Next.js 14", detail: "App Router & SSR", icon: <Layers size={18} /> },
    { name: "Tailwind CSS", detail: "Onyx Design System", icon: <Zap size={18} /> },
    { name: "Prisma", detail: "PostgreSQL ORM", icon: <Database size={18} /> },
    { name: "NextAuth", detail: "Role-based Auth", icon: <ShieldCheck size={18} /> },
    { name: "OSRM API", detail: "Free Road Routing", icon: <Map size={18} /> },
    { name: "Framer Motion", detail: "Fluid UI/UX", icon: <Cpu size={18} /> },
  ];

  const systemFlow = [
    {
      step: "01",
      title: "Authentication",
      desc: "Google OAuth via NextAuth. Users are redirected to a Role Selection gateway to define their entity (User, Worker, or Vendor).",
      color: "border-blue-500/50"
    },
    {
      step: "02",
      title: "Geospatial Mapping",
      desc: "Address input is converted to coordinates via LocationIQ. This data is indexed for proximity-based matching.",
      color: "border-emerald-500/50"
    },
    {
      step: "03",
      title: "The Marketplace",
      desc: "Users post tasks. The system calculates real-time road distance and travel time between the user and available workers using OSRM.",
      color: "border-cyan-500/50"
    },
    {
      step: "04",
      title: "Direct P2P Connect",
      desc: "Workers view requirements and contact users directly. No middleman, no commission fees, complete transparency.",
      color: "border-purple-500/50"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30 font-sans pb-20">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 pt-12 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Docs</span>
        </button>

        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4"
          >
            System <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400">Architecture</span>
          </motion.h1>
          <p className="text-zinc-500 max-w-2xl font-medium">
            KaamBazar is a decentralized local service protocol built to solve the labor-market inefficiency in urban and semi-urban areas.
          </p>
        </header>

        {/* Tech Stack Grid */}
        <section className="mb-32">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8 flex items-center gap-2">
            <Code2 size={14} /> The Technical Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl text-center group hover:border-zinc-700 transition-all"
              >
                <div className="text-zinc-500 group-hover:text-emerald-400 transition-colors mb-4 flex justify-center">
                  {tech.icon}
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-1">{tech.name}</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase">{tech.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Logical Flow (The Arrows Section) */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-12 flex items-center gap-2">
            <Workflow size={14} /> Core Workflow
          </h2>
          
          <div className="relative space-y-12">
            {systemFlow.map((flow, i) => (
              <div key={i} className="relative flex flex-col md:flex-row gap-8 items-start">
                {/* Connector Line */}
                {i !== systemFlow.length - 1 && (
                  <div className="hidden md:block absolute left-7 top-16 w-[2px] h-24 bg-gradient-to-b from-zinc-800 to-transparent" />
                )}
                
                <div className={`w-14 h-14 shrink-0 rounded-2xl border-2 ${flow.color} bg-zinc-950 flex items-center justify-center font-black text-xl z-10 shadow-2xl shadow-zinc-950`}>
                  {flow.step}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] flex-1 group hover:bg-zinc-900/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black tracking-tighter uppercase">{flow.title}</h3>
                    <ArrowRight className="text-zinc-800 group-hover:text-zinc-400 group-hover:translate-x-2 transition-all" />
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    {flow.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <footer className="mt-32 p-12 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Final Verdict</p>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm font-medium leading-relaxed">
            "The project successfully bridges the gap between digital demand and physical supply by eliminating the broker layer, resulting in higher wages for workers and lower costs for users."
          </p>
        </footer>
      </main>
    </div>
  );
}