"use client";

import React, { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Loader } from "../components/loader";
import { Menu, X, LogOut, User as UserIcon, Briefcase } from "lucide-react";

export default function WorkerHeader({ tab }: { tab: string }): JSX.Element | null {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") return null;

  if (status === "unauthenticated") return null;

  const navLinks = [
    { name: "Dashboard", href: "/worker/profile", id: "profile" },
    { name: "Active Tasks", href: "/worker/active-work", id: "active" },
    { name: "Profile Settings", href: "/worker/update-profile", id: "update" },
  ];

  return (
    <header className="sticky top-0 z-[100] border-b border-zinc-800/50 bg-[#030303]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <span 
          className="font-black text-2xl tracking-tighter cursor-pointer text-white" 
          onClick={() => router.push('/signin')} 
        >
          Kaam<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Bazar</span>
        </span>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = tab === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-200"
              >
                <span className={isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="worker-nav-underline"
                    className="absolute bottom-0 left-5 right-5 h-[2px] bg-gradient-to-r from-blue-400 to-emerald-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-[1.5px] shadow-lg shadow-blue-500/10"
            >
              <div className="w-full h-full bg-[#030303] rounded-[10px] flex items-center justify-center text-white text-sm font-black">
                {session?.user?.name?.charAt(0).toUpperCase() || "W"}
              </div>
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute right-0 mt-4 w-60 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-[110]"
                >
                  <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/30">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Worker Mode</p>
                    <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
                  </div>
                  
                  <Link
                    href="/worker/profile"
                    className="flex items-center gap-3 px-5 py-3.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserIcon size={14} /> My Dashboard
                  </Link>
                  
                  <button 
                    onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-red-500 hover:bg-red-500/10 transition-colors text-[10px] font-black uppercase tracking-widest border-t border-zinc-900"
                  >
                    <LogOut size={14} /> End Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-[#030303] overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              <div className="px-4 py-2 mb-2">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Worker Console</p>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    tab === link.id 
                      ? "bg-zinc-900 text-white border border-zinc-800" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] bg-zinc-800 my-4" />
              <button 
                onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
                className="w-full text-left px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}