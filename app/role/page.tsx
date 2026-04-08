"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/loader';

const roles = [
  {
    id: 'user',
    title: 'Regular User',
    description: 'Hire professionals for your projects and manage tasks.',
    icon: '👤',
    buttonColor: 'bg-blue-600',
    buttonTextColor: 'text-white',
    buttonBorder: 'border-blue-500',
    hoverEffect: 'group-hover:border-blue-400 group-hover:bg-blue-500'
  },
  {
    id: 'worker',
    title: 'Service Worker',
    description: 'Find work, showcase your skills, and earn daily wages.',
    icon: '👷',
    buttonColor: 'bg-cyan-500',
    buttonTextColor: 'text-black',
    buttonBorder: 'border-cyan-400',
    hoverEffect: 'group-hover:border-cyan-300 group-hover:bg-cyan-400'
  },
  {
    id: 'vendor',
    title: 'Vendor / Supplier',
    description: 'Sell construction materials or rent out heavy equipment.',
    icon: '🏗️',
    buttonColor: 'bg-emerald-600',
    buttonTextColor: 'text-white',
    buttonBorder: 'border-emerald-500',
    hoverEffect: 'group-hover:border-emerald-400 group-hover:bg-emerald-500'
  }
];

export default function RoleSelection() {
  const { status } = useSession();
  const router = useRouter();
    console.log(status)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  const handleSelection = (role: string) => {
    router.push(`${role}/profile`);
  };

  if (status === "loading") return <Loader />;

  if (status === "authenticated") {
    return (
      <div className="min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.8),transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">KaamBazar</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium tracking-tight">
            Select your journey to continue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => handleSelection(role.id)}
              className="cursor-pointer group"
            >
              <div className="relative h-full p-8 rounded-3xl bg-zinc-950/60 backdrop-blur-lg border border-zinc-800 transition-all duration-300 group-hover:border-zinc-700/50 group-hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.05)]">
                
                <div className="w-14 h-14 mb-7 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shadow-inner group-hover:-rotate-3 group-hover:bg-zinc-800 transition-all duration-300">
                  <span className="grayscale group-hover:grayscale-0 transition-all duration-300">
                    {role.icon}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {role.title}
                </h2>
                
                <p className="text-zinc-400 leading-relaxed mb-10 text-sm">
                  {role.description}
                </p>
                <div className={`flex items-center justify-center w-full px-5 py-3.5 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all duration-300 ${role.buttonColor} ${role.buttonTextColor} ${role.buttonBorder} ${role.hoverEffect}`}>
                  Get Started
                  <svg className="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}