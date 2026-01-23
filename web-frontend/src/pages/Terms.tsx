import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Scale, Globe, AlertTriangle } from "lucide-react";

export default function Terms() {
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
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Protocol v1.0</span>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-16 border-b border-white/5 pb-10">
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Terms of Service</h1>
              <p className="text-sm text-gray-500 mt-1 italic">Effective Date: 21 Jan 2026</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong>Critical Disclosure:</strong> Certisure does not custody private keys. Loss of credentials may result in irreversible loss of access to your digital assets.
            </p>
          </div>
        </header>

        {/* Main Legal Content */}
        <div className="space-y-12 text-sm leading-relaxed">
          
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <span className="text-primary opacity-50 font-mono">01.</span> Introduction
            </h2>
            <p>Welcome to <strong>Certisure</strong>. We provide a decentralized protocol for secure case management, certificate issuance, and the conditional release of digital assets based on verified legal events.</p>
            <p className="mt-4">By accessing the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.</p>
          </section>

          <section className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <span className="text-primary opacity-50 font-mono">02.</span> Silent Nomination
            </h2>
            <p className="text-gray-200 font-medium mb-3 underline decoration-primary/30">This is a core protocol feature:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>You may assign a nominee without prior notification.</li>
              <li>Nominees become aware of their role only upon lawful trigger or release.</li>
              <li>No consent from the nominee is required at assignment time.</li>
            </ul>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Eligibility
              </h2>
              <ul className="list-disc pl-5 text-gray-400 space-y-1">
                <li>Must be at least 18 years old.</li>
                <li>Legal capacity to enter binding agreements.</li>
                <li>Not prohibited by applicable Indian law.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" /> Legal Advice
              </h2>
              <p className="text-gray-400">Certisure is a technical protocol. We do not provide legal, financial, or medical advice. You are responsible for the legal validity of your documents.</p>
            </div>
          </section>

          <section className="border-t border-white/5 pt-10">
            <h2 className="text-xl font-bold text-white mb-4">Contact & Jurisdiction</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Governing Law</p>
                <p className="text-white font-medium">Laws of India</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Operator Email</p>
                <p className="text-primary font-medium">xyz@email.com</p>
              </div>
              <div className="md:text-right">
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Exclusive Jurisdiction</p>
                <p className="text-white font-medium">[Your City], India</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Link back to Login */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <Link to="/">
            <Button variant="link" className="text-primary font-bold">
              Return to Authentication Gate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}