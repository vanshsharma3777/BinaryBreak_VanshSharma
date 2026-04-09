"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  ShieldCheck,
  Layout,
  Database,
  Key,
  Smartphone,
  Heart,
  Zap,
  TrendingUp,
  UserPlus,
  Globe,
  Command
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AboutKaamBazar() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace("/role");
    }
  }, [status, router]);

  const features = [
    {
      title: "Worker Direct-Hire",
      description: "No more waiting at labor hubs. Workers get real-time alerts for jobs posted in their vicinity.",
      icon: <TrendingUp className="text-emerald-400" />,
    },
    {
      title: "Vendor Marketplace",
      description: "Local shops digitize inventory, reaching customers directly without intermediary markup.",
      icon: <Store className="text-blue-400" />,
    },
    {
      title: "P2P Job Posting",
      description: "Users post requirements directly. Skilled labor responds instantly, bypassing traditional brokers.",
      icon: <UserPlus className="text-purple-400" />,
    }
  ];

  function SocialLink({ href, iconType, label }: { href: string; iconType: 'github' | 'twitter' | 'linkedin'; label: string }) {
    const icons = {
      github: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
      ),
      twitter: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
      ),
      linkedin: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
      )
    };

    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -3 }}
        className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all shadow-xl"
        aria-label={label}
      >
        {icons[iconType]}
      </motion.a>
    );
  }
  return (
    <div className="w-full min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Style Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Globe size={12} className="text-blue-500" /> Decentralizing Local Commerce
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black mb-8 tracking-tighter uppercase leading-none"
          >
            Kaam<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Bazar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            A broker-free ecosystem where skilled labor finds consistent employment and local vendors connect directly with the community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => router.push('/api/auth/signin')}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl"
            >
              Access Platform
            </button>
            <button onClick={()=>{
              router.push('/documentation')
            }} className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all">
              Documentation
            </button>
          </motion.div>
        </div>
      </section>

      {/* Logic Breakdown */}
      <section className="py-24 px-6 relative border-y border-zinc-900 bg-zinc-950/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
              <Zap className="text-yellow-400" size={28} /> Disrupting the Middleware
            </h2>
            <div className="space-y-6 text-zinc-500 font-medium leading-relaxed">
              <p>
                Traditional systems force workers to waste hours at physical labor hubs. Users are often overcharged by middlemen who provide zero value.
              </p>
              <div className="p-6 bg-zinc-900/50 rounded-[2rem] border border-zinc-800">
                <p className="text-zinc-300 italic">
                  "KaamBazar digitizes localized demand, ensuring the nearest professional is notified instantly, eliminating broker commissions."
                </p>
              </div>
              <p>
                From home repairs to inventory sourcing, we bridge the gap with <span className="text-white font-bold underline decoration-blue-500">Real-time Location Intelligence</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors group-hover:bg-blue-500/10">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm uppercase tracking-widest mb-1">{f.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Components */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Core Infrastructure</h2>
            <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">Scalable Full-Stack Architecture</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard icon={<Layout size={20} />} title="Next.js 14" desc="React-based framework for high-performance server-side rendering." />
            <TechCard icon={<Key size={20} />} title="Secure Auth" desc="NextAuth integration for enterprise-grade security across roles." />
            <TechCard icon={<Database size={20} />} title="Relational Data" desc="Prisma ORM managing complex relationships between users and tasks." />
            <TechCard icon={<Smartphone size={20} />} title="Mobile First" desc="Responsive architecture optimized for field workers on the move." />
            <TechCard icon={<Command size={20} />} title="Framer Motion" desc="Fluid, interactive UI transitions for a professional feel." />
            <TechCard icon={<ShieldCheck size={20} />} title="Direct Logic" desc="Custom P2P communication protocols built to bypass middlemen." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">
                Kaam<span className="text-blue-500">Bazar</span>
              </h2>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                Handcrafted with <Heart size={12} className="text-red-500 fill-red-500" /> by <span className="text-zinc-200">Vansh</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <SocialLink href="https://github.com/vanshsharma3777" iconType="github" label="GitHub" />
              <SocialLink href="https://x.com/itz_sharmaji001" iconType="twitter" label="X" />
              <SocialLink href="https://www.linkedin.com/in/vansh-sharma-812199316/" iconType="linkedin" label="LinkedIn" />
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
            <p className="text-zinc-700 text-[9px] tracking-[0.4em] uppercase font-black">
              © 2026 KaamBazar • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TechCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-white">{title}</h3>
      <p className="text-zinc-500 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all shadow-xl"
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}