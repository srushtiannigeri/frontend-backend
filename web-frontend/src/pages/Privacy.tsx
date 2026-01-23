import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Eye, Database, ShieldAlert, UserCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-gray-300 p-6 md:p-12 lg:p-20 bg-gradient-mesh overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-glass/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
            <Lock className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400">DPDP Act Compliant</span>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-16 border-b border-white/5 pb-10">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Eye className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-1 italic">Effective Date: 21 Jan 2026</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Certisure is committed to protecting your personal data in compliance with the 
            <strong> Digital Personal Data Protection Act, 2023 (India)</strong>. We operate on a 
            Zero-Knowledge basis where sensitive data remains encrypted and under your control.
          </p>
        </header>

        {/* Main Privacy Content */}
        <div className="space-y-12 text-sm leading-relaxed">
          
          {/* Data Collection */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <Database className="w-5 h-5 text-blue-400" /> Data We Collect
              </h2>
              <ul className="space-y-2 text-gray-400">
                <li className="flex gap-2"><span>•</span> Wallet addresses</li>
                <li className="flex gap-2"><span>•</span> Email (OAuth/Embedded login)</li>
                <li className="flex gap-2"><span>•</span> IP address (Abuse prevention)</li>
                <li className="flex gap-2"><span>•</span> Role-based protocol assignments</li>
              </ul>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <ShieldAlert className="w-5 h-5 text-red-400" /> Off-Chain Only
              </h2>
              <p className="text-gray-400 mb-3">The following never touch the blockchain:</p>
              <ul className="space-y-2 text-gray-300 font-medium">
                <li>Encrypted legal documents</li>
                <li>Evidence metadata</li>
                <li>Audit and access logs</li>
              </ul>
            </div>
          </section>

          {/* Purpose of Processing */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6 underline decoration-blue-500/30">
              Purpose of Processing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Authentication & Access",
                "Case Lifecycle Management",
                "Nominee Assignment",
                "Trigger Verification",
                "Fraud Prevention",
                "Regulatory Compliance"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DPDP Rights */}
          <section className="p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
              <UserCheck className="w-6 h-6 text-blue-400" /> Your Rights (DPDP Act)
            </h2>
            <p className="mb-6 text-gray-400 italic">As a Data Principal under Indian law, you have the right to:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-bold">Access & Correct</h3>
                <p className="text-xs text-gray-500">Request a summary of your data and correct any inaccuracies in your profile.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">Withdraw Consent</h3>
                <p className="text-xs text-gray-500">You may withdraw consent at any time, though this may restrict protocol functionality.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">File Grievances</h3>
                <p className="text-xs text-gray-500">Direct concerns to our Grievance Officer or the Data Protection Board of India.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">Erasure</h3>
                <p className="text-xs text-gray-500">Request deletion of off-chain data where legally permissible.</p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="border-t border-white/5 pt-10">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Data Fiduciary</p>
                <p className="text-white font-bold text-lg">Certisure</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Grievance Officer Email</p>
                <p className="text-blue-400 font-bold text-lg">privacy@xyz.com</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Link */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <Link to="/">
            <Button variant="link" className="text-blue-400 font-bold">
              Return to Authentication Gate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}