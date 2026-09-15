"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { AlertTriangle, Scale, CreditCard, UserCheck, FileWarning, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
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
                Legal Agreement
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-medium text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Terms and <br />
                Conditions.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-2xl leading-relaxed"
              >
                Welcome to SafeMeet.Ut LLC (KLICK!). By using our services, you agree to the terms described in this document.
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

        {/* Content Section - Structured Style */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="space-y-20">

              {/* Disclaimer: Critical Information */}
              <div className="bg-amber-50 border-2 border-amber-100 p-8 md:p-12 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-medium text-amber-900 uppercase tracking-wider">Important Legal Disclaimer</h2>
                  </div>
                  <div className="grid gap-6 text-amber-800/80 font-medium">
                    <p><strong className="text-amber-900">Not Government:</strong> SafeMeet.Ut LLC (KLICK!) is a private entity. We are NOT affiliated with USCIS or any US government agency.</p>
                    <p><strong className="text-amber-900">Satisfaction & Safety Policy:</strong> Membresía approval is at the sole discretion of Trust & Safety team. Refunds are subject to terms of service and verified safety policies.</p>
                    <p><strong className="text-amber-900">Not Legal Advice:</strong> Our guidance is strictly educational and logistical assistance.</p>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-8">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm font-medium shadow-sm">02</span>
                  Service Description
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "School application guidance",
                    "Form completion (F-1 / B1-B2)",
                    "Interview simulations",
                    "Housing and transportation management"
                  ].map((service, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 font-medium">
                      <UserCheck className="w-5 h-5 text-primary" /> {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments & Refunds */}
              <div className="space-y-8">
                <h2 className="text-3xl font-medium text-[#1d1d1f] tracking-tight flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary text-sm font-medium shadow-sm">03</span>
                  Payments and Refunds
                </h2>
                <div className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-sm">
                  <div className="flex gap-6 items-start mb-8">
                    <CreditCard className="w-8 h-8 text-primary shrink-0" />
                    <p className="text-[#86868b] font-medium leading-relaxed">Fees for SafeMeet.Ut LLC (KLICK!) guidance services are non-refundable once the service has begun (e.g., after the first consultation or form completion).</p>
                  </div>
                  <div className="flex gap-6 items-start">
                    <FileWarning className="w-8 h-8 text-primary shrink-0" />
                    <p className="text-[#86868b] font-medium leading-relaxed">The applicant is responsible for direct payments to third parties (SEVIS fees, MRV fees, airfare, and accommodation).</p>
                  </div>
                </div>
              </div>

              {/* Jurisdiction */}
              <div className="bg-[#1d1d1f] text-white p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-medium mb-6 tracking-tight flex items-center gap-4">
                    <Scale className="w-8 h-8 text-primary" /> Applicable Law
                  </h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                    These terms are governed by the laws of the State of Utah, United States. Any dispute will be resolved exclusively in the courts of Salt Lake County, Utah.
                  </p>
                  <div className="flex items-center gap-4 text-primary font-medium">
                    <HelpCircle className="w-5 h-5" />
                    <span>Questions? +1 385 888 2799</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
