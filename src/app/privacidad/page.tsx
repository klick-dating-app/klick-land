"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, Lock, Eye, FileText, Globe, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />

      <main>
        {/* Hero Section - Apple Display Style */}
        <section className="relative pt-40 pb-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            <div className="max-w-4xl text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-medium tracking-tight text-xl mb-4 block"
              >
                Security
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Privacy & <br />
                Data Protection.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-2xl leading-relaxed"
              >
                At SafeMeet.Ut LLC (KLICK!), we value your trust. That is why we are transparent about how we handle your personal information throughout your matching process.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-sm font-medium text-slate-400 uppercase tracking-widest"
              >
                Last updated: January 2026
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section - Editorial Style */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="prose prose-slate prose-lg max-w-none space-y-16">

              <div className="space-y-6">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm">01</span>
                  Introduction
                </h2>
                <p className="text-[#86868b] font-medium leading-relaxed text-lg">
                  At SafeMeet.Ut LLC (KLICK!) ("we", "our", or "the Company"), we value your privacy and are committed to protecting your personal information. This Privacy Policy details how we collect, use, share, and protect information from users who use our matchmaking, membership, and coaching services.
                </p>
              </div>

              <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary text-sm shadow-sm">02</span>
                  Information We Collect
                </h2>
                <div className="grid gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-medium text-[#1d1d1f] mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-500" /> Personal Identification
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Full name, date of birth, contact details (WhatsApp, Email), profile preferences, and verification details.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-medium text-[#1d1d1f] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" /> Profile & Preferences
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Relationship goals, lifestyle preferences, interests, compatibility answers, and verification records.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-medium text-[#1d1d1f] mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-500" /> Location & Security Data
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Location preferences, interaction history, device details, and identity check data as required by policy.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm">03</span>
                  How We Use Your Information
                </h2>
                <ul className="grid sm:grid-cols-2 gap-4 list-none p-0">
                  {["Service Delivery & Matchmaking", "Personalized Coaching", "Profile Verification", "Direct Communication"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 p-10 bg-[#1d1d1f] rounded-[3rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <h2 className="text-3xl font-medium tracking-tight mb-6">User Rights</h2>
                <p className="text-slate-400 font-medium mb-8">You maintain full control over your personal information at all times.</p>
                <div className="grid gap-4">
                  {["Access your personal data", "Correction of inaccurate information", "Request data deletion", "Opt-out of marketing communications"].map((right, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <Eye className="w-5 h-5 text-primary" />
                      <span className="font-medium">{right}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 text-center py-12">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight">Privacy Contact</h2>
                <p className="text-[#86868b] font-medium">support@klick.app • Salt Lake City, Utah, USA</p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
